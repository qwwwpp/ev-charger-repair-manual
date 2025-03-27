import { Link, useLocation } from "wouter";
import { useAppContext } from "@/lib/context";
import { useState } from "react";
import { ErrorType, ErrorTypeStats } from "@/lib/types";
import { Video } from "lucide-react";

interface SidebarProps {
  errorStats: ErrorTypeStats;
}

export const Sidebar = ({ errorStats }: SidebarProps) => {
  const { translate, language, setLanguage, selectedErrorType, setSelectedErrorType } = useAppContext();
  const [location] = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  const handleFilterChange = (type: ErrorType | 'all') => {
    setSelectedErrorType(type);
  };

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">
          <span className="flex items-center">
            <span className="material-icons mr-2">bolt</span>
            {translate('app_title')}
          </span>
        </h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {translate('error_types')}
        </h2>
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => handleFilterChange('all')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedErrorType === 'all' 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons text-sm mr-2">check_circle_outline</span>
              {translate('all_errors')}
              <span className={`ml-auto ${
                selectedErrorType === 'all' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600'
              } text-xs rounded-full px-2 py-0.5`}>
                {errorStats.total}
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleFilterChange('常规停止')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedErrorType === '常规停止' 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons text-sm mr-2">info_outline</span>
              {translate('normal_stop')}
              <span className={`ml-auto ${
                selectedErrorType === '常规停止' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600'
              } text-xs rounded-full px-2 py-0.5`}>
                {errorStats['常规停止']}
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleFilterChange('设备异常')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedErrorType === '设备异常' 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons text-sm mr-2">warning_amber</span>
              {translate('device_error')}
              <span className={`ml-auto ${
                selectedErrorType === '设备异常' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600'
              } text-xs rounded-full px-2 py-0.5`}>
                {errorStats['设备异常']}
              </span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleFilterChange('车辆异常')}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                selectedErrorType === '车辆异常' 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons text-sm mr-2">error_outline</span>
              {translate('vehicle_error')}
              <span className={`ml-auto ${
                selectedErrorType === '车辆异常' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600'
              } text-xs rounded-full px-2 py-0.5`}>
                {errorStats['车辆异常']}
              </span>
            </button>
          </li>
        </ul>
        
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">
          {translate('video_tutorials')}
        </h2>
        <ul className="space-y-1">
          <li>
            <Link href="/videos">
              <div className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                location === '/videos' 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                <Video className="w-4 h-4 mr-2" />
                {translate('all_videos')}
              </div>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center">
          <button onClick={toggleLanguage} className="text-sm text-gray-600 hover:text-primary-600 flex items-center">
            <span className="material-icons text-sm mr-1">translate</span>
            {translate('language_toggle')}
          </button>
          <button className="ml-auto text-sm text-gray-600 hover:text-primary-600 flex items-center">
            <span className="material-icons text-sm mr-1">help_outline</span>
            {translate('help')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
