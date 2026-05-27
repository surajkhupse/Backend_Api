import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import type { TenantRecord, TenantStatus } from '../../../services/api/tenantsApi'
import { MaterialSymbol } from '../../../theme'

type TenantsTableProps = {
  tenants: TenantRecord[]
  actionTenantId: string | null
  onChangeStatus: (id: string, status: TenantStatus) => void
  onDelete: (id: string, name: string) => void
  showActions?: boolean
}

function statusColor(status: TenantRecord['status']): 'success' | 'warning' | 'default' {
  if (status === 'active') return 'success'
  if (status === 'suspended') return 'warning'
  return 'default'
}

export function TenantsTable({
  tenants,
  actionTenantId,
  onChangeStatus,
  onDelete,
  showActions = true,
}: TenantsTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuTenant, setMenuTenant] = useState<TenantRecord | null>(null)

  function openStatusMenu(event: React.MouseEvent<HTMLElement>, tenant: TenantRecord) {
    setMenuAnchor(event.currentTarget)
    setMenuTenant(tenant)
  }

  function closeStatusMenu() {
    setMenuAnchor(null)
    setMenuTenant(null)
  }

  function handleStatusPick(status: TenantStatus) {
    if (menuTenant) {
      onChangeStatus(menuTenant._id, status)
    }
    closeStatusMenu()
  }

  if (tenants.length === 0) {
    return (
      <Typography variant="bodyMd" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
        No tenants match your filters. Try adjusting search or create a new tenant.
      </Typography>
    )
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              {showActions ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => {
              const isBusy = actionTenantId === tenant._id
              return (
                <TableRow key={tenant._id} hover>
                  <TableCell>
                    <Typography variant="bodyMd" sx={{ fontWeight: 600 }}>
                      {tenant.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="bodySm" color="text.secondary">
                      {tenant.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{tenant.domain ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={tenant.status}
                      color={statusColor(tenant.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })}
                  </TableCell>
                  {showActions ? (
                    <TableCell align="right">
                      <Tooltip title="Change status">
                        <span>
                          <IconButton
                            size="small"
                            disabled={isBusy}
                            onClick={(e) => openStatusMenu(e, tenant)}
                            aria-label={`Change status for ${tenant.name}`}
                          >
                            <MaterialSymbol name="sync_alt" sx={{ fontSize: 20 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete tenant">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isBusy}
                            onClick={() => onDelete(tenant._id, tenant.name)}
                            aria-label={`Delete ${tenant.name}`}
                          >
                            <MaterialSymbol name="delete" sx={{ fontSize: 20 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeStatusMenu}>
        <MenuItem onClick={() => handleStatusPick('active')}>Set active</MenuItem>
        <MenuItem onClick={() => handleStatusPick('inactive')}>Set inactive</MenuItem>
        <MenuItem onClick={() => handleStatusPick('suspended')}>Set suspended</MenuItem>
      </Menu>
    </>
  )
}
