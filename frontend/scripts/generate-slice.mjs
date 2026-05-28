#!/usr/bin/env node
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'

const GENERATED_DIR = path.resolve(import.meta.dirname, '../src/api/generated')
const SLICES_DIR = path.resolve(import.meta.dirname, '../src/store/slices')
const STORE_FILE = path.resolve(import.meta.dirname, '../src/store/store.ts')

function parseCliArgs() {
  const args = process.argv.slice(2)
  const opts = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--module' || args[i] === '-m') opts.module = args[++i]
    else if (args[i] === '--entity' || args[i] === '-e') opts.entity = args[++i]
    else if (args[i] === '--slice' || args[i] === '-s') opts.slice = args[++i]
    else if (args[i] === '--register' || args[i] === '-r') opts.register = true
    else if (args[i] === '--no-register') opts.register = false
    else if (args[i] === '--force' || args[i] === '-f') opts.force = true
    else if (args[i] === '--overwrite-custom') opts.overwriteCustom = true
    else if (args[i] === '--help' || args[i] === '-h') {
      printUsage()
      process.exit(0)
    }
  }
  return opts
}

function printUsage() {
  console.log(`
  Usage: node scripts/generate-slice.mjs [options]

  Options:
    -m, --module <name>   API module name (e.g. events, tenants, accounts)
    -e, --entity <Name>   Entity name in PascalCase (default: singularized module name)
    -s, --slice  <name>   Slice name in camelCase (default: same as entity in camelCase)
    -r, --register        Auto-register in store.ts (default when interactive: ask)
        --no-register     Skip store.ts registration
    -f, --force           Regenerate even if service hasn't changed
        --overwrite-custom Allow overwriting non-generated slices
    -h, --help            Show this help

  By default, only creates/updates slices whose API service file has changed
  since the last generation. Unchanged slices are skipped.

  Examples:
    node scripts/generate-slice.mjs                          # sync all modules
    node scripts/generate-slice.mjs -m events                # sync single module
    node scripts/generate-slice.mjs --force                  # regenerate all
    npm run generate:slice -- -m tenants --force
`)
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans.trim()) }))
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16)
}

function readEmbeddedHash(sliceFile) {
  if (!fs.existsSync(sliceFile)) return null
  const content = fs.readFileSync(sliceFile, 'utf-8')
  const match = content.match(/\/\/ @generated-from-service\s+(\w+)/)
  return match?.[1] ?? null
}

function discoverApiModules() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.error(`  Generated API directory not found: ${GENERATED_DIR}`)
    process.exit(1)
  }

  const entries = fs.readdirSync(GENERATED_DIR, { withFileTypes: true })
  const modules = []

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'models') continue
    const apiFile = path.join(GENERATED_DIR, entry.name, `${entry.name}.ts`)
    if (fs.existsSync(apiFile)) {
      modules.push({ name: entry.name, file: apiFile })
    }
  }
  return modules
}

function parseApiModule(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8')

  const factoryMatch = source.match(/export\s+const\s+(\w+)\s*=\s*\(\)\s*=>/)
  if (!factoryMatch) return null
  const factoryName = factoryMatch[1]

  const returnMatch = source.match(/return\s*\{([^}]+)\}/)
  if (!returnMatch) return null
  const methodNames = returnMatch[1].split(',').map((s) => s.trim()).filter(Boolean)

  const methods = []
  for (const name of methodNames) {
    const fnRegex = new RegExp(
      `const\\s+${name}\\s*=\\s*\\(([\\s\\S]*?)\\)\\s*=>`,
    )
    const fnMatch = source.match(fnRegex)

    let params = []
    if (fnMatch) {
      const paramStr = fnMatch[1].trim()
      if (paramStr) {
        params = paramStr
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => {
            const [rawName, rawType] = p.split(':').map((s) => s.trim())
            const isOptional = rawName.endsWith('?')
            return {
              name: rawName.replace('?', ''),
              type: rawType || 'unknown',
              optional: isOptional,
            }
          })
      }
    }

    const summaryRegex = new RegExp(`@summary\\s+(.+)\\s*\\n\\s*\\*/\\s*\\nconst\\s+${name}\\s*=`)
    const summaryMatch = source.match(summaryRegex)

    methods.push({
      name,
      params,
      summary: summaryMatch?.[1]?.trim() ?? '',
    })
  }

  const importMatch = source.match(/import\s+type\s*\{([^}]+)\}\s*from\s*'\.\.\/models'/)
  const modelImports = importMatch
    ? importMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const factoryExportName = factoryName
  return { factoryName, factoryExportName, methods, modelImports, moduleName: path.basename(path.dirname(filePath)) }
}

