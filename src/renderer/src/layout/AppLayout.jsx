import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

import Backdrop from './Backdrop';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const user = useSelector((state) => state.user.value);
  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar user={user} />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-72.5' : 'lg:ml-22.5'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader user={user} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
