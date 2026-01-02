// import { useContext, useEffect, useState, useMemo } from 'react';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';
// import { useGetNotificationsByUserIdQuery } from '../../store/apiServices/notificationApi';
// import { SocketContext } from '../../context/SocketContext';
// import { BellOff } from 'lucide-react';
// import { FormatDate } from '../common/FormatDate';
// import { StatusBadge } from '../common/StatusBadge';

// /* ================= NORMALIZER ================= */
// const normalizeNotification = (n, source = 'other') => ({
//   id:
//     n.id ||
//     n.notificationId ||
//     `${source}-${n.type}-${n.createdAt || Date.now()}`,
//   message: n.message,
//   url: n.url || '#',
//   priorityId: n.priorityId || n.notificationPriorityId || 3,
//   type: n.type || source,
//   source,
//   createdAt: n.createdAt || new Date().toISOString(),
//   isLive:
//     ['delivery', 'bulkUpload', 'task', 'activity'].includes(source) ||
//     ['delivery', 'bulkUpload', 'task', 'activity'].includes(n.type),
// });

// export default function SidebarWidget({ user }) {
//   const socket = useContext(SocketContext);

//   const [notifications, setNotifications] = useState([]);

//   /* ================= ROLE NOTIFICATIONS ================= */
//   const { data: roleNotifications = [] } =
//     useGetNotificationsByUserIdQuery(user?.role, { skip: !user?.role });

//   console.log(roleNotifications,'noti')
//   /* ================= FETCH USER NOTIFICATIONS ================= */
//   useEffect(() => {
//     if (!user?.userId) return;

//     (async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/notifications/user?userId=${user.userId}`
//         );
//         if (!res.ok) throw new Error('Fetch failed');
//         const data = await res.json();

//         // Merge roleNotifications (from RTK query) and user notifications (from fetch)
//         // Normalize all notifications with source so they can be separated later
//         const normalizedRole = roleNotifications.map(n =>
//           normalizeNotification(n, 'role')
//         );
//         const normalizedUser = data.map(n => normalizeNotification(n, 'user'));

//         // Combine and deduplicate by id (latest by createdAt)
//         const combined = [...normalizedRole, ...normalizedUser];
//         const map = new Map();

//         combined.forEach(n => {
//           if (
//             !map.has(n.id) ||
//             new Date(n.createdAt) > new Date(map.get(n.id).createdAt)
//           ) {
//             map.set(n.id, n);
//           }
//         });

//         setNotifications(Array.from(map.values()));
//       } catch (e) {
//         console.error('User notifications fetch failed', e);
//       }
//     })();
//   }, [user?.userId, roleNotifications]);

//   /* ================= SOCKET LISTENERS ================= */
//   useEffect(() => {
//     if (!socket || !user) return;

//     const handleNotification = (n, source) => {
//       // Normalize and add to notifications list
//       const normalized = normalizeNotification(n, source);

//       setNotifications(prev => {
//         // Avoid duplicates: if exists and newer, replace
//         const map = new Map(prev.map(x => [x.id, x]));
//         if (
//           !map.has(normalized.id) ||
//           new Date(normalized.createdAt) > new Date(map.get(normalized.id).createdAt)
//         ) {
//           map.set(normalized.id, normalized);
//         }
//         // Return sorted array descending by date
//         return Array.from(map.values()).sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//       });

//       // Toast with icon based on source
//       const iconMap = {
//         delivery: '📦',
//         bulkUpload: '📤',
//         task: '📝',
//         activity: '🔔',
//       };
//       toast.success(normalized.message, { icon: iconMap[source] || '🔔' });
//     };

//     socket.on('delivery', n => handleNotification(n, 'delivery'));
//     socket.on('bulkUpload', n => handleNotification(n, 'bulkUpload'));
//     socket.on('task', n => handleNotification(n, 'task'));
//     socket.on('activity', n => handleNotification(n, 'activity'));

//     return () => {
//       socket.off('delivery');
//       socket.off('bulkUpload');
//       socket.off('task');
//       socket.off('activity');
//     };
//   }, [socket, user]);