function toPascalCase(str) {
  return str.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase())
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function generateSlice(parsed, entityName, sliceName, serviceHash) {
  const pascal = toPascalCase(entityName)
  const sliceCamel = toCamelCase(sliceName)
  const apiVarName = `${toCamelCase(parsed.moduleName)}Api`

  const usedModelTypes = new Set()
  for (const m of parsed.methods) {
    for (const p of m.params) {
      if (parsed.modelImports.includes(p.type)) {
        usedModelTypes.add(p.type)
      }
    }
  }

  const modelImportLine = usedModelTypes.size > 0
    ? `import type {\n${[...usedModelTypes].map((t) => `  ${t},`).join('\n')}\n} from '../../api/generated/models'\n`
    : ''

  const thunks = []
  const extraReducerCases = []

  const reservedNames = new Set([parsed.factoryName, `${pascal}State`, pascal, `${sliceCamel}Slice`])

  for (const method of parsed.methods) {
    let thunkName = method.name
    if (reservedNames.has(thunkName)) {
      if (/^get/i.test(thunkName)) thunkName = thunkName.replace(/^get/, 'fetch')
      else thunkName = `do${thunkName.charAt(0).toUpperCase()}${thunkName.slice(1)}`
    }
    const actionPrefix = `${sliceCamel}/${thunkName}`

    const hasIdParam = method.params.some((p) => p.name === 'id')
    const bodyParams = method.params.filter((p) => p.name !== 'id')

    let argType, argDestructure, apiCallArgs

    if (method.params.length === 0) {
      argType = 'void'
      argDestructure = '_'
      apiCallArgs = ''
    } else if (hasIdParam && bodyParams.length === 0) {
      argType = '{ id: string }'
      argDestructure = '{ id }'
      apiCallArgs = 'id'
    } else if (hasIdParam && bodyParams.length > 0) {
      const bodyFields = bodyParams.map((p) => `${p.name}: ${p.type}`).join('; ')
      argType = `{ id: string; ${bodyFields} }`
      argDestructure = `{ id, ${bodyParams.map((p) => p.name).join(', ')} }`
      apiCallArgs = `id, ${bodyParams.map((p) => p.name).join(', ')}`
    } else if (bodyParams.length === 1) {
      argType = bodyParams[0].type
      argDestructure = toCamelCase(bodyParams[0].name)
      apiCallArgs = argDestructure
    } else {
      const fields = bodyParams.map((p) => `${p.name}: ${p.type}`).join('; ')
      argType = `{ ${fields} }`
      argDestructure = `{ ${bodyParams.map((p) => p.name).join(', ')} }`
      apiCallArgs = bodyParams.map((p) => p.name).join(', ')
    }

    const isListMethod = /^(list|get[A-Z]\w*s$|fetch|findAll)/i.test(method.name)
    const isDeleteMethod = /^(delete|remove)/i.test(method.name)
    const isGetByIdMethod = /^(get\w+ById|find\w+ById|fetch\w+ById)/i.test(method.name)

    let returnType = 'unknown'
    if (isDeleteMethod) returnType = 'string'

    const summary = method.summary ? `/** ${method.summary} */\n` : ''

    thunks.push(
`${summary}export const ${thunkName} = createAsyncThunk<${returnType}, ${argType}, { rejectValue: string }>(
  '${actionPrefix}',
  async (${argDestructure}, { rejectWithValue }) => {
    try {
      const data = await ${apiVarName}.${method.name}(${apiCallArgs})
      return data as ${returnType}
    } catch (err) {
      return rejectWithValue(extractError(err, 'Failed: ${method.name}'))
    }
  },
)`)

    if (isListMethod) {
      extraReducerCases.push(
`      .addCase(${thunkName}.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(${thunkName}.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload as ${pascal}[]
      })
      .addCase(${thunkName}.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: ${method.name}'
      })`)
    } else if (isDeleteMethod) {
      extraReducerCases.push(
`      .addCase(${thunkName}.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(${thunkName}.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed: ${method.name}'
      })`)
    } else if (isGetByIdMethod) {
      extraReducerCases.push(
`      .addCase(${thunkName}.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(${thunkName}.fulfilled, (state, action) => {
        state.loading = false
        state.currentItem = action.payload as ${pascal}
      })
      .addCase(${thunkName}.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: ${method.name}'
      })`)
    } else {
      extraReducerCases.push(
`      .addCase(${thunkName}.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(${thunkName}.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(${thunkName}.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed: ${method.name}'
      })`)
    }
  }

  return `// @generated-from-service ${serviceHash}
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { ${parsed.factoryName} } from '../../api/generated/${parsed.moduleName}/${parsed.moduleName}'
${modelImportLine}
const ${apiVarName} = ${parsed.factoryName}()

// TODO: define the shape of your entity
export interface ${pascal} {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface ${pascal}State {
  items: ${pascal}[]
  currentItem: ${pascal} | null
  loading: boolean
  error: string | null
}

const initialState: ${pascal}State = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
}

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(err)) {
    const msg = err.response?.data?.message
    if (typeof msg === 'string') return msg
    if (err.response?.status === 403) return 'You do not have permission for this action.'
    if (err.code === 'ERR_NETWORK') return 'Cannot reach the API.'
  }
  if (err instanceof Error) return err.message
  return fallback
}

${thunks.join('\n\n')}

export const ${sliceCamel}Slice = createSlice({
  name: '${sliceCamel}',
  initialState,
  reducers: {
    clear${pascal}Error(state) {
      state.error = null
    },
    setCurrent${pascal}(state, action) {
      state.currentItem = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
${extraReducerCases.join('\n')}
  },
})

export const { clear${pascal}Error, setCurrent${pascal} } = ${sliceCamel}Slice.actions
export default ${sliceCamel}Slice.reducer
`
}

