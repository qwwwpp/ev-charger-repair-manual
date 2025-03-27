import { useState } from "react";
import { Link } from "wouter";
import { useAppContext } from "@/lib/context";
import { ErrorCode } from "@/lib/types";
import RepairSteps from "./RepairSteps";

interface ErrorCardProps {
  error: ErrorCode;
  isExpanded?: boolean;
}

const ErrorCard = ({ error, isExpanded = false }: ErrorCardProps) => {
  const { translate, language } = useAppContext();
  const [expanded, setExpanded] = useState(isExpanded);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case '常规停止':
        return 'bg-success-500';
      case '设备异常':
        return 'bg-warning-500';
      case '车辆异常':
        return 'bg-error-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case '常规停止':
        return 'check_circle';
      case '设备异常':
        return 'warning';
      case '车辆异常':
        return 'error_outline';
      default:
        return 'info';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case '常规停止':
        return 'bg-success-50 text-success-700';
      case '设备异常':
        return 'bg-warning-50 text-warning-700';
      case '车辆异常':
        return 'bg-error-50 text-error-600';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div 
        className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-start">
            <div className="mr-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getIconBgColor(error.errorType)}`}>
                <span className="material-icons">{getErrorTypeIcon(error.errorType)}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="font-mono">{error.code}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getErrorTypeColor(error.errorType)} text-white`}>
                  {language === 'en' 
                    ? (error.errorType === '常规停止' 
                      ? 'Normal Stop' 
                      : error.errorType === '设备异常' 
                        ? 'Device Error' 
                        : 'Vehicle Error') 
                    : error.errorType}
                </span>
              </h3>
              <p className="text-gray-700">{error.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 md:mt-0 flex items-center">
          <span className="text-sm text-gray-500 mr-3">
            {translate('cause')}: {error.cause || '-'}
          </span>
          <span className={`material-icons text-gray-400 ${expanded ? 'transform rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-gray-50">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{translate('error_details')}</h4>
            <div className="bg-white p-3 rounded border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">{translate('error_code')}</p>
                <p className="font-medium font-mono">{error.code}</p>
              </div>
              <div>
                <p className="text-gray-500">{translate('error_type')}</p>
                <p className="font-medium">
                  {language === 'en' 
                    ? (error.errorType === '常规停止' 
                      ? 'Normal Stop' 
                      : error.errorType === '设备异常' 
                        ? 'Device Error' 
                        : 'Vehicle Error') 
                    : error.errorType}
                </p>
              </div>
              <div>
                <p className="text-gray-500">{translate('description')}</p>
                <p className="font-medium">{error.description}</p>
              </div>
              <div>
                <p className="text-gray-500">{translate('cause')}</p>
                <p className="font-medium">{error.cause || '-'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{translate('repair_steps')}</h4>
            {error.steps && error.steps.length > 0 ? (
              <RepairSteps steps={error.steps} />
            ) : (
              <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-sm">
                No repair steps available for this error code.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorCard;
