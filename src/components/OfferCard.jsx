// src/components/OfferCard.jsx
export default function OfferCard({ offer, onDecline, onAccept }) {
    return (
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-50 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>

                {/* Content wrapper */}
                <div className="relative z-10">
                    {/* Savings Badge */}
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm sm:text-base font-bold px-6 py-3 rounded-xl text-center mb-8 shadow-lg transform hover:scale-105 transition-transform">
                        {offer.savingsText}
                    </div>

                    {/* Offer Content */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                        {/* Icon/Logo */}
                        <div className="relative">
                            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-xl sm:text-2xl">🏷️</span>
                                </div>
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-25 -z-10"></div>
                        </div>

                        {/* Offer Text */}
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                                {offer.title}
                            </h3>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                {offer.description}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onDecline}
                            className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 text-base sm:text-lg"
                        >
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-base sm:text-lg"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}