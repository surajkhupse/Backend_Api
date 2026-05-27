export type DashboardStat = {
  id: string
  label: string
  value: string
  icon: string
  trend?: { label: string; icon?: string; color: 'secondary' | 'tertiary' }
  variant: 'events' | 'sessions' | 'registrations' | 'revenue'
}

export type UpcomingEvent = {
  id: string
  name: string
  subtitle: string
  date: string
  status: 'confirmed' | 'draft'
  registrations: number
  capacity: number
  imageUrl: string
}

/** Tenant-scoped dashboard metrics (events, sessions, registrations). */
export const TENANT_DASHBOARD_STATS: DashboardStat[] = [
  {
    id: 'events',
    label: 'Total Events',
    value: '128',
    icon: 'event_available',
    trend: { label: '+12%', icon: 'trending_up', color: 'secondary' },
    variant: 'events',
  },
  {
    id: 'sessions',
    label: 'Live Sessions',
    value: '14',
    icon: 'podcasts',
    trend: { label: 'Live Now', color: 'tertiary' },
    variant: 'sessions',
  },
  {
    id: 'registrations',
    label: 'Total Registrations',
    value: '42,892',
    icon: 'group',
    trend: { label: '+2.4k', icon: 'trending_up', color: 'secondary' },
    variant: 'registrations',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$1.2M',
    icon: 'payments',
    trend: { label: '+8%', icon: 'trending_up', color: 'secondary' },
    variant: 'revenue',
  },
]

/** @deprecated Use TENANT_DASHBOARD_STATS */
export const DASHBOARD_STATS = TENANT_DASHBOARD_STATS

/** Platform / superadmin dashboard metrics. */
export const ADMIN_DASHBOARD_STATS: DashboardStat[] = [
  {
    id: 'tenants',
    label: 'Total Tenants',
    value: '24',
    icon: 'domain',
    trend: { label: '+3', icon: 'trending_up', color: 'secondary' },
    variant: 'events',
  },
  {
    id: 'active',
    label: 'Active Tenants',
    value: '21',
    icon: 'verified',
    trend: { label: 'Live', color: 'tertiary' },
    variant: 'sessions',
  },
  {
    id: 'users',
    label: 'Platform Users',
    value: '1,842',
    icon: 'group',
    trend: { label: '+128', icon: 'trending_up', color: 'secondary' },
    variant: 'registrations',
  },
  {
    id: 'suspended',
    label: 'Suspended Tenants',
    value: '3',
    icon: 'block',
    trend: { label: 'Review', color: 'tertiary' },
    variant: 'revenue',
  },
]

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: '1',
    name: 'Global Tech Summit 2024',
    subtitle: 'Virtual • Multi-track',
    date: 'Oct 24, 2024',
    status: 'confirmed',
    registrations: 1240,
    capacity: 2000,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBYTEY0rl4364SmUs1YcEv7F_ojoyj7P94_QRbf__bQKcbbXz-XXoBKERskyPVKpIVcyl4nr3NhZKjOIO5jEVw_pXI4i_0U-zvMJvrYkUbdG7Dl_kM_8H_dIy1aBu3uFkTyaKLDP_s1iUoye3Z8z_dLGHko2fBrjjK-fix-9iEBXhz8lP02lkI2GKr58DDjqkdQ_Dg5iXB0zHo5gAX6q3eyMlUGbPLGiO4ePhmC3uL1crjbKJCR8D-MV00lH6P0rxGZheqRqP-llfb',
  },
  {
    id: '2',
    name: 'UX/UI Design Workshop',
    subtitle: 'Physical • San Francisco',
    date: 'Nov 02, 2024',
    status: 'draft',
    registrations: 0,
    capacity: 50,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCESI9JJzbWZ5SXNPdcHETC_Hr7hvJn9yhCSMLMnjHjllZUcGQc5bOd1p4hPrLisf_8nEFpmpQb2CwHjrWXDt4_MT0C_rSfwNZiNSk97opDKArzsFCJQvruU8GLE4HV7VDv-jNZ3LucUeedO9F4c79x2L72N68LLBMNUddWr2WdADRezBVixfx9wP-MyvfI3kNxYkVhlQ13ALnAMHUa_NEnU8oXI9GOsDsIWkqZ_MG7_z-YbtjfV5P-_BQM1oQidcGHVS068TORLjpW',
  },
  {
    id: '3',
    name: 'Executive Networking Night',
    subtitle: 'Physical • New York',
    date: 'Nov 15, 2024',
    status: 'confirmed',
    registrations: 188,
    capacity: 200,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXpV_mzRnFOyZ2qM2OBgvFCpgrmE8pq9yAqcvOoGIKj_Fz1j_qlTmTSfxuMgd3ReY1CtGO8tiEX3AxN0ofJg9ocUU4o1VlSUxVV8AuBQyUchvRvrds7Q5lIFu71n00vMly-Dv-FOxAJ4jyV5GZc7cXwCbAllIAfrZ1lCQm8uCgU8kKVL7OoV21JkOiN_-WiLmVdEaNa2Sc8u3wz3cQwDO75vgz8CesBQcaz8lU2P_ET0jGcECcIo-SiYdas_26khzTYvtBCZcSFoQi',
  },
]

export const QUICK_REPORTS = [
  'Weekly Attendance PDF',
  'Revenue Forecast CSV',
  'Speaker Performance',
] as const

export const STAT_SPARKLINE_HEIGHTS = [40, 60, 45, 80, 55, 90, 100] as const
