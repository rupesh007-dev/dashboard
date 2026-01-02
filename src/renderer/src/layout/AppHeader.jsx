import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Ellipsis } from 'lucide-react';
import Checkout from '../components/header/Checkout';
import SessionBox from '../components/header/SessionBox';
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
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8  ">
        <div className="py-8  "></div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/">
            <img
              className="h-8 w-auto dark:hidden"
              src="https://www.dropbox.com/scl/fi/hsdob0q1w5c5152hfp1fw/Nerua-Logo.png?rlkey=ipvozips4aecfbhcat4k2qn7v&st=qrm7jrvy&raw=1"
              alt="Logo"
            />
            <img
              className="hidden h-8 w-auto dark:block"
              src="https://www.dropbox.com/scl/fi/hsdob0q1w5c5152hfp1fw/Nerua-Logo.png?rlkey=ipvozips4aecfbhcat4k2qn7v&st=qrm7jrvy&raw=1"
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
  );
};

export default AppHeader;
