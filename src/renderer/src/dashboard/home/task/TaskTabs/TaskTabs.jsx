import { useState, useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import AssignedByMe from './TaskTables/AssignedByMe';
import MyTask from './TaskTables/MyTask';
import UnassignedTask from './TaskTables/UnassignedTask';
import AllTask from './TaskTables/AllTask';

const DefaultTaskView = () => (
  <div className="py-4 text-center text-gray-400">
    <p>Default view content or Today's Tasks...</p>
  </div>
);

const adminTabs = [
  { id: 'My Tasks', label: 'My Tasks' },
  { id: 'Assigned By Me', label: 'Assigned By Me' },
  { id: 'Unassigned Tasks', label: 'Unassigned Tasks' },
  { id: 'All Tasks', label: 'All Tasks' },
];

const userTabs = [{ id: 'My Tasks', label: 'My Tasks' }];

export default function TaskTabsSoft() {
  const user = useSelector((state) => state.user.value);
  const userId = user?.userId;
  const isUserAdmin = user?.role === 'admin';

  const TABS = useMemo(() => {
    return isUserAdmin ? adminTabs : userTabs;
  }, [isUserAdmin]);

  const [activeTab, setActiveTab] = useState(TABS[0]?.id);

  const renderContent = () => {
    switch (activeTab) {
      case 'My Tasks':
        return <MyTask userId={userId} />;

      case 'Assigned By Me':
        return <AssignedByMe userId={userId} />;

      case 'Unassigned Tasks':
        return <UnassignedTask userId={userId} />;

      case 'All Tasks':
        return <AllTask user={user} />;

      default:
        return <DefaultTaskView />;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Queue</h2>
      </div>

      <div className="flex space-x-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'
            }`}
          >
            {activeTab === tab.id && (
              <Motion.div
                layoutId="active-pill-soft"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20"
                style={{ borderRadius: 9999 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
