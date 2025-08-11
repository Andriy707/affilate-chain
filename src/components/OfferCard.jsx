// src/components/OfferCard.jsx
export default function OfferCard({ offer, onDecline, onAccept }) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            {/* Savings Badge */}
            <div className="bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded-md text-center mb-6">
                {offer.savingsText}
            </div>

            {/* Offer Content */}
            <div className="flex items-start gap-4 mb-6">
                {/* Icon/Logo */}
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">🏷️</span>
                    </div>
                </div>

                {/* Offer Text */}
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        {offer.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {offer.description}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onDecline}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                    Decline
                </button>
                <button
                    onClick={onAccept}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}