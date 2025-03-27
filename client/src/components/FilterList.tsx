import { useAppContext } from "@/lib/context";
import { ErrorFilter } from "@/lib/types";

interface FilterListProps {
  filters: ErrorFilter[];
  onFilterChange: (type: string) => void;
}

const FilterList = ({ filters, onFilterChange }: FilterListProps) => {
  const { translate, selectedErrorType } = useAppContext();

  const getIconByType = (type: string) => {
    switch (type) {
      case 'all':
        return 'check_circle_outline';
      case '常规停止':
        return 'info_outline';
      case '设备异常':
        return 'warning_amber';
      case '车辆异常':
        return 'error_outline';
      default:
        return 'label';
    }
  };

  const getTranslation = (type: string) => {
    switch (type) {
      case 'all':
        return translate('all_errors');
      case '常规停止':
        return translate('normal_stop');
      case '设备异常':
        return translate('device_error');
      case '车辆异常':
        return translate('vehicle_error');
      default:
        return type;
    }
  };

  return (
    <ul className="space-y-1">
      {filters.map((filter) => (
        <li key={filter.type}>
          <button 
            onClick={() => onFilterChange(filter.type)}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
              selectedErrorType === filter.type 
                ? 'bg-primary-50 text-primary-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="material-icons text-sm mr-2">{getIconByType(filter.type)}</span>
            {getTranslation(filter.type)}
            <span className={`ml-auto ${
              selectedErrorType === filter.type 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600'
            } text-xs rounded-full px-2 py-0.5`}>
              {filter.count}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FilterList;
