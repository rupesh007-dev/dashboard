import { Briefcase, Eye, RefreshCcw } from 'lucide-react'; // Import RefreshCcw
import { Link } from 'react-router-dom';
import { useFetchData } from '../../../../../hooks/useFetchData';

import { Slicestring } from '../../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../../components/common/StatusBadge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../../components/common/Table';
import AppTooltip from '../../../../../components/common/Tooltip';

const TABLE_HEADERS = ['Task Name', 'Type', 'Assigned By', 'Priority', 'Remark', 'Status', 'Actions'];

export default function MyTask({ userId }) {
  const API_URL = userId ? `/tasks/user-tasks?userId=${userId}` : null;

  const { data, loading, error, refetch } = useFetchData(API_URL);

  const tableData = data?.data || [];

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const isLoadingOrInitialLoad = loading || !data;

  if (!isLoadingOrInitialLoad && tableData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg">
        <p className="text-lg font-semibold">No data Found</p>
        <p className="text-sm">You currently have no data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="p-4 flex justify-end">
        <button
          onClick={refetch}
          disabled={loading}
          title="Refresh Tasks"
          className={`
            p-2 rounded-full text-gray-600 dark:text-gray-400 
            hover:bg-gray-100 dark:hover:bg-gray-800 transition 
            ${loading ? 'text-blue-500 cursor-not-allowed' : 'hover:text-blue-600'}
          `}
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-800">
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-gray-600 text-start dark:text-gray-300"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {isLoadingOrInitialLoad ? (
              <div className="py-10 flex justify-center flex-col text-center text-gray-500">
                Fetching data, please wait...
              </div>
            ) : (
              tableData.map((task, index) => (
                <TableRow
                  key={task.id}
                  className={`transition-colors text-xs ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50 dark:bg-gray-800/30'
                  } hover:bg-blue-50/50 dark:hover:bg-zinc-800/60`}
                >
                  <TableCell className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200 w-60">
                    <AppTooltip message={task.name}>
                      <div className="truncate cursor-pointer">
                        {Slicestring(task.name, 1, 28)}
                        {task.name.length > 28 && '...'}
                      </div>
                    </AppTooltip>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">{task.type}</TableCell>

                  <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">{task.assignedBy}</TableCell>

                  <TableCell className="py-3 px-4">
                    <StatusBadge status={task.level} />
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <AppTooltip message={task.remark}>
                      <div className="truncate text-gray-700 dark:text-gray-300">
                        {Slicestring(task.remark, 1, 28)}
                        {task.remark.length > 28 && '...'}
                      </div>
                    </AppTooltip>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    <StatusBadge status={task.status} />
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tasks/${task.id}?action=view`}
                        title="View Task Details"
                        className="flex items-center gap-1 px-2 py-1 text-blue-600 dark:text-blue-400 text-xs 
                        hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                      >
                        <Eye size={14} />
                        View
                      </Link>

                      <Link
                        to={`/tasks/${task.id}?action=work`}
                        title="Start Working"
                        className="flex items-center gap-1 px-2 py-1 text-green-600 dark:text-green-400 text-xs 
                        hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition"
                      >
                        <Briefcase size={14} />
                        Work
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
