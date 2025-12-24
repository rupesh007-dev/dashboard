import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useSidebar } from '../context/SidebarContext';

import {
  BellIcon,
  ChevronDownIcon,
  Ellipsis,
  FileSpreadsheet,
  GridIcon,
  House,
  Megaphone,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import Versions from '../components/sidebar/Versions';
import SidebarWidget from '../components/sidebar/SidebarWidget';

const navItems = [
  {
    icon: <House />,
    name: 'Dashboard',
    subItems: [
      { name: 'Task', path: '/', pro: false },
      { name: 'Attendance', path: '/attendance', pro: false },
    ],
  },
  {
    icon: <FileSpreadsheet />,
    name: 'Brief',
    path: '/briefs',
  },
  {
    icon: <Megaphone />,
    name: 'Program',
    path: '/programs',
  },
  {
    icon: <BellIcon />,
    name: 'Notification',
    path: '/notification',
  },
];

const othersItems = [
  // {
  //   icon: <GridIcon />,
  //   name: 'Setting',
  //   subItems: [{ name: 'Sign Out', path: '/signin', pro: false }],
  // },
];

const AppSidebar = ({ user }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar, toggleSidebar } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ['main', 'others'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'}`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index ? 'rotate-180 text-brand-500' : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-72.5' : isHovered ? 'w-72.5' : 'w-22.5'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex items-center gap-3 ${
          !isExpanded && !isHovered ? 'lg:justify-between' : 'justify-between'
        }`}
      >
        {/* Logo (click to go home) */}
        <Link to="/" className="flex items-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              className="dark:hidden"
              src="https://dl.dropboxusercontent.com/scl/fi/x06lq503q564254zn5370/Main-logo.svg?rlkey=gn7njrmr1bcixpl3atgkobjaz"
              alt="Logo"
              width={150}
              height={40}
            />
          ) : null}

          {isExpanded || isHovered || isMobileOpen ? (
            <img
              className="hidden dark:block"
              src="https://dl.dropboxusercontent.com/scl/fi/x06lq503q564254zn5370/Main-logo.svg?rlkey=gn7njrmr1bcixpl3atgkobjaz"
              alt="Logo"
              width={150}
              height={40}
            />
          ) : null}
        </Link>

        {/* Sidebar Toggle Button */}
        <button
          className="flex items-center justify-center w-10 h-10 text-gray-500 hover:bg-black/10 rounded-lg     dark:border-gray-800 dark:text-gray-400 lg:h-10 lg:w-10"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          {isExpanded || isHovered || isMobileOpen ? <PanelRightOpen size={24} /> : <PanelRightClose size={24} />}
        </button>

        {/* Collapsed mode icon */}
        {!isExpanded && !isHovered && !isMobileOpen && (
          <Link to="/" className="flex items-center">
            <img
              src="https://dl.dropboxusercontent.com/scl/fi/92yl4naewe0jvbnd5rbpu/icons8-dashboard-96.png?rlkey=g4a1onr79y7zan8ta070mbrtu"
              alt="Logo Icon"
              width={32}
              height={32}
            />
          </Link>
        )}
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Menu' : <Ellipsis className="size-6" />}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>
            <div className="">
              <h2
                className={`  text-xs uppercase flex leading-5 text-gray-400 ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Recent Alerts' : <Ellipsis />}
              </h2>
              {renderMenuItems(othersItems, 'others')}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget user={user} /> : null}
        {isExpanded || isHovered || isMobileOpen ? <Versions /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
