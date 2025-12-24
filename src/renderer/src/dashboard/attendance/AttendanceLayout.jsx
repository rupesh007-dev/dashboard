import AttendanceTabs from './AttendanceTabs/AttendanceTabs';
import Attendancesummary from './AttendanceSummary/AttendanceSummary';

export default function AttendanceLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Attendancesummary />
      </div>
      <div className="col-span-12">
        <AttendanceTabs />
      </div>
    </div>
  );
}
