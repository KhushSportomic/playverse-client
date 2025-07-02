import React from "react";
import { Share, X } from "lucide-react";

const PaymentSuccessModal = ({ isOpen, onClose, paymentDetails, event }) => {
  const shareUrl = window.location.href;
  // console.log(paymentDetails);
  // console.log(event);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booked: ${event.name}`,
          text: `I've booked ${paymentDetails.quantity} slot${
            paymentDetails.quantity > 1 ? "s" : ""
          } for ${event.name} on ${formatDate(event.date)}. Join me!`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!isOpen || !paymentDetails || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Event Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">{event.name}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(event.date)}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {event.slot}
                </p>
                <p>
                  <span className="font-medium">Sport:</span> {event.sportsName}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-black font-bold mb-2">Booking Details</h4>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {paymentDetails.participantName}
                </p>
                <p>
                  <span className="font-medium">Skill Level:</span>{" "}
                  {paymentDetails.participantPhone}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {paymentDetails.skillLevel}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {paymentDetails.quantity || 1} slot
                  {paymentDetails.quantity > 1 ? "s" : ""}
                </p>
                <p>
                  <span className="font-medium">Amount Paid:</span> INR{" "}
                  {event.price * paymentDetails.quantity}.00
                </p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Share className="w-4 h-4" />
              Share Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
