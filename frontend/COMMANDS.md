# Frontend Commands

> Maintenance note: whenever frontend commands/scripts are added or changed in `package.json`, update this file in the same change.

## Setup

```powershell
cd c:\Projects\Backend_Api\frontend
npm install
Copy-Item .env.example .env
```

## Run Dev Server

```powershell
cd c:\Projects\Backend_Api\frontend
npm run dev
```

## Build And Preview

```powershell
cd c:\Projects\Backend_Api\frontend
npm run build
npm run preview
```

## Regenerate API Client

```powershell
cd c:\Projects\Backend_Api\frontend
npm run generate:api
```

## Regenerate Redux Slices

```powershell
cd c:\Projects\Backend_Api\frontend
npm run generate:slice
npm run generate:slice -- -m tenants
```

## Regenerate Tenant Slice To Separate Generated File

```powershell
cd c:\Projects\Backend_Api\frontend
npm run generate:slice -- -m tenants --slice tenantGenerated
```

## Overwrite Custom Slice (Only If Needed)

```powershell
cd c:\Projects\Backend_Api\frontend
npm run generate:slice -- -m tenants --overwrite-custom
```
