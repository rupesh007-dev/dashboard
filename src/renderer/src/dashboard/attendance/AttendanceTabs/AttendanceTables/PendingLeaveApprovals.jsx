import { useState } from 'react';
import { useFetchData } from '../../../../hooks/useFetchData';
import { Drawer } from '../../../../components/common/Drawer';
import { Check, X, Plus } from 'lucide-react';
import { StatusBadge } from '../../../../components/common/StatusBadge';
const isValidDate = (dateString) => dateString && !isNaN(new Date(dateString).getTime());
export default function PendingLeaveApprovals({ userId }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const API_URL = userId ? `/leaves/pending` : null;

  const { data, loading, error, refetch } = useFetchData(API_URL);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error.message || 'An unknown error occurred.'}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const leaveData = Array.isArray(data) ? data : [];

  const isLoadingOrInitialLoad = loading && leaveData.length === 0;

  if (!isLoadingOrInitialLoad && leaveData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg">
        <p className="text-lg font-semibold">No Pending Approvals Found</p>
        <p className="text-sm">You currently have no leave requests requiring your approval.</p>
      </div>
    );
  }

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setIsDrawerOpen(true);
  };

  const handleApprove = async (leaveId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaveId,
          approvedById: userId,
          action: 'APPROVE',
        }),
      });

      if (!response.ok) {
        throw new Error(`Approval failed: ${response.statusText}`);
      }

      await refetch();
    } catch (error) {
      console.error('Approval Error:', error);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaveId,
          approvedById: userId,
          action: 'REJECT',
        }),
      });

      if (!response.ok) {
        throw new Error(`Rejection failed: ${response.statusText}`);
      }

      await refetch();
    } catch (error) {
      console.error('Rejection Error:', error);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (isLoadingOrInitialLoad) {
    return <div className="p-6 text-center text-blue-500 dark:text-blue-400">Loading pending leave requests...</div>;
  }

  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-zinc-800 p-6 border  dark:border-zinc-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Leave Applications</h2>

        {leaveData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-4">
            <Calendar className="w-4 h-4 inline mr-1" /> No recent leave records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-400 border-b dark:border-zinc-700">
                  <th className="px-4 py-3 text-left font-medium rounded-tl-lg whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">From</th>
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">To</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveData.map((leave, index) => (
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
                    {/* <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {leave?.reason || 'N/A'}
                    </td> */}
                    <td className="px-4 py-3">
                      <StatusBadge status={leave.status} />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs hover:bg-green-200"
                      >
                        <Check size={14} /> Approve
                      </button>

                      <button
                        onClick={() => handleReject(leave.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs hover:bg-red-200"
                      >
                        <X size={14} /> Reject
                      </button>

                      <button
                        onClick={() => handleViewDetails(leave)}
                        className="flex items-center gap-2 rounded-lg border p-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Plus size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* <div className="overflow-hidden dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                {['Name', 'Type', 'From', 'To', 'Reason', 'Status', 'Action'].map((header) => (
                  <TableCell key={header} isHeader className="px-5 py-3 font-medium text-gray-500">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {leaveData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                    No pending approvals
                  </TableCell>
                </TableRow>
              ) : (
                leaveData.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="px-4 py-3">{leave?.user?.name}</TableCell>
                    <TableCell className="px-4 py-3">{leave?.leaveType}</TableCell>
                    <TableCell className="px-4 py-3">{formatDate(leave?.fromDate)}</TableCell>
                    <TableCell className="px-4 py-3">{formatDate(leave?.toDate)}</TableCell>
                    <TableCell className="px-4 py-3 truncate max-w-[180px]">{leave?.reason}</TableCell>

                    <TableCell className="px-4 py-3">
                      <StatusBadge status={leave?.status} />
                    </TableCell>

                    <TableCell className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs hover:bg-green-200"
                      >
                        <Check size={14} /> Approve
                      </button>

                      <button
                        onClick={() => handleReject(leave.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-xs hover:bg-red-200"
                      >
                        <X size={14} /> Reject
                      </button>

                      <button
                        onClick={() => handleViewDetails(leave)}
                        className="flex items-center gap-2 rounded-lg border p-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Plus size={14} /> View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>  */}

      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="40%">
          <div className="p-5 space-y-3">
            <h2 className="text-lg font-semibold mb-3">Leave Details</h2>
            <p>
              <strong>Employee:</strong> {selectedLeave?.user?.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedLeave?.leaveType}
            </p>
            <p>
              <strong>Duration:</strong> {selectedLeave?.duration}
            </p>
            <p>
              <strong>From:</strong> {formatDate(selectedLeave?.fromDate)}
            </p>
            <p>
              <strong>To:</strong> {formatDate(selectedLeave?.toDate)}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave?.reason}
            </p>
            <p>
              <strong>Status:</strong> <StatusBadge status={selectedLeave?.status} />
            </p>
          </div>
        </Drawer>
      )}
    </>
  );
}
