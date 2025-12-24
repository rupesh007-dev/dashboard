import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import AttendanceLayout from '../../dashboard/attendance/AttendanceLayout';
export default function Attendance() {
  return (
    <div>
      <PageMeta title="Attendance" description="This is Attendance page" />
      <PageBreadcrumb pageTitle="Attendance" />
      {/* <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3  xl:px-7 xl:py-10"> */}
      <div>
        <AttendanceLayout />
      </div>
    </div>
  );
}
