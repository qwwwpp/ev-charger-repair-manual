import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";

const MobileNav = () => {
  const { translate } = useAppContext();
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="grid grid-cols-4 h-16">
        <div className={`flex flex-col items-center justify-center ${location === '/' ? 'text-primary-600' : 'text-gray-500'}`}>
          <Link href="/">
            <span className="material-icons text-xl">home</span>
            <span className="text-xs mt-1">{translate('home')}</span>
          </Link>
        </div>
        <button className="flex flex-col items-center justify-center text-gray-500">
          <span className="material-icons text-xl">search</span>
          <span className="text-xs mt-1">{translate('search')}</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500">
          <span className="material-icons text-xl">bookmark_border</span>
          <span className="text-xs mt-1">{translate('favorites')}</span>
        </button>
        <button className="flex flex-col items-center justify-center text-gray-500">
          <span className="material-icons text-xl">settings</span>
          <span className="text-xs mt-1">{translate('settings')}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
