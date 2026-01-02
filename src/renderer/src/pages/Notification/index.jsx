import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import NotificationLayout from '../../dashboard/notification/NotificationLayout';
export default function Notification() {
  return (
    <div>
      <PageMeta title="Notifications" description="This is Notification page" />
      <PageBreadcrumb pageTitle="Notification" />

      <div>
        <NotificationLayout />
      </div>
    </div>
  );
}
