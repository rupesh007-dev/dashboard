import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/common/Table';
import AppTooltip from '../../../../components/common/Tooltip';
import { Slicestring } from '../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../components/common/StatusBadge';

export default function BriefTable({ tableData = [], loading, error }) {
  if (loading) {
    return <div className="py-6 text-center text-gray-500 dark:text-gray-400">Loading briefs...</div>;
  }

  if (error) {
    return <div className="py-6 text-center text-red-500">Failed to load briefs</div>;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900/60">
      <Table className="w-full">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
          <TableRow>
            {['Client Code', 'Brief Name', 'Arrived On Time/Date', 'Due Time/Date', 'Status', 'Type', 'Action'].map(
              (header) => (
                <TableCell key={header} className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  <AppTooltip message={header}>
                    <span>{header}</span>
                  </AppTooltip>
                </TableCell>
              )
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row) => (
              <TableRow key={row.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <TableCell className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {row.clientCode || '-'}
                </TableCell>

                <TableCell className="py-3 px-4 w-60">
                  <AppTooltip message={row?.name}>
                    <div className="truncate cursor-pointer text-sm font-medium text-zinc-800 dark:text-gray-200">
                      {Slicestring(row?.name || '-', 1, 25)}
                      {row?.name && row.name.length > 25 && '...'}
                    </div>
                  </AppTooltip>
                </TableCell>

                <TableCell className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {row.arrivedOnTime ?? '-'} — {row.arrivedOn ? new Date(row.arrivedOn).toLocaleDateString() : '-'}
                </TableCell>

                <TableCell className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {row.dueTime ?? '-'} — {row.due ? new Date(row.due).toLocaleDateString() : '-'}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <StatusBadge status={row.status} />
                </TableCell>

                <TableCell className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{row.type || '-'}</TableCell>

                <TableCell className="py-3 px-4 text-sm">
                  <Link to={`/briefs/${row.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500 dark:text-gray-400">
                No briefs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
