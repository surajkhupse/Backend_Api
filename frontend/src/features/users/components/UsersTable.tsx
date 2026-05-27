import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { UserRecord } from '../../../services/api/usersApi'

type UsersTableProps = {
  users: UserRecord[]
}

function roleChipColor(role: UserRecord['role']): 'primary' | 'secondary' | 'default' | 'warning' {
  switch (role) {
    case 'superadmin':
      return 'warning'
    case 'tenant_admin':
      return 'primary'
    case 'member':
      return 'secondary'
    default:
      return 'default'
  }
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <Typography variant="bodyMd" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
        No users found.
      </Typography>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Tenant</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Joined</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>
                <Typography variant="bodyMd" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip size="small" label={user.role} color={roleChipColor(user.role)} variant="outlined" />
              </TableCell>
              <TableCell>{user.tenantName ?? '—'}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
