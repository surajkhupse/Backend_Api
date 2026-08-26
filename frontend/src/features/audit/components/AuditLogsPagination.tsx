import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { MaterialSymbol } from '../../../theme'
import { AUDIT_LOG_PAGE_SIZE, getAuditLogPageCount } from '../utils/auditLogsPagination'

export type AuditLogsPaginationProps = {
  page: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function AuditLogsPagination({ page, totalItems, onPageChange }: AuditLogsPaginationProps) {
  const pageCount = getAuditLogPageCount(totalItems)
  const start = totalItems === 0 ? 0 : (page - 1) * AUDIT_LOG_PAGE_SIZE + 1
  const end = Math.min(page * AUDIT_LOG_PAGE_SIZE, totalItems)

  const pagesToShow: (number | '…')[] = (() => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, '…', pageCount]
    if (page >= pageCount - 2) {
      return [1, '…', pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
    }
    return [1, '…', page - 1, page, page + 1, '…', pageCount]
  })()

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderTop: 1,
        borderColor: 'border.subtle',
        bgcolor: 'background.containerLow',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Typography variant="labelSm" color="text.secondary">
        {totalItems === 0
          ? 'No entries'
          : `Showing ${start} to ${end} of ${totalItems} ${totalItems === 1 ? 'entry' : 'entries'}`}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <MaterialSymbol name="chevron_left" />
        </IconButton>

        {pagesToShow.map((p, i) =>
          p === '…' ? (
            <Typography key={`ellipsis-${i}`} variant="labelSm" sx={{ px: 1, color: 'text.secondary' }}>
              …
            </Typography>
          ) : (
            <Box
              key={p}
              component="button"
              type="button"
              onClick={() => onPageChange(p)}
              sx={{
                minWidth: 32,
                height: 32,
                px: 1,
                border: 'none',
                borderRadius: 1,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                bgcolor: p === page ? 'primary.main' : 'transparent',
                color: p === page ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: p === page ? 'primary.main' : 'action.hover',
                },
              }}
            >
              {p}
            </Box>
          ),
        )}

        <IconButton
          size="small"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <MaterialSymbol name="chevron_right" />
        </IconButton>
      </Box>
    </Box>
  )
}
