import { Outlet } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';

export default function HomeLayout() {
  return (
    <div>
      <PageMeta title="Home" description="This is Home page." />
      {/* <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3 xl:px-7 xl:py-10"> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
