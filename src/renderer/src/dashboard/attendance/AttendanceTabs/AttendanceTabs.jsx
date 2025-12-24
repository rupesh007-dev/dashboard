import { useState, useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import MyAttendance from './AttendanceTables/MyAttendance';
import ApplyLeave from './AttendanceTables/ApplyLeave';
import PendingLeaveApprovals from './AttendanceTables/PendingLeaveApprovals';
import AttendanceRecords from './AttendanceTables/AttendanceRecords';

const DefaultTaskView = () => (
  <div className="py-4 text-center text-gray-400">
    <p>Default view content or Today's Attendance...</p>
  </div>
);

const adminTabs = [
  { id: 'Apply Leave', label: 'Apply Leave' },
  { id: 'My Attendance', label: 'My Attendance' },
  { id: 'Attendance Records', label: 'Attendance Records' },
  { id: 'Pending Leave Approvals', label: 'Pending Leave Approvals' },
];

const userTabs = [{ id: 'Apply Leave', label: 'Apply Leave' }];

export default function AttendanceTabs() {
  const user = useSelector((state) => state.user.value);
  const userId = user?.userId;
  const isUserAdmin = user?.role === 'admin';

  const TABS = useMemo(() => {
    return isUserAdmin ? adminTabs : userTabs;
  }, [isUserAdmin]);

  const [activeTab, setActiveTab] = useState(TABS[0]?.id);

  const renderContent = () => {
    switch (activeTab) {
      case 'Apply Leave':
        return <ApplyLeave userId={userId} />;

      case 'My Attendance':
        return <MyAttendance userId={userId} />;

      case 'Attendance Records':
        return <AttendanceRecords userId={userId} />;

      case 'Pending Leave Approvals':
        return <PendingLeaveApprovals userId={userId} />;

      default:
        return <DefaultTaskView />;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Attendance Queue</h2>
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

//   case 'Attendance Summary':
//     return <UnassignedTask userId={userId} />;

//   case 'Pending Leave Approvals':
//     return <AllTask user={user} />;
