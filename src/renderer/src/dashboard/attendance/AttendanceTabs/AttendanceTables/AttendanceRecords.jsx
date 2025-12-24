import { Calendar, User, LogIn, LogOut } from 'lucide-react';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { useFetchData } from '../../../../hooks/useFetchData';

const isValidDate = (dateString) => dateString && !isNaN(new Date(dateString).getTime());

const AttendanceCard = ({ user, checkIn, checkOut, isActive }) => {
  const checkInTime = checkIn
    ? new Date(checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '—';

  const checkOutTime = checkOut
    ? new Date(checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '—';

  const statusClasses = isActive
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';

  const cardBorderClass = isActive
    ? 'border-blue-200 dark:border-blue-700/50 '
    : 'border-gray-100 dark:border-zinc-700';

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-zinc-800 p-6 border ${cardBorderClass} transition-all duration-300 hover:shadow-md`}
    >
      {/* User & Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
        </div>
        <span className={`text-xs px-3 py-1 font-medium rounded-full ${statusClasses}`}>
          {isActive ? 'Active' : 'Completed'}
        </span>
      </div>

      <div className="flex justify-between items-start">
        {/* Check-in */}
        <div className="w-1/2 pr-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1">
            <LogIn className="w-3 h-3 mr-1" /> Check-in
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{checkInTime}</h3>
        </div>

        {/* Check-out */}
        <div className="w-1/2 pl-2 border-l border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1">
            <LogOut className="w-3 h-3 mr-1" /> Check-out
          </p>
          <p
            className={`text-2xl font-bold ${checkOut ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}
          >
            {checkOutTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AttendanceRecords() {
  const { data, loading, error, refetch } = useFetchData('/leaves/summary/records');

  const tableData = data || {};

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error.toString()}</p>
        <button onClick={refetch} className="mt-4 text-blue-600 hover:underline dark:text-blue-400">
          Try Again
        </button>
      </div>
    );
  }

  const isLoadingOrInitialLoad = loading || !data;

  if (isLoadingOrInitialLoad) {
    return (
      <div className="mt-6 space-y-8 animate-pulse p-4 dark:bg-zinc-900 rounded-lg">
        <h1 className="h-6 w-40 bg-gray-200 dark:bg-zinc-700 rounded-md"></h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-gray-100 dark:bg-zinc-800 rounded-2xl"></div>
          ))}
        </div>
        <h1 className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 rounded-md"></h1>
        <div className="h-80 bg-gray-100 dark:bg-zinc-800 rounded-2xl"></div>
      </div>
    );
  }

  const leaveSummary = tableData?.attendance || [];
  const leaveHistory = tableData?.leaves || [];

  if (leaveSummary.length === 0 && leaveHistory.length === 0) {
    return (
      <div className="p-6 mt-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
        <p className="text-lg font-semibold">No Attendance or Leave Data Found</p>
        <p className="text-sm">The API returned no records for today's attendance or historical leaves.</p>
        <button onClick={refetch} className="mt-4 text-blue-600 hover:underline dark:text-blue-400">
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Attendance Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveSummary.length > 0 ? (
          leaveSummary.map((leave, index) => (
            <AttendanceCard
              key={index}
              user={leave.user}
              checkIn={leave.checkIn}
              checkOut={leave.checkOut}
              isActive={!leave.checkOut}
            />
          ))
        ) : (
          <div className="col-span-4 p-4 text-center text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
            No team members have checked in yet today.
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Records History</h1>

      <div className="rounded-2xl bg-white dark:bg-zinc-800 p-6 border  dark:border-zinc-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Leave Applications</h2>

        {leaveHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
            <Calendar className="w-4 h-4 inline mr-1" /> No recent leave records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-400 border-b dark:border-zinc-700">
                  <th className="px-4 py-3 text-left font-medium rounded-tl-lg whitespace-nowrap">User</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">From</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">To</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Approved By</th>
                  <th className="px-4 py-3 text-left font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, index) => (
                  <tr
                    key={leave.id || index}
                    className="border-b border-gray-100 dark:border-zinc-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {leave?.user?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {leave.leaveType ? leave.leaveType.toLowerCase().replace('_', ' ') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {isValidDate(leave.fromDate) ? new Date(leave.fromDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {isValidDate(leave.toDate) ? new Date(leave.toDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs overflow-hidden truncate">
                      {leave.reason ? leave.reason.substring(0, 50) + (leave.reason.length > 50 ? '...' : '') : '—'}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {leave?.approvedBy?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={leave.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
