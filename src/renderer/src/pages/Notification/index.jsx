import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import NotificationLayout from '../../dashboard/notification/NotificationLayout';
export default function Notification() {
  return (
    <div>
      <PageMeta title="Notifications" description="This is Notification page" />
      <PageBreadcrumb pageTitle="Notification" />
      {/* <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3  xl:px-7 xl:py-10"> */}
      <div>
        <NotificationLayout />
      </div>
    </div>
  );
}
