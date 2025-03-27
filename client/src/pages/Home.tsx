import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import SearchBar from "@/components/SearchBar";
import ErrorCard from "@/components/ErrorCard";
import MobileNav from "@/components/MobileNav";
import { useAppContext } from "@/lib/context";
import { ErrorCode, ErrorTypeStats } from "@/lib/types";

const Home = () => {
  const { translate, selectedErrorType, searchQuery } = useAppContext();
  const [showSidebar, setShowSidebar] = useState(false);
  const [filteredErrors, setFilteredErrors] = useState<ErrorCode[]>([]);

  // Fetch error codes from the API
  const { data: errorCodes = [], isLoading } = useQuery<ErrorCode[]>({
    queryKey: ['/api/errors'],
  });

  // Calculate error type statistics
  const errorStats: ErrorTypeStats = {
    '常规停止': errorCodes.filter(e => e.errorType === '常规停止').length,
    '设备异常': errorCodes.filter(e => e.errorType === '设备异常').length,
    '车辆异常': errorCodes.filter(e => e.errorType === '车辆异常').length,
    total: errorCodes.length
  };

  // Filter errors based on search query and selected type
  useEffect(() => {
    if (!errorCodes || errorCodes.length === 0) {
      return;
    }
    
    let filtered = [...errorCodes];
    
    // Filter by type
    if (selectedErrorType !== 'all') {
      filtered = filtered.filter(error => error.errorType === selectedErrorType);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(error => 
        error.code.toLowerCase().includes(lowerQuery) ||
        error.description.toLowerCase().includes(lowerQuery) ||
        (error.cause && error.cause.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredErrors(filtered);
  }, [errorCodes, selectedErrorType, searchQuery]);

  const handleSearch = (query: string) => {
    // This is handled by the context
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Mobile Sidebar (hidden by default) */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <Sidebar errorStats={errorStats} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar errorStats={errorStats} />
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <MobileHeader toggleSidebar={toggleSidebar} />
        
        <SearchBar onSearch={handleSearch} />
        
        <section className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full pb-20 md:pb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{translate('results')}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {translate('results_count').replace('{count}', filteredErrors.length.toString())}
                </span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredErrors.length > 0 ? (
            <div className="space-y-4">
              {filteredErrors.map((error) => (
                <ErrorCard key={error.id} error={error} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="material-icons text-gray-400" style={{ fontSize: '28px' }}>search_off</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{translate('no_results')}</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {translate('try_different')}
              </p>
              <button 
                onClick={() => {
                  // Reset filters and search
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-primary-500 text-primary-600 bg-white rounded-md hover:bg-primary-50 text-sm font-medium"
              >
                {translate('view_all')}
              </button>
            </div>
          )}
        </section>
        
        <MobileNav />
      </main>
    </>
  );
};

export default Home;
