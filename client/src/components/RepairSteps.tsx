import { useAppContext } from "@/lib/context";
import { RepairStep } from "@/lib/types";

interface RepairStepsProps {
  steps: RepairStep[];
}

const RepairSteps = ({ steps }: RepairStepsProps) => {
  const { translate } = useAppContext();
  
  // Sort steps by step number
  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="space-y-3">
      {sortedSteps.map((step) => (
        <div key={step.id} className="bg-white p-3 rounded border border-gray-200">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 mr-3 flex-shrink-0 mt-0.5">
              {step.stepNumber}
            </div>
            <div>
              <h5 className="font-medium text-gray-900">{step.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              
              {step.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                  <p className="font-medium text-gray-700">注意事项：</p>
                  <p className="text-gray-600">{step.notes}</p>
                </div>
              )}
              
              {step.stepNumber === sortedSteps.length && (
                <div className="mt-3 flex items-center">
                  <button className="inline-flex items-center px-3 py-1.5 border border-primary-500 text-primary-600 rounded-md hover:bg-primary-50 text-sm font-medium">
                    <span className="material-icons text-sm mr-1">download</span>
                    {translate('download_guide')}
                  </button>
                  <button className="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                    <span className="material-icons text-sm mr-1">help_outline</span>
                    {translate('view_tutorial')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepairSteps;