//   /* ================= SEPARATE NOTIFICATIONS BY TYPE ================= */
//   const sections = useMemo(() => {
//     const filteredByType = type =>
//       notifications
//         .filter(n => n.type === type || n.source === type)
//         .slice(0, 3);

//     return [
//       {
//         title: '📦 Campaign Deliveries',
//         data: filteredByType('delivery'),
//       },
//       {
//         title: '📤 Bulk Uploads',
//         data: filteredByType('bulkUpload'),
//       },
//       {
//         title: '📝 Task Updates',
//         data: filteredByType('task'),
//       },
//       {
//         title: '🔔 Activity',
//         data: filteredByType('activity'),
//       },
//     ];
//   }, [notifications]);

//   /* ================= UI ================= */
//   const NotificationCard = ({ n }) => (
//     <Link
//       to={n.url}
//       className="block p-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-100"
//     >
//       <div className="flex justify-between mb-1">
//         <StatusBadge name={n.priorityId} />
//         <span className="text-[10px] text-gray-400">{FormatDate(n.createdAt)}</span>
//       </div>
//       <p className="text-sm line-clamp-2">{n.message}</p>
//     </Link>
//   );

//   return (
//     <div className="w-full max-w-80 mx-auto space-y-6">
//       {sections.map(section => (
//         <div key={section.title}>
//           <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
//             {section.title}
//           </h4>
//           {section.data.length ? (
//             section.data.map(n => <NotificationCard key={n.id} n={n} />)
//           ) : (
//             <Empty label="No notifications" />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ================= EMPTY ================= */
// const Empty = ({ label }) => (
//   <div className="flex flex-col items-center py-4 border-2 border-dashed rounded-xl">
//     <BellOff className="w-6 h-6 text-gray-300 mb-1" />
//     <p className="text-xs text-gray-400">{label}</p>
//   </div>
// );

// import { useContext, useEffect, useState, useMemo } from 'react';
// import toast from 'react-hot-toast';
// import { useGetNotificationsByUserIdQuery } from '../../store/apiServices/notificationApi';
// import { SocketContext } from '../../context/SocketContext';
// import { BellOff } from 'lucide-react';
// import { FormatDate } from '../common/FormatDate';
// import { StatusBadge } from '../common/StatusBadge';

// const normalizeNotification = (n, source = 'other') => ({
//   id: n.id || n.notificationId || `${source}-${n.type}-${n.createdAt || Date.now()}`,
//   message: n.message,
//   url: n.url || '#',
//   priorityId: n.priorityId || n.notificationPriorityId || 3,
//   type: n.type || source,
//   source,
//   createdAt: n.createdAt || new Date().toISOString(),
//   isLive:
//     ['delivery', 'bulkUpload', 'task', 'activity'].includes(source) ||
//     ['delivery', 'bulkUpload', 'task', 'activity'].includes(n.type),
// });

// export default function SidebarWidget({ user }) {
//   const socket = useContext(SocketContext);

//   const [notifications, setNotifications] = useState([]);

//   const { data: roleNotifications = [] } = useGetNotificationsByUserIdQuery(user?.role, { skip: !user?.role });

//   const [expandedSection, setExpandedSection] = useState(null);
//   const [expandedNotificationId, setExpandedNotificationId] = useState(null);

//   useEffect(() => {
//     if (!user?.userId) return;

//     (async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/user?userId=${user.userId}`);
//         if (!res.ok) throw new Error('Fetch failed');
//         const data = await res.json();

//         const normalizedRole = roleNotifications.map((n) => normalizeNotification(n, 'role'));
//         const normalizedUser = data.map((n) => normalizeNotification(n, 'user'));

//         const combined = [...normalizedRole, ...normalizedUser];
//         const map = new Map();

//         combined.forEach((n) => {
//           if (!map.has(n.id) || new Date(n.createdAt) > new Date(map.get(n.id).createdAt)) {
//             map.set(n.id, n);
//           }
//         });

//         setNotifications(Array.from(map.values()));
//       } catch (e) {
//         console.error('User notifications fetch failed', e);
//       }
//     })();
//   }, [user?.userId, roleNotifications]);

//   useEffect(() => {
//     if (!socket || !user) return;

//     const handleNotification = (n, source) => {
//       const normalized = normalizeNotification(n, source);

