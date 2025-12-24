import NotificationTabs from './NotificationTabs/NotificationTabs';

export default function NotificationLayout() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <NotificationTabs />
      </div>
    </div>
  );
}
