import React, { useState } from "react";
import axios from "axios";
import { apiUrl } from "../contant";

const EventCard = ({ event, handleDelete, setEditingEvent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCount, setConfirmationCount] = useState(
    event.confirmationCount || 0
  );
  const [cancellationCount, setCancellationCount] = useState(
    event.cancellationCount || 0
  );

  const formattedDate = new Date(event.date)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  const handleConfirm = async () => {
    if (!window.confirm("Send confirmation to all participants?")) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/events/${event._id}/send-confirmation`
      );
      console.log("Confirmation Response:", response.data);
      setConfirmationCount(response.data.confirmationCount); // Update local state
      alert("Confirmation messages sent successfully!");
    } catch (error) {
      console.error(
        "Error sending confirmation:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to send confirmation messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Send cancellation to all participants?")) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/events/${event._id}/send-cancellation`
      );
      console.log("Cancellation Response:", response.data);
      setCancellationCount(response.data.cancellationCount); // Update local state
      alert("Cancellation messages sent successfully!");
    } catch (error) {
      console.error(
        "Error sending cancellation:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to send cancellation messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full mx-auto mb-4">
      <img
        src={event.venueImage}
        alt={event.venueName}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-lg flex-shrink-0 mr-4"
      />

      <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center sm:justify-between w-full">
        <div className="sm:w-1/2">
          <h3 className="text-base font-semibold text-gray-900">
            {event.name} ({event._id})
          </h3>
          <h4 className="text-sm font-semibold text-gray-900">
            {event.venueName}
          </h4>
          <p className="text-xs sm:text-sm text-black-700">{event.slot}</p>
          <p className="text-xs sm:text-sm text-black-700">{event.location}</p>
          <p className="text-xs sm:text-sm text-black-700">{formattedDate}</p>
          <p className="text-xs sm:text-sm text-black-700">
            Slots Left: {event.currentParticipants}/{event.participantsLimit}
          </p>
          <p className="text-xs sm:text-sm text-black-700">
            Confirmations Sent: {confirmationCount}
          </p>
          <p className="text-xs sm:text-sm text-black-700">
            Cancellations Sent: {cancellationCount}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:justify-end w-full sm:w-1/2">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-blue-600 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-blue-50"
            }`}
          >
            {isLoading ? "Sending..." : "Confirm"}
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            disabled={isLoading}
            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-red-600 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-red-50"
            }`}
          >
            Delete
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-gray-600 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {isLoading ? "Sending..." : "Cancel"}
          </button>
          <button
            onClick={() => setEditingEvent(event)}
            disabled={isLoading}
            className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm text-teal-600 font-medium ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-teal-50"
            }`}
          >
            EDIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
