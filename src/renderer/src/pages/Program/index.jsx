import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { Outlet } from 'react-router-dom';
export default function Program() {
  return (
    <div>
      <PageMeta title="Programs" description="This is Program page" />
      <PageBreadcrumb pageTitle="Program" />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
