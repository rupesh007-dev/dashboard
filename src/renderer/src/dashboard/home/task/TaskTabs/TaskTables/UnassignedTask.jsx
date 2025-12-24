import React, { useState, useCallback } from 'react'; // Added missing hooks
import { Briefcase, Eye, RefreshCcw, UserCheck } from 'lucide-react'; // Added UserCheck
import { Link } from 'react-router-dom';
import Select from 'react-select'; // Assuming you use react-select
import { useFetchData } from '../../../../../hooks/useFetchData';

import { Slicestring } from '../../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../../components/common/StatusBadge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../../components/common/Table';
import AppTooltip from '../../../../../components/common/Tooltip';

// Ensure headers match the number of cells (8 headers)
const TABLE_HEADERS = ['Task', 'AssignBy', 'Type', 'Level', 'Remark', 'Progress', 'Actions', 'Assign'];

export default function UnassignedTask({ userId }) {
  const API_URL = userId ? `/tasks/unassigned` : null;
  const { data, loading, error, refetch } = useFetchData(API_URL);

  const tableData = data?.data || [];

  // --- State Management ---
  const [assignOpenMap, setAssignOpenMap] = useState({});
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [usersOptions, setUsersOptions] = useState([]);
  const [usersFetched, setUsersFetched] = useState(false);
  const [loadingAssignIds, setLoadingAssignIds] = useState({});

  const fetchUsers = useCallback(async () => {
    if (usersFetched) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
      const response = await res.json();
      const usersArray = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : [];

      const options = usersArray.map((user) => ({
        value: user.id,
        label: user.name || user.email || `User ${user.id}`,
      }));

      setUsersOptions(options);
      setUsersFetched(true);
    } catch (e) {
      console.error('fetchUsers error:', e);
    }
  }, [usersFetched]);

  const toggleAssignOpen = async (taskId) => {
    await fetchUsers();
    setAssignOpenMap((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const onSelectedUsersChange = (taskId, value) => {
    setSelectedUsersMap((prev) => ({ ...prev, [taskId]: value }));
  };

  const assignTask = async (taskId) => {
    const selected = selectedUsersMap[taskId] || [];
    if (!selected.length) return;

    setLoadingAssignIds((p) => ({ ...p, [taskId]: true }));

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedById: userId, // Using the prop userId
          users: selected.map((u) => u.value),
        }),
      });

      if (!res.ok) throw new Error('Assign failed');

      setAssignOpenMap((prev) => ({ ...prev, [taskId]: false }));
      setSelectedUsersMap((prev) => ({ ...prev, [taskId]: [] }));

      await refetch(); // Fixed function name
    } catch (e) {
      console.error('assignTask error:', e);
    } finally {
      setLoadingAssignIds((p) => ({ ...p, [taskId]: false }));
    }
  };

  // --- Render Logic ---
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const isLoadingOrInitialLoad = loading || !data;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-zinc-900">
      <div className="p-4 flex justify-end">
        <button
          onClick={refetch}
          disabled={loading}
          title="Refresh Tasks"
          className={`p-2 rounded-full transition ${loading ? 'text-blue-500 animate-spin' : 'text-gray-600 hover:text-blue-600'}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-800">
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableCell
                  key={header}
                  className="px-4 py-3 font-semibold text-xs uppercase text-gray-600 dark:text-gray-300"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {isLoadingOrInitialLoad ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                  Fetching data...
                </TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                  No data Found
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((task, index) => {
                // Get state for this specific task
                const isOpen = assignOpenMap[task.id];
                const selectedForTask = selectedUsersMap[task.id] || [];
                const isLoadingAssign = loadingAssignIds[task.id];

                return (
                  <TableRow
                    key={task.id}
                    className={`text-xs ${index % 2 === 0 ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50 dark:bg-gray-800/30'}`}
                  >
                    {/* 1. Task */}
                    <TableCell className="py-3 px-4 font-medium w-60">
                      <AppTooltip message={task.name}>
                        <div className="truncate">
                          {Slicestring(task.name, 1, 28)}
                          {task.name.length > 28 && '...'}
                        </div>
                      </AppTooltip>
                    </TableCell>

                    {/* 2. AssignBy */}
                    <TableCell className="py-3 px-4">{task.assignedBy || 'N/A'}</TableCell>

                    {/* 3. Type */}
                    <TableCell className="py-3 px-4">{task.type}</TableCell>

                    {/* 4. Level */}
                    <TableCell className="py-3 px-4">
                      <StatusBadge status={task.level} />
                    </TableCell>

                    {/* 5. Remark */}
                    <TableCell className="py-3 px-4">
                      <div className="truncate max-w-37.5">{Slicestring(task.remark || '', 1, 28)}</div>
                    </TableCell>

                    {/* 6. Progress (Status) */}
                    <TableCell className="py-3 px-4">
                      <StatusBadge status={task.status} />
                    </TableCell>

                    {/* 7. Actions */}
                    <TableCell className="py-3 px-4">
                      <Link
                        to={`/tasks/${task.id}?action=view`}
                        className="flex items-center gap-1.5 text-blue-600 hover:underline"
                      >
                        <Eye size={14} /> View
                      </Link>
                    </TableCell>

                    {/* 8. Assign */}
                    <TableCell className="py-3 px-4">
                      <button
                        onClick={() => toggleAssignOpen(task.id)}
                        className="flex items-center gap-1.5 text-green-600 hover:bg-green-50 p-1 rounded"
                      >
                        <UserCheck size={14} /> Assign
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-zinc-800 p-2 shadow-xl border rounded-lg">
                          <Select
                            isMulti
                            options={usersOptions}
                            value={selectedForTask}
                            onChange={(val) => onSelectedUsersChange(task.id, val)}
                            placeholder="Select users..."
                            className="text-black"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => assignTask(task.id)}
                              disabled={isLoadingAssign || !selectedForTask.length}
                              className="flex-1 bg-green-600 text-white py-1 rounded text-xs disabled:opacity-50"
                            >
                              {isLoadingAssign ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setAssignOpenMap((p) => ({ ...p, [task.id]: false }))}
                              className="flex-1 border py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
