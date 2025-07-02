import React from "react";
import { Share2, MapPin, Calendar, Clock } from "lucide-react";

const BookingCard = () => {
  return (
    <div className="max-w-sm w-full mx-auto bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src="/api/placeholder/400/320"
          alt="Badminton Court"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100">
          <Share2 className="w-5 h-5 text-gray-600" />
        </div>
        <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          1 Slot Left!
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Shuttle Empire
        </h2>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600">Thaltej, Ahmadabad</span>
        </div>

        {/* Sport Type */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src="/api/placeholder/20/20"
            alt="Badminton Icon"
            className="w-5 h-5"
          />
          <span className="text-gray-700">Badminton</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Monday, 20 Jan, 2025</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">8:00PM To 11:00 PM</span>
        </div>

        {/* Price and Book Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900">INR 99.00</span>
            <span className="text-gray-600 ml-1">/ PERSON</span>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-300">
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
