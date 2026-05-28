import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

type DummyUser = {
  id: string
  name: string
  email: string
  role: 'tenant_admin' | 'member' | 'viewer'
  status: 'active' | 'invited'
}

const DUMMY_USERS: DummyUser[] = [
  {
    id: 'u-101',
    name: 'Ava Patel',
    email: 'ava.patel@acme.com',
    role: 'tenant_admin',
    status: 'active',
  },
  {
    id: 'u-102',
    name: 'Liam Chen',
    email: 'liam.chen@acme.com',
    role: 'member',
    status: 'active',
  },
  {
    id: 'u-103',
    name: 'Noah Singh',
    email: 'noah.singh@acme.com',
    role: 'viewer',
    status: 'invited',
  },
  {
    id: 'u-104',
    name: 'Emma Roy',
    email: 'emma.roy@acme.com',
    role: 'member',
    status: 'active',
  },
]

function StatusChip({ status }: { status: DummyUser['status'] }) {
  if (status === 'active') {
    return <Chip label="Active" size="small" color="success" variant="outlined" />
  }
  return <Chip label="Invited" size="small" color="warning" variant="outlined" />
}

export function AdminDummyUsersTable() {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'border.subtle', borderRadius: 3 }}>
      <Typography variant="titleMd" sx={{ px: 3, pt: 3, pb: 2 }}>
        Sample Users (Dummy)
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.containerLow' }}>
              {['Name', 'Email', 'Role', 'Status'].map((col) => (
                <TableCell key={col}>
                  <Typography variant="labelMd" color="text.secondary">
                    {col}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_USERS.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Typography variant="bodyMd" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="bodySm" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="bodySm">{user.role}</Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={user.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
