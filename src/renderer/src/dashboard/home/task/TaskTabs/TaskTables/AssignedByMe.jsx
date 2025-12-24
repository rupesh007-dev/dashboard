// import { Briefcase, Eye, RefreshCcw } from 'lucide-react'; // Import RefreshCcw
// import { Link } from 'react-router-dom';
// import { useFetchData } from '../../../../../hooks/useFetchData';

// import { Slicestring } from '../../../../../components/common/Slicestring';
// import { StatusBadge } from '../../../../../components/common/StatusBadge';
// import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../../components/common/Table';
// import AppTooltip from '../../../../../components/common/Tooltip';

// const TABLE_HEADERS = ['Task', 'Type', 'Level', 'Remark', 'AssignTo', 'Progress', 'Actions', 'Reassign'];

// export default function AssignedByMe({ userId }) {
//   const API_URL = userId ? `/tasks/assignedBy/${userId}` : null;

//   const { data, loading, error, refetch } = useFetchData(API_URL);

//   const tableData = data?.data || [];

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
//         <p className="font-semibold mb-2">Error Loading data</p>
//         <p className="text-sm">{error}</p>
//         <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const isLoadingOrInitialLoad = loading || !data;

//   if (!isLoadingOrInitialLoad && tableData.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg">
//         <p className="text-lg font-semibold">No data Found</p>
//         <p className="text-sm">You currently have no data.</p>
//       </div>
//     );
//   }

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`);

//       if (!res.ok) throw new Error('Failed to fetch tasks');

//       const json = await res.json();
//       setData(json);
//     } catch (err) {
//       setError(err.message || 'Error fetching tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const API_URL = `${import.meta.env.VITE_BASE_URL}/tasks/assignedBy/${user.userId}`;

//     async function fetchTasks() {
//       try {
//         setLoading(true);

//         const res = await fetch(API_URL);

//         if (!res.ok) throw new Error('Failed to fetch tasks');

//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         setError(err.message || 'Error loading tasks');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTasks();
//   }, [user.userId]);

//    const [assignOpenMap, setAssignOpenMap] = useState({});
//   const [selectedUsersMap, setSelectedUsersMap] = useState({});
//   const [usersOptions, setUsersOptions] = useState([]);
//   const [usersFetched, setUsersFetched] = useState(false);
//   const [loadingAssignIds, setLoadingAssignIds] = useState({});

//   const fetchUsers = useCallback(async () => {
//     if (usersFetched) return;

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
//       const response = await res.json();

//       const usersArray = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : [];

//       const options = usersArray.map((user) => ({
//         value: user.id,
//         label: user.name || user.email || `User ${user.id}`,
//       }));

//       setUsersOptions(options);
//       setUsersFetched(true);
//     } catch (e) {
//       console.error('fetchUsers error:', e);
//     }
//   }, [usersFetched]);

//   const toggleAssignOpen = async (taskId) => {
//     await fetchUsers();
//     setAssignOpenMap((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
//   };

//   const onSelectedUsersChange = (taskId, value) => {
//     setSelectedUsersMap((prev) => ({ ...prev, [taskId]: value }));
//   };

//   const assignTask = async (taskId) => {
//     const selected = selectedUsersMap[taskId] || [];
//     if (!selected.length) return;

//     console.log(selected, 'selected');

//     setLoadingAssignIds((p) => ({ ...p, [taskId]: true }));

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}/assign`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           assignedById: user.userId,
//           users: selected.map((u) => u.value),
//         }),
//       });

//       if (!res.ok) console.error('Assign failed');

//       setAssignOpenMap((prev) => ({ ...prev, [taskId]: false }));
//       setSelectedUsersMap((prev) => ({ ...prev, [taskId]: [] }));

//       await fetchTasks();
//     } catch (e) {
//       console.error('assignTask error:', e);
//     } finally {
//       setLoadingAssignIds((p) => ({ ...p, [taskId]: false }));
//     }
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
//       <div className="p-4 flex justify-end">
//         <button
//           onClick={refetch}
//           disabled={loading}
//           title="Refresh Tasks"
//           className={`
//             p-2 rounded-full text-gray-600 dark:text-gray-400
//             hover:bg-gray-100 dark:hover:bg-gray-800 transition
//             ${loading ? 'text-blue-500 cursor-not-allowed' : 'hover:text-blue-600'}
//           `}
//         >
//           <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
//         </button>
//       </div>

//       <div className="max-w-full overflow-x-auto">
//         <Table>
//           <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-800">
//             <TableRow>
//               {TABLE_HEADERS.map((header) => (
//                 <TableCell
//                   key={header}
//                   isHeader
//                   className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-gray-600 text-start dark:text-gray-300"
//                 >
//                   {header}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHeader>

