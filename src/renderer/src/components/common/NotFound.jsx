import { Link } from 'react-router-dom';
import PageMeta from './PageMeta';

export default function NotFound() {
  return (
    <>
      <PageMeta title="404 Dashboard" description="This is 404 Dashboard page." />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <div className="mx-auto w-full max-w-60.5 text-center sm:max-w-118">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">ERROR</h1>

          <img
            src="https://www.dropbox.com/scl/fi/08bunkevu4w88hyze7eys/404.svg?rlkey=k9d264v4f9xfgbit497c8ajkl&st=5rxrcflx&raw=1"
            alt="404"
            className="dark:hidden"
          />
          <img
            src="https://www.dropbox.com/scl/fi/tdv7w0lf692rxq4hxqxnd/404-dark.svg?rlkey=7pvdja83mwwb4i7vpbi1ic2xu&st=vrtqy8bi&raw=1"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
          >
            Back to Home Page
          </Link>
        </div>
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Revvknew Media
        </p>
      </div>
    </>
  );
}
