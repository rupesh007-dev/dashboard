import { useContext, useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Ensure this matches your router version
import { useGetNotificationsByUserIdQuery } from '../../store/apiServices/notificationApi';
import { SocketContext } from '../../context/SocketContext';
import { Bell, BellOff, ArrowUpRight } from 'lucide-react'; // Recommended for cleaner icons

// --- Helpers moved outside to prevent re-renders ---

const PRIORITY_MAP = {
  1: { label: 'Low', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400' },
  2: {
    label: 'Med',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  3: {
    label: 'High',
    color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  },
  4: { label: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400' },
};

function formatTimestamp(dateString) {
  if (!dateString) return 'Just now';
  let safeDateString = dateString.replace(' ', 'T');
  const date = new Date(safeDateString);
  if (isNaN(date.getTime())) return 'Just now';

  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// --- Main Component ---

export default function SidebarWidget({ user }) {
  const socket = useContext(SocketContext);
  const [liveNotifications, setLiveNotifications] = useState([]);

  const { data: notifications, isLoading } = useGetNotificationsByUserIdQuery(user?.role, {
    skip: !user?.role,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      const newNotification = {
        id: Date.now(), // Fallback ID
        type: notification.type,
        message: notification.message,
        url: notification?.payload?.url || '#',
        priorityId: notification?.payload?.priorityId || 3,
        isLive: true,
        createdAt: new Date().toISOString(),
      };
      setLiveNotifications((prev) => [newNotification, ...prev]);
      toast.success(notification.message, { icon: '🔔' });
    };

    socket.on('receiveCampaignNotification', handleNotification);
    return () => socket.off('receiveCampaignNotification', handleNotification);
  }, [socket]);

  // Merge and limit notifications
  const allNotifications = useMemo(() => {
    const combined = [...liveNotifications, ...(notifications || [])];
    return combined.slice(0, 4); // Keep sidebar short
  }, [liveNotifications, notifications]);

  return (
    <div className="w-full max-w-80 mx-auto    ">
      {/* <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
          Recent Alerts
        </h3>
        {allNotifications.length > 0 && (
          <Link to="/notifications" className="text-[10px] font-medium text-blue-600 hover:underline">
            View All
          </Link>
        )}
      </div> */}

      <div className="space-y-2">
        {allNotifications.length > 0 ? (
          allNotifications.map((n, idx) => {
            const priority = PRIORITY_MAP[n.priorityId] || PRIORITY_MAP[3];
            const isNew = n.isLive;

            return (
              <Link
                key={n.id || idx}
                to={n.url || '#'}
                className={`group relative block p-3 rounded-xl border transition-all duration-200 
                  ${
                    isNew
                      ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-500/5 dark:border-blue-800'
                      : 'bg-white border-gray-100 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-tight ${priority.color}`}
                  >
                    {priority.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {n.isLive ? 'Now' : formatTimestamp(n.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {n.message}
                </p>

                {isNew && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                )}
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <BellOff className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