function registerInStore(sliceName) {
  if (!fs.existsSync(STORE_FILE)) {
    console.log(`\n  Store file not found at ${STORE_FILE} -- skip auto-registration.`)
    return false
  }
  const camel = toCamelCase(sliceName)
  const source = fs.readFileSync(STORE_FILE, 'utf-8')

  if (source.includes(`${camel}Slice`)) {
    console.log(`\n  Slice "${camel}" already registered in store.`)
    return false
  }

  const importLine = `import ${camel}Reducer from './slices/${camel}Slice'`
  const reducerLine = `    ${camel}: ${camel}Reducer,`

  let updated = source.replace(
    /(import\s+\w+Reducer\s+from\s+'\.\/slices\/\w+Slice'[\s\S]*?\n)(\n)/,
    `$1${importLine}\n$2`,
  )

  updated = updated.replace(
    /(reducer:\s*\{[\s\S]*?)(^\s*\},)/m,
    `$1${reducerLine}\n$2`,
  )

  fs.writeFileSync(STORE_FILE, updated)
  return true
}

function processModule(selected, cli) {
  const parsed = parseApiModule(selected.file)
  if (!parsed) {
    console.log(`  [skip] Could not parse: ${selected.name}`)
    return false
  }

  const serviceName = parsed.factoryName.replace(/^get/, '')
  const entityName = cli.entity || serviceName.replace(/s$/, '')
  const sliceName = cli.slice || toCamelCase(entityName)
  const outFile = path.join(SLICES_DIR, `${sliceName}Slice.ts`)

  const currentHash = hashFile(selected.file)

  if (fs.existsSync(outFile) && !cli.force) {
    const existingHash = readEmbeddedHash(outFile)
    if (!existingHash) {
      if (!cli.overwriteCustom) {
        console.log(`  [skip]      ${sliceName}Slice.ts — custom file (use --overwrite-custom to replace)`)
        return false
      }
      console.log(`  [replace]   ${sliceName}Slice.ts — overwriting custom file by request`)
    }
    if (existingHash === currentHash) {
      console.log(`  [unchanged] ${sliceName}Slice.ts — service not modified`)
      return false
    }
    if (existingHash) {
      console.log(`  [changed]   ${sliceName}Slice.ts — service updated, regenerating...`)
    }
  }

  const sliceCode = generateSlice(parsed, entityName, sliceName, currentHash)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, sliceCode)
  console.log(`  Created: ${path.relative(process.cwd(), outFile)}`)

  if (cli.register !== false) {
    const registered = registerInStore(sliceName)
    if (registered) {
      console.log(`  Updated: ${path.relative(process.cwd(), STORE_FILE)}`)
    }
  }

  return true
}

async function main() {
  const cli = parseCliArgs()

  console.log('\n  Redux Slice Generator')
  console.log('  =====================\n')

  const modules = discoverApiModules()
  if (modules.length === 0) {
    console.error('  No API modules found. Run `npm run generate:api` first.')
    process.exit(1)
  }

  const targets = cli.module
    ? modules.filter((m) => m.name === cli.module)
    : modules

  if (cli.module && targets.length === 0) {
    console.error(`  Module "${cli.module}" not found. Available: ${modules.map((m) => m.name).join(', ')}`)
    process.exit(1)
  }

  let created = 0
  for (const mod of targets) {
    console.log(`\n  Module:  ${mod.name}`)
    const parsed = parseApiModule(mod.file)
    if (parsed) {
      console.log(`  Factory: ${parsed.factoryName}()`)
      console.log(`  Methods: ${parsed.methods.map((m) => m.name).join(', ')}`)
    }
    if (processModule(mod, cli.module ? cli : { ...cli, entity: undefined, slice: undefined })) {
      created++
    }
  }

  console.log(`\n  Done! Generated ${created} slice${created !== 1 ? 's' : ''}. Review and fill in entity interface fields.\n`)
}

main()
