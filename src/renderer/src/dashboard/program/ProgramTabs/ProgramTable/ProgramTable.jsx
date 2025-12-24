import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../components/common/Table';
import AppTooltip from '../../../../components/common/Tooltip';
import { Slicestring } from '../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../components/common/StatusBadge';

export default function ProgramTable({ tableData = [], loading, error }) {
  if (loading) {
    return <div className="py-6 text-center text-gray-500 dark:text-gray-400">Loading programs...</div>;
  }

  if (error) {
    return <div className="py-6 text-center text-red-500">Failed to load Programs</div>;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900/60">
      <Table className="w-full">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
          <TableRow>
            {[
              'Program',
              'Reference',
              'Status',
              'Total',
              'Accepted',
              'Remaining',
              'Assign To',
              'Due Date',
              'Action',
            ].map((header) => (
              <TableCell key={header} className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                <AppTooltip message={header}>
                  <span>{header}</span>
                </AppTooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData?.length >= 0 ? (
            tableData.map((row, index) => (
              <TableRow
                key={index}
                className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50 dark:bg-gray-800/30'
                }`}
              >
                <TableCell className="py-3 px-4 w-60">
                  <AppTooltip message={row.name}>
                    <div className="truncate cursor-pointer text-sm font-medium text-zinc-800 dark:text-gray-200">
                      {Slicestring(row.name, 1, 25)}
                      {row.name.length > 25 && '...'}
                    </div>
                  </AppTooltip>
                </TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  {row.client.name}/{row.code}
                </TableCell>
                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  <StatusBadge status={row.status} />
                </TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{row.leadgoal}</TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{row.completed}</TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{row.pending}</TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  {row.assignTo?.length ? row.assignTo.join(', ') : '-'}
                </TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  {row.duedate ? new Date(row.duedate).toLocaleDateString() : '-'}
                </TableCell>

                <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                  <Link to={`/programs/${row.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center p-4 text-gray-500 dark:text-gray-400">
                No Program found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