//           <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
//             {isLoadingOrInitialLoad ? (
//               <div className="py-10 flex justify-center flex-col text-center text-gray-500">
//                 Fetching data, please wait...
//               </div>
//             ) : (
//               tableData.map((task, index) => (
//                 <TableRow
//                   key={task.id}
//                   className={`transition-colors text-xs ${
//                     index % 2 === 0 ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50 dark:bg-gray-800/30'
//                   } hover:bg-blue-50/50 dark:hover:bg-zinc-800/60`}
//                 >
//                   <TableCell className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200 w-60">
//                     <AppTooltip message={task.name}>
//                       <div className="truncate cursor-pointer">
//                         {Slicestring(task.name, 1, 28)}
//                         {task.name.length > 28 && '...'}
//                       </div>
//                     </AppTooltip>
//                   </TableCell>

//                   <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">{task.type}</TableCell>

//                   <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">{task.assignedBy}</TableCell>

//                   <TableCell className="py-3 px-4">
//                     <StatusBadge status={task.level} />
//                   </TableCell>

//                   <TableCell className="py-3 px-4">
//                     <AppTooltip message={task.remark}>
//                       <div className="truncate text-gray-700 dark:text-gray-300">
//                         {Slicestring(task.remark, 1, 28)}
//                         {task.remark.length > 28 && '...'}
//                       </div>
//                     </AppTooltip>
//                   </TableCell>

//                   <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">
//                     <StatusBadge status={task.status} />
//                   </TableCell>

//                   {/* <TableCell className="py-3 px-4">
//                     <div className="flex items-center gap-2">
//                       <Link
//                         to={`/tasks/${task.id}?action=view`}
//                         title="View Task Details"
//                         className="flex items-center gap-1 px-2 py-1 text-blue-600 dark:text-blue-400 text-xs
//                         hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
//                       >
//                         <Eye size={14} />
//                         View
//                       </Link>

//                       <Link
//                         to={`/tasks/${task.id}?action=work`}
//                         title="Start Working"
//                         className="flex items-center gap-1 px-2 py-1 text-green-600 dark:text-green-400 text-xs
//                         hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition"
//                       >
//                         <Briefcase size={14} />
//                         Work
//                       </Link>
//                     </div>
//                   </TableCell> */}

//   {/* Actions */}
//                 <TableCell className="py-3 px-4">
//                   <div className="flex items-center gap-3">
//                     <Link
//                       to={`/tasks/${task.id}?action=view`}
//                       className="flex items-center gap-1 px-2.5 py-1 text-blue-600 dark:text-blue-400 text-sm
//                     hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
//                     >
//                       <Eye size={15} />
//                       View
//                     </Link>
//                   </div>
//                 </TableCell>

//                 {/* Assign Section */}
//                 <TableCell className="py-3 px-4 text-sm">
//                   <button
//                     onClick={() => toggleAssignOpen(task.id)}
//                     className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
//                   >
//                     <UserCheck size={14} />
//                     Reassign
//                   </button>

//                   {isOpen && (
//                     <div className="mt-2 w-60">
//                       <Select
//                         isMulti
//                         options={usersOptions}
//                         value={
//                           selectedUsersMap[task.id] ||
//                           task.assignedUsers?.map((u) => ({
//                             value: u.id,
//                             label: u.name,
//                           })) ||
//                           []
//                         }
//                         onChange={(val) => onSelectedUsersChange(task.id, val)}
//                         placeholder="Select users..."
//                       />

//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => assignTask(task.id)}
//                           disabled={isLoadingAssign}
//                           className="flex-1 bg-green-600 text-white py-1.5 rounded-md text-xs hover:bg-green-700 disabled:opacity-60"
//                         >
//                           {isLoadingAssign ? 'Assigning...' : 'Assign Now'}
//                         </button>

//                         <button
//                           onClick={() =>
//                             setAssignOpenMap((p) => ({
//                               ...p,
//                               [task.id]: false,
//                             }))
//                           }
//                           className="flex-1 border rounded-md py-1.5 text-xs"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {/* {isOpen && (
//                     <div className="mt-2 w-60">
//                       <Select
//                         isMulti
//                         options={usersOptions}
//                         value={selectedForTask}
//                         onChange={(val) => onSelectedUsersChange(task.id, val)}
//                         placeholder="Select users..."
//                       />

