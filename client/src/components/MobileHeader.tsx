import { useAppContext } from "@/lib/context";
import { useState } from "react";
import { Link } from "wouter";

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader = ({ toggleSidebar }: MobileHeaderProps) => {
  const { translate } = useAppContext();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <header className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-md hover:bg-gray-100" 
          aria-label="Menu"
        >
          <span className="material-icons">menu</span>
        </button>
        <Link href="/">
          <h1 className="text-lg font-bold text-primary-600 flex items-center">
            <span className="material-icons mr-1">bolt</span>
            {translate('app_title')}
          </h1>
        </Link>
        <button 
          onClick={() => setShowOptions(!showOptions)} 
          className="p-1 rounded-md hover:bg-gray-100" 
          aria-label="More options"
        >
          <span className="material-icons">more_vert</span>
        </button>
      </div>

      {showOptions && (
        <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setShowOptions(false);
              }}
            >
              <span className="flex items-center">
                <span className="material-icons text-sm mr-2">translate</span>
                {translate('language_toggle')}
              </span>
            </button>
            <button 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                setShowOptions(false);
              }}
            >
              <span className="flex items-center">
                <span className="material-icons text-sm mr-2">help_outline</span>
                {translate('help')}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
