import { useCallback, useState } from 'react'; // Added needed React Hooks
import { Eye, RefreshCcw, SquarePen, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../../../components/common/Table';
import AppTooltip from '../../../../../components/common/Tooltip';
import { Drawer } from '../../../../../components/common/Drawer';
import Select from 'react-select';
import { useFetchData } from '../../../../../hooks/useFetchData';
import { Slicestring } from '../../../../../components/common/Slicestring';
import { StatusBadge } from '../../../../../components/common/StatusBadge';

const TABLE_HEADERS = [
  'Task Name',
  'AssignedBy',
  'Type',
  'Level',
  'Remark',
  'AssignTo',
  'Progress',
  'View',
  'Actions',
  'Reassign',
];

const EditContentModal = ({ onSubmit, formData, onLiveChange }) => (
  <div>
    <div className="bg-white dark:bg-gray-800 p-6 w-full">
      <h3 className="text-lg font-semibold mb-4">Edit Task: {formData.name}</h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.name || ''}
              onChange={(e) => onLiveChange({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.level || ''}
              onChange={(e) => onLiveChange({ level: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type:</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.type || ''}
              onChange={(e) => onLiveChange({ type: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Remark:</label>
            <textarea
              rows={3}
              className="w-full border rounded-lg p-2"
              value={formData.remark || ''}
              onChange={(e) => onLiveChange({ remark: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default function AllTask({ user }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    status: '',
    type: '',
    remark: '',
    level: '',
  });

  const [assignOpenMap, setAssignOpenMap] = useState({});
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [usersOptions, setUsersOptions] = useState([]);
  const [usersFetched, setUsersFetched] = useState(false);
  const [loadingAssignIds, setLoadingAssignIds] = useState({});

  const API_URL = user?.userId ? `/tasks` : null;
  const { data, loading, error, refetch } = useFetchData(API_URL);

  const authorisedUser = ['admin', 'superAdmin'].includes(user?.role);
  const tableData = data?.data || [];
  const colCount = TABLE_HEADERS.length;
  const isLoadingOrInitialLoad = loading && !data;

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

  const handleOpenEditDrawer = (content) => {
    setFormData({
      id: content.id,
      name: content.name,
      status: content.status,
      type: content.type,
      remark: content.remark,
      level: content.level,
    });
    setIsDrawerOpen(true);
  };

  const handleLiveChange = (updatedObj) => {
    setFormData((prev) => ({ ...prev, ...updatedObj }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Task update failed');

      await refetch();
    } catch (e) {
      console.error('Task edit submission error:', e);
    }
    setIsDrawerOpen(false);
  };

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
          assignedById: user.userId,
          users: selected.map((u) => u.value),
        }),
      });

      if (!res.ok) throw new Error('Assign failed');

      setAssignOpenMap((prev) => ({ ...prev, [taskId]: false }));
      setSelectedUsersMap((prev) => ({ ...prev, [taskId]: [] }));

      await refetch();
    } catch (e) {
      console.error('assignTask error:', e);
    } finally {
      setLoadingAssignIds((p) => ({ ...p, [taskId]: false }));
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error.message || error}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

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
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Tasks</h1>
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
              <TableRow>
                <TableCell colSpan={colCount} className="py-10 text-center text-gray-500">
                  {/* <RefreshCcw size={24} className="animate-spin mx-auto mb-2 text-blue-500" /> */}
                  Fetching data, please wait...
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((task, index) => {
                const isOpen = assignOpenMap[task.id];
                const isLoadingAssign = loadingAssignIds[task.id];

                const initialSelectedUsers =
                  task.assignedUsers?.map((u) => ({
                    value: u.id,
                    label: u.name,
                  })) || [];

                return (
                  <TableRow
                    key={task.id}
                    style={{ opacity: loading ? 0.6 : 1 }}
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

                    <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {task.assignedBy?.name || '-'}
                    </TableCell>

                    <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">{task.type}</TableCell>

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
                      {task.assignedUsers?.map((u) => u.name).join(', ') || '-'}
                    </TableCell>

                    <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <StatusBadge status={task.status} />
                    </TableCell>

                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tasks/${task.id}?action=view`}
                          title="View Task Details"
                          className="flex items-center gap-1 px-2.5 py-1 text-blue-600 dark:text-blue-400 text-sm 
                    hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                        >
                          <Eye size={15} />
                          View
                        </Link>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {authorisedUser && (
                          <button
                            onClick={() => handleOpenEditDrawer(task)}
                            title="Edit Task"
                            className="flex items-center gap-1 px-2.5 py-1 text-purple-600 dark:text-purple-400 text-sm 
                      hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition"
                          >
                            <SquarePen size={16} />
                            Edit
                          </button>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3 px-4 text-sm w-48 relative">
                      <button
                        onClick={() => toggleAssignOpen(task.id)}
                        title="Reassign Task"
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                      >
                        <UserCheck size={14} />
                        Reassign
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 p-2 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg w-60">
                          <Select
                            isMulti
                            options={usersOptions}
                            value={selectedUsersMap[task.id] || initialSelectedUsers}
                            onChange={(val) => onSelectedUsersChange(task.id, val)}
                            placeholder="Select users..."
                            classNamePrefix="react-select"
                          />

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => assignTask(task.id)}
                              disabled={isLoadingAssign}
                              className="flex-1 bg-green-600 text-white py-1.5 rounded-md text-xs hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isLoadingAssign ? 'Assigning...' : 'Assign Now'}
                            </button>

                            <button
                              onClick={() => setAssignOpenMap((p) => ({ ...p, [task.id]: false }))}
                              className="flex-1 border border-gray-300 dark:border-gray-500 rounded-md py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-600"
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

        {isDrawerOpen && (
          <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="40%">
            <EditContentModal onSubmit={handleEditSubmit} formData={formData} onLiveChange={handleLiveChange} />
          </Drawer>
        )}
      </div>
    </div>
  );
}
