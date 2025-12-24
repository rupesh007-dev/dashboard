import AddNotification from './AddNotification';
import { useState, useContext, useEffect } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { Bell, Calendar, Edit, Plus, RotateCcw, Search, Trash } from 'lucide-react';
import { useGetNotificationsByUserIdQuery } from '../../../store/apiServices/notificationApi';
import { SocketContext } from '../../../context/SocketContext';
import { Drawer } from '../../../components/common/Drawer';
const PRIORITY_MAP = {
  1: {
    label: 'Low',
    color: 'bg-blue-200 border-blue-400 text-blue-800 dark:bg-blue-800 dark:border-blue-400 dark:text-blue-200',
  },
  2: {
    label: 'Medium',
    color:
      'bg-yellow-200 border-yellow-400 text-yellow-800 dark:bg-yellow-800 dark:border-yellow-400 dark:text-yellow-200',
  },
  3: {
    label: 'High',
    color:
      'bg-orange-200 border-orange-400 text-orange-800 dark:bg-orange-800 dark:border-orange-400 dark:text-orange-200',
  },
  4: {
    label: 'Critical',
    color: 'bg-red-200 border-red-400 text-red-800 dark:bg-red-800 dark:border-red-400 dark:text-red-200',
  },
};

const adminRoles = ['admin', 'superAdmin'];
export default function NotificationTabs() {
  const user = useSelector((state) => state.user.value);
  const socket = useContext(SocketContext);
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterMessage, setFilterMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useGetNotificationsByUserIdQuery(user.role, {
    skip: !user?.role,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notif) => {
      const mergedNotif = { ...notif.n, ...notif.payload, isLive: true };
      setLiveNotifications((prev) => [mergedNotif, ...prev]);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow p-3 max-w-xs`}
          >
            <strong className="block font-medium">{mergedNotif.type?.toUpperCase()}</strong>
            <span>{mergedNotif.message}</span>
          </div>
        ),
        { duration: 5000 }
      );
    };

    socket.on('receiveCampaignNotification', handleNotification);
    return () => socket.off('receiveCampaignNotification', handleNotification);
  }, [socket]);

  const addNotificationToggler = (action) => {
    setIsDrawerOpen(action);
    if (!action) refetch();
  };

  const allNotifications = [...liveNotifications, ...(notifications || [])];

  const filtered = allNotifications
    .filter((n) => {
      const matchesPriority = filterPriority ? n.notificationPriorityId === filterPriority : true;
      const matchesMessage = filterMessage ? n.message.toLowerCase().includes(filterMessage.toLowerCase()) : true;
      const createdDate = new Date(n.createdAt);
      const matchesStart = startDate ? createdDate >= new Date(startDate) : true;
      const matchesEnd = endDate ? createdDate <= new Date(endDate) : true;
      return matchesPriority && matchesMessage && matchesStart && matchesEnd;
    })
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  if (isLoading) return <LoaderIcon />;
  if (error) return;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notifications Queue {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </h2>
        {['admin', 'superAdmin'].includes(user.role) && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border p-3 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Plus size={14} /> Add Notification
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 ">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Filters
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={filterMessage}
                onChange={(e) => setFilterMessage(e.target.value)}
                className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm w-full dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm w-full dark:text-gray-100"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm w-full dark:text-gray-100"
                />
              </div>
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm w-full dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setFilterPriority(null);
                setFilterMessage('');
                setStartDate('');
                setEndDate('');
                setSortOrder('desc');
              }}
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        )}

        {/* Priority Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilterPriority(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              filterPriority === null
                ? 'ring-2 ring-offset-1 ring-green-500 dark:ring-green-400'
                : ' border-green-400     dark:border-green-400 '
            }`}
          >
            <span className="text-black dark:text-white">All Priorities</span>
          </button>
          {Object.entries(PRIORITY_MAP).map(([id, { label, color }]) => (
            <button
              key={id}
              onClick={() => setFilterPriority(parseInt(id))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${color} ${
                filterPriority === parseInt(id) ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 min-h-screen">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No notifications found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {filterPriority || filterMessage || startDate || endDate
                ? 'Try adjusting your filters'
                : 'No notifications have been created yet'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((notif) => {
              const priority = PRIORITY_MAP[notif.notificationPriorityId] || {
                label: 'Unknown',
                color:
                  'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
              };

              return (
                <li
                  key={notif.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    notif.isLive ? 'border-l-4 border-blue-500 dark:border-blue-400' : ''
                  }`}
                >
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1 flex gap-3 items-start sm:items-center">
                      <div className={`mt-1 w-3 h-3 rounded-full ${priority.color.split(' ')[0]}`} />
                      <div>
                        <p className="text-gray-800 dark:text-gray-100 font-medium mb-1.5">
                          {/* <a href={notif.url} className="hover:underline">

                            </a> */}

                          <Link to="#" className="hover:underline">
                            {notif.message}
                          </Link>
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
                          <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                          <span className="bg-gray-200 dark:bg-gray-600 w-1 h-1 rounded-full" />
                          <span>
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {notif.isLive && (
                            <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs font-semibold">LIVE</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {adminRoles.includes(user.role) && (
                      <div className="flex gap-3 mt-2 sm:mt-0">
                        <button className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                          <Edit size={16} /> Edit
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="60%">
          <AddNotification addNotificationToggler={addNotificationToggler} userId={user.userId} token={user.token} />
        </Drawer>
      )}
    </div>
  );
}
