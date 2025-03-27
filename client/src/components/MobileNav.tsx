import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";
import { Home, Search, Bookmark, Video, Settings } from "lucide-react";

const MobileNav = () => {
  const { translate } = useAppContext();
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="grid grid-cols-5 h-16">
        <Link href="/">
          <div className={`flex flex-col items-center justify-center h-full ${location === '/' ? 'text-primary-600' : 'text-gray-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">{translate('home')}</span>
          </div>
        </Link>
        
        <button className="flex flex-col items-center justify-center text-gray-500">
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">{translate('search')}</span>
        </button>
        
        <Link href="/videos">
          <div className={`flex flex-col items-center justify-center h-full ${location === '/videos' ? 'text-primary-600' : 'text-gray-500'}`}>
            <Video className="w-5 h-5" />
            <span className="text-xs mt-1">{translate('video_tutorials')}</span>
          </div>
        </Link>
        
        <button className="flex flex-col items-center justify-center text-gray-500">
          <Bookmark className="w-5 h-5" />
          <span className="text-xs mt-1">{translate('favorites')}</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-gray-500">
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">{translate('settings')}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
