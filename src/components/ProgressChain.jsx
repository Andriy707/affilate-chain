// src/components/ProgressChain.jsx
export default function ProgressChain({ currentStep, totalSteps = 10 }) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={stepNumber} className="flex items-center">
                            {/* Step Circle */}
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }
                `}
                            >
                                {stepNumber}
                            </div>

                            {/* Connector Line */}
                            {stepNumber < totalSteps && (
                                <div
                                    className={`
                    w-8 h-1 mx-1
                    ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current Step Text */}
            <div className="text-center mt-4">
                <p className="text-lg font-medium text-gray-700">
                    Check out these unique offers
                </p>
                <p className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
        </div>
    );
}