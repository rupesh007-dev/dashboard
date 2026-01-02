import { Outlet } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';

export default function HomeLayout() {
  return (
    <div>
      <PageMeta title="Home" description="This is Home page." />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