//       setNotifications((prev) => {
//         const map = new Map(prev.map((x) => [x.id, x]));
//         if (!map.has(normalized.id) || new Date(normalized.createdAt) > new Date(map.get(normalized.id).createdAt)) {
//           map.set(normalized.id, normalized);
//         }
//         return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       });

//       const iconMap = {
//         delivery: '📦',
//         bulkUpload: '📤',
//         task: '📝',
//         activity: '🔔',
//       };
//       toast.success(normalized.message, { icon: iconMap[source] || '🔔' });
//     };

//     socket.on('delivery', (n) => handleNotification(n, 'delivery'));
//     socket.on('bulkUpload', (n) => handleNotification(n, 'bulkUpload'));
//     socket.on('task', (n) => handleNotification(n, 'task'));
//     socket.on('activity', (n) => handleNotification(n, 'activity'));

//     return () => {
//       socket.off('delivery');
//       socket.off('bulkUpload');
//       socket.off('task');
//       socket.off('activity');
//     };
//   }, [socket, user]);

//   const sections = useMemo(() => {
//     const filteredByType = (type) => notifications.filter((n) => n.type === type || n.source === type);

//     return [
//       {
//         key: 'delivery',
//         title: '📦 Campaign Deliveries',
//         data: filteredByType('delivery'),
//         borderColor: 'border-blue-400',
//         bgColor: 'bg-blue-50/50',
//       },
//       {
//         key: 'bulkUpload',
//         title: '📤 Bulk Uploads',
//         data: filteredByType('bulkUpload'),
//         borderColor: 'border-green-400',
//         bgColor: 'bg-green-50/50',
//       },
//       {
//         key: 'task',
//         title: '📝 Task Updates',
//         data: filteredByType('task'),
//         borderColor: 'border-yellow-400',
//         bgColor: 'bg-yellow-50/50',
//       },
//       {
//         key: 'activity',
//         title: '🔔 Activity',
//         data: filteredByType('activity'),
//         borderColor: 'border-purple-400',
//         bgColor: 'bg-purple-50/50',
//       },
//     ];
//   }, [notifications]);

//   const NotificationCard = ({ n, isExpanded, onToggle, sectionColors }) => (
//     <div
//       onClick={() => onToggle(n.id)}
//       className={`block p-3 rounded-xl border ${sectionColors.borderColor} ${sectionColors.bgColor} cursor-pointer select-none mb-2`}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter' || e.key === ' ') {
//           e.preventDefault();
//           onToggle(n.id);
//         }
//       }}
//     >
//       <div className="flex justify-between ">
//         <StatusBadge name={n.priorityId} />
//         <span className="text-[10px] text-gray-400">{FormatDate(n.createdAt)}</span>
//       </div>
//       <p className={`text-sm ${isExpanded ? '' : 'line-clamp-2'} whitespace-pre-wrap wrap-break-word`}>{n.message}</p>
//       {isExpanded && n.url && n.url !== '#' && (
//         <a
//           href={n.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-xs text-blue-600 hover:underline mt-1 block truncate"
//         >
//           Go to related link
//         </a>
//       )}
//     </div>
//   );

//   const handleNotificationToggle = (id) => {
//     setExpandedNotificationId((prev) => (prev === id ? null : id));
//   };

//   const handleSectionToggle = (key) => {
//     setExpandedSection((prev) => (prev === key ? null : key));
//     setExpandedNotificationId(null);
//   };

//   return (
//     <div className="w-full max-w-80 mx-auto space-y-2">
//       {sections.map((section) => {
//         const showAll = expandedSection === section.key;
//         const notificationsToShow = showAll ? section.data : section.data.slice(0, 1);

//         return (
//           <div key={section.key} className={`p-2 rounded-xl border ${section.borderColor} ${section.bgColor}`}>
//             <h4
//               className="text-xs font-semibold text-gray-700 uppercase px-2 mb-2 flex justify-between items-center cursor-pointer select-none"
//               onClick={() => handleSectionToggle(section.key)}
//             >
//               {section.title}
//               <span className="text-xs text-gray-500 select-none">{showAll ? '▲' : '▼'}</span>
//             </h4>

