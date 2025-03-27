import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import ErrorCard from "@/components/ErrorCard";
import { useAppContext } from "@/lib/context";
import { ErrorCode, ErrorTypeStats } from "@/lib/types";

const ErrorDetail = () => {
  const [, params] = useRoute("/error/:code");
  const errorCode = params?.code;

  const { translate } = useAppContext();
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch all errors for the stats
  const { data: allErrors = [] } = useQuery<ErrorCode[]>({
    queryKey: ['/api/errors'],
  });

  // Fetch the specific error
  const { data: error, isLoading } = useQuery<ErrorCode>({
    queryKey: [`/api/errors/${errorCode}`],
    enabled: !!errorCode,
  });

  // Calculate error type statistics
  const errorStats: ErrorTypeStats = {
    '常规停止': allErrors.filter(e => e.errorType === '常规停止').length,
    '设备异常': allErrors.filter(e => e.errorType === '设备异常').length,
    '车辆异常': allErrors.filter(e => e.errorType === '车辆异常').length,
    total: allErrors.length
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
        
        <section className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full pb-20 md:pb-6">
          <div className="mb-4">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800">
                <span className="material-icons text-sm mr-1">arrow_back</span>
                {translate('all_errors')}
              </Link>
            </div>
            <h1 className="text-xl font-bold mt-2">
              {translate('error_code')}: {errorCode}
            </h1>
          </div>
          
          {isLoading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <ErrorCard error={error} isExpanded={true} />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <span className="material-icons text-gray-400" style={{ fontSize: '28px' }}>error_outline</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{translate('no_results')}</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Error code not found.
              </p>
              <Link href="/" className="mt-4 inline-flex items-center px-4 py-2 border border-primary-500 text-primary-600 bg-white rounded-md hover:bg-primary-50 text-sm font-medium">
                {translate('view_all')}
              </Link>
            </div>
          )}
        </section>
        
        <MobileNav />
      </main>
    </>
  );
};

export default ErrorDetail;
