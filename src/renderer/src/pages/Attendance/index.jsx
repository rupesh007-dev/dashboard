import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import AttendanceLayout from '../../dashboard/attendance/AttendanceLayout';
export default function Attendance() {
  return (
    <div>
      <PageMeta title="Attendance" description="This is Attendance page" />
      <PageBreadcrumb pageTitle="Attendance" />

      <div>
        <AttendanceLayout />
      </div>
    </div>
  );
}
