import { Clock, Calendar } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { useFetchData } from '../../../../hooks/useFetchData';

const ProgressBar = ({ percentage, color }) => {
  const finalColor = color || 'bg-blue-500';

  return (
    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${finalColor} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
};

const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || minutes < 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours} hr ${mins} min`;
  }
  return `${mins} min`;
};

const isValidDate = (dateString) => dateString && !isNaN(new Date(dateString).getTime());

export default function MyAttendance({ userId }) {
  const API_URL = userId ? `/leaves/user-attendence/${userId}` : null;

  const { data, loading, error, refetch } = useFetchData(API_URL);

  const tableData = data || [];

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

  const leaveSummary = tableData?.summary || [];
  const leaveRecords = tableData?.leaves || [];

  const timeCards = [
    {
      title: 'Login Time',
      value: isValidDate(data?.checkIn)
        ? new Date(data.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : '--:-- AM',
      subtext: 'Today (Checked In)',
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Logout Time',
      value: isValidDate(data?.checkOut)
        ? new Date(data.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : '--:-- PM',
      subtext: 'Expected / Last Recorded',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Break Duration',
      value:
        data?.breakDurationMinutes !== undefined && data.breakDurationMinutes !== null
          ? formatDuration(data.breakDurationMinutes)
          : '-- min',
      subtext: 'Total today',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="pt-3 pb-6 space-y-8">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {timeCards.map((card, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl bg-white dark:bg-zinc-800 p-6 border dark:border-zinc-700 "
          >
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white leading-none mb-1">{card.value}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{card.subtext}</p>
          </Motion.div>
        ))}
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, staggerChildren: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {leaveSummary.length > 0 ? (
          leaveSummary.map((leave, index) => {
            const availableDays = leave.available || 0;
            const totalDays = leave.total || 1;
            const percentage = (availableDays / totalDays) * 100;

            const colorClass =
              leave.color ||
              (index % 4 === 0
                ? 'bg-blue-500'
                : index % 4 === 1
                  ? 'bg-green-500'
                  : index % 4 === 2
                    ? 'bg-yellow-500'
                    : 'bg-red-500');

            return (
              <Motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="rounded-2xl bg-white dark:bg-zinc-800 p-5 border dark:border-zinc-700"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{leave.label} Balance</p>
                <div className="flex items-end mb-3">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{availableDays}</h3>
                  <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">/ {totalDays}</span>
                </div>
                <ProgressBar percentage={percentage} color={colorClass} />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{availableDays} days remaining</p>
              </Motion.div>
            );
          })
        ) : (
          <div className="col-span-4 text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed rounded-lg">
            <p>No leave balance summary available.</p>
          </div>
        )}
      </Motion.div>

      <div className="rounded-2xl bg-white dark:bg-zinc-800 p-6 border  dark:border-zinc-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Leave Records</h2>

        {leaveRecords.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
            <Calendar className="w-4 h-4 inline mr-1" /> No recent leave records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-400 border-b dark:border-zinc-700">
                  <th className="px-4 py-3 text-left font-medium rounded-tl-lg whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">From</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">To</th>
                  <th className="px-4 py-3 text-left font-medium">Duration</th>
                  <th className="px-4 py-3 text-left font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRecords.map((leave, index) => (
                  <tr
                    key={leave.id || index}
                    className="border-b border-gray-100 dark:border-zinc-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 capitalize text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {leave.leaveType ? leave.leaveType.toLowerCase().replace('_', ' ') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {isValidDate(leave.fromDate) ? new Date(leave.fromDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {isValidDate(leave.toDate) ? new Date(leave.toDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {leave.duration ? leave.duration.toLowerCase().replace('_', ' ') : 'N/A'}
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
