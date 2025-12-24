import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Ellipsis } from 'lucide-react';
import Checkout from '../components/header/Checkout';
import SessionBox from '../components/header/sessionbox';
import TimeZone from '../components/header/TimeZone';
import UserDropdown from '../components/header/UserDropdown';

const AppHeader = ({ user }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-99 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Inner wrapper: Removed flex-col to keep items aligned horizontally on large screens */}
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8  ">
        {/* Left Side: Greeting */}
        <div className="py-8  ">
          <h1 className="text-lg leading-snug text-gray-800 dark:text-white">
            {/* Hello, <span className="font-semibold">{user?.username || 'Guest'}</span> */}
          </h1>
        </div>

        {/* Center/Right Side: Mobile Logo & Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/">
            <img
              className="h-8 w-auto dark:hidden"
              src="https://dl.dropboxusercontent.com/scl/fi/x06lq503q564254zn5370/Main-logo.svg?rlkey=gn7njrmr1bcixpl3atgkobjaz"
              alt="Logo"
            />
            <img
              className="hidden h-8 w-auto dark:block"
              src="https://dl.dropboxusercontent.com/scl/fi/x06lq503q564254zn5370/Main-logo.svg?rlkey=gn7njrmr1bcixpl3atgkobjaz"
              alt="Logo"
            />
          </Link>
          <button
            onClick={toggleApplicationMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Ellipsis />
          </button>
        </div>

        {/* Right Side: Desktop Menu / Mobile Dropdown */}
        <div
          className={`${
            isApplicationMenuOpen ? 'flex' : 'hidden'
          } absolute top-full left-0 w-full flex-col items-center gap-4 border-b border-gray-200 bg-white px-5 py-4 shadow-md lg:static lg:flex lg:w-auto lg:flex-row lg:border-none lg:bg-transparent lg:py-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <SessionBox />
            <TimeZone />
            <Checkout />
            <UserDropdown user={user || 'Guest'} />
          </div>
        </div>
      </div>
    </header>

    // <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
    //   <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6  ">
    //     <h1 className="leading-snug">
    //       Hello,<span className="font-semibold ">{user?.username}</span>
    //     </h1>

    //     <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
    //       <Link to="/" className="lg:hidden">
    //         <img
    //           className="dark:hidden h-8 w-24"
    //           src="https://www.dropbox.com/scl/fi/hsdob0q1w5c5152hfp1fw/Nerua-Logo.png?rlkey=ipvozips4aecfbhcat4k2qn7v&st=qrm7jrvy&raw=1"
    //           alt="Logo"
    //         />
    //         <img
    //           className="hidden dark:block h-12 w-28"
    //           src="https://www.dropbox.com/scl/fi/hsdob0q1w5c5152hfp1fw/Nerua-Logo.png?rlkey=ipvozips4aecfbhcat4k2qn7v&st=qrm7jrvy&raw=1"
    //           alt="Logo"
    //         />
    //       </Link>

    //       <button
    //         onClick={toggleApplicationMenu}
    //         className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
    //       >
    //         <Ellipsis />
    //       </button>
    //     </div>
    //     <div
    //       className={`${
    //         isApplicationMenuOpen ? 'flex' : 'hidden'
    //       } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
    //     >
    //       <div className="flex items-center gap-2 2xsm:gap-3">
    //         <SessionBox />
    //         <TimeZone />

    //         {/* <ThemeToggleButton /> */}
    //         <Checkout />
    //       </div>
    //     </div>
    //   </div>
    // </header>
  );
};

export default AppHeader;