//             {notificationsToShow.length ? (
//               notificationsToShow.map((n) => (
//                 <NotificationCard
//                   key={n.id}
//                   n={n}
//                   isExpanded={expandedNotificationId === n.id}
//                   onToggle={handleNotificationToggle}
//                   sectionColors={{ borderColor: section.borderColor, bgColor: section.bgColor }}
//                 />
//               ))
//             ) : (
//               <Empty label="No notifications" />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// const Empty = ({ label }) => (
//   <div className="flex flex-col items-center py-4 border-2 border-dashed rounded-xl">
//     <BellOff className="w-6 h-6 text-gray-300 mb-1" />
//     <p className="text-xs text-gray-400">{label}</p>
//   </div>
// );
import { useContext, useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetNotificationsByUserIdQuery } from '../../store/apiServices/notificationApi';
import { SocketContext } from '../../context/SocketContext';
import { BellOff, ChevronDown, ChevronUp, ExternalLink, Package, UploadCloud, ClipboardList, Bell } from 'lucide-react';
import { FormatDate } from '../common/FormatDate';

// Map keys to Lucide Components
const iconMap = {
  delivery: Package,
  bulkUpload: UploadCloud,
  task: ClipboardList,
  activity: Bell,
};

const normalizeNotification = (n, source = 'other') => ({
  id: n.id || n.notificationId || `${source}-${n.type}-${n.createdAt || Date.now()}`,
  message: n.message,
  url: n.url || '#',
  priorityId: n.priorityId || n.notificationPriorityId || 3,
  type: n.type || source,
  source,
  createdAt: n.createdAt || new Date().toISOString(),
  isLive:
    ['delivery', 'bulkUpload', 'task', 'activity'].includes(source) ||
    ['delivery', 'bulkUpload', 'task', 'activity'].includes(n.type),
});

