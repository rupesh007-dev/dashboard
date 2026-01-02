import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { Outlet } from 'react-router-dom';
export default function Brief() {
  return (
    <div>
      <PageMeta title="Briefs" description="This is Brief page" />
      <PageBreadcrumb pageTitle="Briefs" />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