//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => assignTask(task.id)}
//                           disabled={isLoadingAssign}
//                           className="flex-1 bg-green-600 text-white py-1.5 rounded-md text-xs hover:bg-green-700 disabled:opacity-60"
//                         >
//                           {isLoadingAssign ? 'Assigning...' : 'Assign Now'}
//                         </button>

//                         <button
//                           onClick={() =>
//                             setAssignOpenMap((p) => ({
//                               ...p,
//                               [task.id]: false,
//                             }))
//                           }
//                           className="flex-1 border rounded-md py-1.5 text-xs"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )} */}
//                 </TableCell>

//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
import React, { useState, useCallback } from 'react';
import { Eye, RefreshCcw, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useFetchData } from '../../../../../hooks/useFetchData';

import { Slicestring } from '../../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../../components/common/StatusBadge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../../components/common/Table';
import AppTooltip from '../../../../../components/common/Tooltip';

const TABLE_HEADERS = ['Task', 'Type', 'Level', 'Remark', 'AssignTo', 'Progress', 'Actions', 'Reassign'];

export default function AssignedByMe({ userId }) {
  // Use the hook as the single source of truth for fetching
  const API_URL = userId ? `/tasks/assignedBy/${userId}` : null;
  const { data, loading, error, refetch } = useFetchData(API_URL);

  const tableData = data?.data || [];

  // --- State for Reassigning ---
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

      const options = usersArray.map((u) => ({
        value: u.id,
        label: u.name || u.email || `User ${u.id}`,
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
          assignedById: userId,
          users: selected.map((u) => u.value),
        }),
      });

      if (!res.ok) throw new Error('Assignment failed');

      setAssignOpenMap((prev) => ({ ...prev, [taskId]: false }));
      setSelectedUsersMap((prev) => ({ ...prev, [taskId]: [] }));

      // Refresh the table data after reassigning
      await refetch();
    } catch (e) {
      console.error('assignTask error:', e);
    } finally {
      setLoadingAssignIds((p) => ({ ...p, [taskId]: false }));
    }
  };

  // --- Error & Empty States ---
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
          className={`p-2 rounded-full transition ${loading ? 'text-blue-500 animate-spin' : 'text-gray-600 hover:text-blue-600'}`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-zinc-800">
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
                const isOpen = assignOpenMap[task.id];
                const isLoadingAssign = loadingAssignIds[task.id];
                const selectedForTask =
                  selectedUsersMap[task.id] || task.assignedUsers?.map((u) => ({ value: u.id, label: u.name })) || [];

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

                    {/* 2. Type */}
                    <TableCell className="py-3 px-4">{task.type}</TableCell>

                    {/* 3. Level */}
                    <TableCell className="py-3 px-4">
                      <StatusBadge status={task.level} />
                    </TableCell>

                    {/* 4. Remark */}
                    <TableCell className="py-3 px-4">
                      <AppTooltip message={task.remark}>
                        <div className="truncate max-w-30">{Slicestring(task.remark || '', 1, 25)}</div>
                      </AppTooltip>
                    </TableCell>

                    {/* 5. AssignTo */}
                    <TableCell className="py-3 px-4">
                      <div className="truncate max-w-30">
                        {task.assignedUsers?.map((u) => u.name).join(', ') || 'Unassigned'}
                      </div>
                    </TableCell>

                    {/* 6. Progress */}
                    <TableCell className="py-3 px-4">
                      <StatusBadge status={task.status} />
                    </TableCell>

                    {/* 7. Actions */}
                    <TableCell className="py-3 px-4">
                      <Link
                        to={`/tasks/${task.id}?action=view`}
                        className="flex items-center gap-1.5 text-blue-600 hover:underline"
                      >
                        <Eye size={15} /> View
                      </Link>
                    </TableCell>

                    {/* 8. Reassign */}
                    <TableCell className="py-3 px-4 relative">
                      <button
                        onClick={() => toggleAssignOpen(task.id)}
                        className="flex items-center gap-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded"
                      >
                        <UserCheck size={14} /> Reassign
                      </button>

                      {isOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-64 bg-white dark:bg-zinc-800 p-3 shadow-2xl border border-gray-200 dark:border-white/10 rounded-lg">
                          <Select
                            isMulti
                            options={usersOptions}
                            value={selectedForTask}
                            onChange={(val) => onSelectedUsersChange(task.id, val)}
                            className="text-black"
                            placeholder="Select users..."
                          />
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => assignTask(task.id)}
                              disabled={isLoadingAssign}
                              className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              {isLoadingAssign ? 'Updating...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setAssignOpenMap((p) => ({ ...p, [task.id]: false }))}
                              className="flex-1 border border-gray-300 dark:border-white/10 py-1.5 rounded text-xs"
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