export default function SidebarWidget({ user }) {
  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const { data: roleNotifications = [] } = useGetNotificationsByUserIdQuery(user?.role, { skip: !user?.role });
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/user?userId=${user.userId}`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const normalizedRole = roleNotifications.map((n) => normalizeNotification(n, 'role'));
        const normalizedUser = data.map((n) => normalizeNotification(n, 'user'));
        const combined = [...normalizedRole, ...normalizedUser];
        const map = new Map();
        combined.forEach((n) => {
          if (!map.has(n.id) || new Date(n.createdAt) > new Date(map.get(n.id).createdAt)) {
            map.set(n.id, n);
          }
        });
        setNotifications(Array.from(map.values()));
      } catch (e) {
        console.error('User notifications fetch failed', e);
      }
    })();
  }, [user?.userId, roleNotifications]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleNotification = (n, source) => {
      const normalized = normalizeNotification(n, source);
      setNotifications((prev) => {
        const map = new Map(prev.map((x) => [x.id, x]));
        if (!map.has(normalized.id) || new Date(normalized.createdAt) > new Date(map.get(normalized.id).createdAt)) {
          map.set(normalized.id, normalized);
        }
        return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      // Toast notification using Lucide icon
      const IconComponent = iconMap[source] || Bell;
      toast.success(normalized.message, {
        icon: <IconComponent className="w-5 h-5 text-blue-500" />,
      });
    };

    socket.on('delivery', (n) => handleNotification(n, 'delivery'));
    socket.on('bulkUpload', (n) => handleNotification(n, 'bulkUpload'));
    socket.on('task', (n) => handleNotification(n, 'task'));
    socket.on('activity', (n) => handleNotification(n, 'activity'));

    return () => {
      socket.off('delivery');
      socket.off('bulkUpload');
      socket.off('task');
      socket.off('activity');
    };
  }, [socket, user]);

  const sections = useMemo(() => {
    const filteredByType = (type) => notifications.filter((n) => n.type === type || n.source === type);
    return [
      { key: 'delivery', title: 'Deliveries', icon: iconMap.delivery, color: 'blue', data: filteredByType('delivery') },
      {
        key: 'bulkUpload',
        title: 'Bulk Uploads',
        icon: iconMap.bulkUpload,
        color: 'emerald',
        data: filteredByType('bulkUpload'),
      },
      { key: 'task', title: 'Task Updates', icon: iconMap.task, color: 'amber', data: filteredByType('task') },
      { key: 'activity', title: 'Activity', icon: iconMap.activity, color: 'purple', data: filteredByType('activity') },
    ];
  }, [notifications]);

  const handleNotificationToggle = (id) => setExpandedNotificationId((prev) => (prev === id ? null : id));
  const handleSectionToggle = (key) => setExpandedSection((prev) => (prev === key ? null : key));

  return (
    <div className="w-full max-w-sm mx-auto space-y-3 p-1">
      {sections.map((section) => (
        <SectionContainer
          key={section.key}
          section={section}
          isOpen={expandedSection === section.key}
          onToggleSection={() => handleSectionToggle(section.key)}
          expandedNotificationId={expandedNotificationId}
          onNotificationToggle={handleNotificationToggle}
        >
          <NotificationList
            data={section.data}
            expandedId={expandedNotificationId}
            onNotificationToggle={handleNotificationToggle}
            color={section.color}
          />
        </SectionContainer>
      ))}
    </div>
  );
}

const SectionContainer = ({
  section,
  isOpen,
  onToggleSection,
  expandedNotificationId,
  onNotificationToggle,
  children,
}) => {
  const colorMap = {
    blue: 'border-blue-100 bg-blue-50/30 text-blue-600',
    emerald: 'border-emerald-100 bg-emerald-50/30 text-emerald-600',
    amber: 'border-amber-100 bg-amber-50/30 text-amber-600',
    purple: 'border-purple-100 bg-purple-50/30 text-purple-600',
  };

  const Icon = section.icon;
  const firstNotification = section.data[0];

  return (
    <div
      className={`overflow-hidden transition-all duration-200 border rounded-2xl ${isOpen ? 'bg-white shadow-sm ring-1 ring-black/5' : 'bg-transparent border-transparent'}`}
    >
      <button
        onClick={onToggleSection}
        className={`w-full flex items-center justify-between p-3 transition-colors hover:bg-gray-50/50 ${isOpen ? 'border-b border-gray-100' : ''}`}
      >
        <div className="flex items-center gap-3">
          <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${colorMap[section.color]}`}>
            <Icon className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold text-gray-700">{section.title}</span>
          {section.data.length > 0 && !isOpen && (
            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {section.data.length}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      <div className={`p-2 ${isOpen ? 'block' : 'hidden'}`}>{children}</div>

      {!isOpen && firstNotification && (
        <div className="px-2 pb-1">
          <NotificationCard
            n={firstNotification}
            isExpanded={expandedNotificationId === firstNotification.id}
            onToggle={onNotificationToggle}
            color={section.color}
          />
        </div>
      )}
    </div>
  );
};

const NotificationList = ({ data, expandedId, onNotificationToggle, color }) => {
  if (data.length === 0) return <Empty label="Clear for now" />;
  return (
    <div className="space-y-2">
      {data.map((n) => (
        <NotificationCard
          key={n.id}
          n={n}
          isExpanded={expandedId === n.id}
          onToggle={onNotificationToggle}
          color={color}
        />
      ))}
    </div>
  );
};

const NotificationCard = ({ n, isExpanded, onToggle, color }) => {
  const colorBorders = {
    blue: 'hover:border-blue-200',
    emerald: 'hover:border-emerald-200',
    amber: 'hover:border-amber-200',
    purple: 'hover:border-purple-200',
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.(n.id);
      }}
      className={`group relative p-3 rounded-xl border border-gray-100 bg-white transition-all duration-300 
        ${isExpanded ? 'border-gray-300 ring-1 ring-gray-100 shadow-sm' : `${colorBorders[color]} hover:shadow-md hover:-translate-y-0.5`} 
        cursor-pointer`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex items-center gap-2">
          {n.isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-gray-400 tabular-nums">{FormatDate(n.createdAt)}</span>
      </div>

      <p className={`text-sm text-gray-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{n.message}</p>

      {isExpanded && n.url && n.url !== '#' && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <a
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View Details
          </a>
        </div>
      )}
    </div>
  );
};

const Empty = ({ label }) => (
  <div className="flex flex-col items-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
    <BellOff className="w-5 h-5 text-gray-300 mb-2" />
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
);
