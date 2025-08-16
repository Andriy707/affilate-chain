// src/components/ProgressChain.jsx
export default function ProgressChain({ currentStep, totalSteps = 10 }) {
    return (
        <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/50 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile: Enhanced simple indicator */}
                <div className="block sm:hidden text-center">
                    <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                        <p className="text-base font-semibold text-gray-700">
                            Step {currentStep} of {totalSteps}
                        </p>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mt-4">
                        Check out these unique offers
                    </p>
                </div>

                {/* Desktop: Enhanced progress chain */}
                <div className="hidden sm:block">
                    <div className="flex items-center justify-center overflow-x-auto pb-2">
                        {Array.from({ length: Math.min(totalSteps, 10) }, (_, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;

                            return (
                                <div key={stepNumber} className="flex items-center flex-shrink-0">
                                    {/* Step Circle */}
                                    <div className="relative">
                                        <div
                                            className={`
                                                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 transform
                                                ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg scale-110'
                                                : isCompleted
                                                    ? 'bg-green-500 text-white shadow-md'
                                                    : 'bg-white text-gray-400 border-2 border-gray-200 shadow-sm'
                                            }
                                            `}
                                        >
                                            {isCompleted ? '✓' : stepNumber}
                                        </div>

                                        {/* Active glow effect */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-40 -z-10"></div>
                                        )}
                                    </div>

                                    {/* Connector Line */}
                                    {stepNumber < Math.min(totalSteps, 10) && (
                                        <div
                                            className={`
                                                w-8 sm:w-12 h-1 mx-2 rounded-full transition-all duration-300
                                                ${stepNumber < currentStep
                                                ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                : stepNumber === currentStep
                                                    ? 'bg-gradient-to-r from-blue-400 to-gray-200'
                                                    : 'bg-gray-200'
                                            }
                                            `}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        {/* Show dots if more than 10 steps */}
                        {totalSteps > 10 && (
                            <div className="text-gray-400 ml-4 text-lg">•••</div>
                        )}
                    </div>

                    {/* Current Step Text */}
                    <div className="text-center mt-6">
                        <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            Check out these unique offers
                        </p>
                        <p className="text-sm sm:text-base text-gray-500 font-medium">
                            Step {currentStep} of {totalSteps} • Discover amazing savings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}