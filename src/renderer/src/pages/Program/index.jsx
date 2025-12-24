import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Outlet } from 'react-router-dom';
export default function Program() {
  return (
    <div>
      <PageMeta title="Programs" description="This is Program page" />
      <PageBreadcrumb pageTitle="Program" />
      {/* <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3  xl:px-7 xl:py-10"> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
