import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PaymentSuccessModal from "./PaymentSuccessModal";
import { apiUrl } from "../contant";
import { Calendar, MapPin, Clock, Info, Trophy } from "lucide-react";

const EventDetails = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [txnId, setTxnId] = useState(null); // Use txnId instead of orderId for PayU

  // Check for PayU redirect status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    if (paymentStatus === "success") {
      console.log("PayU success redirect detected");
      // Remove the processing state since webhook will handle the confirmation
      setIsProcessingPayment(false);
    } else if (paymentStatus === "failure") {
      console.log("PayU failure redirect detected");
      alert("Payment failed. Please try again.");
      setIsProcessingPayment(false);
      setTxnId(null);
    }
  }, []);

  // Remove the polling effect since we'll rely on webhooks
  useEffect(() => {
    // Check if payment is being processed and we have participants data
    if (isProcessingPayment && participants.length > 0 && name) {
      const participant = participants.find(
        (p) => p.paymentStatus === "success" && p.name === name
      );

      if (participant) {
        console.log("Payment confirmed via webhook:", participant);
        setPaymentDetails({
          participantName: name,
          participantPhone: phone,
          skillLevel,
          paymentId: participant.paymentId,
          quantity,
        });
        setShowSuccessModal(true);
        setIsProcessingPayment(false);
      }
    }
  }, [participants, name, phone, skillLevel, quantity, isProcessingPayment]);

  // Fetch event details
  useEffect(() => {
    if (!slug) return;
    const fetchEventDetails = async () => {
      console.log(`Fetching event details for slug: ${slug}`);
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/events/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        console.log("Event details fetched successfully:", data);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [slug]);

  // Fetch participants
  const fetchParticipants = async () => {
    if (!event?._id) return;
    try {
      const response = await fetch(
        `${apiUrl}/events/${event._id}/successful-payments`
      );
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();
      setParticipants(data.successfulPayments);
    } catch (error) {
      console.error("Error fetching participants:", error.message);
      // Don't set a generic error for this, as it might just be a 404
    }
  };

  useEffect(() => {
    if (event?._id) fetchParticipants();
  }, [event]);

  // Poll for successful payments
  useEffect(() => {
    let interval;
    if (txnId && isProcessingPayment) {
      console.log(`Starting polling for txnId: ${txnId}`);
      interval = setInterval(async () => {
        await fetchParticipants();
        const participant = participants.find(
          (p) =>
            p.paymentStatus === "success" &&
            p.name === name &&
            p.orderId === txnId // Check PayU txnid (stored as orderId)
        );
        if (participant) {
          console.log("Payment confirmed via polling:", participant);
          setPaymentDetails({
            participantName: name,
            participantPhone: phone,
            skillLevel,
            paymentId: participant.paymentId, // PayU mihpayid
            quantity,
          });
          setShowSuccessModal(true);
          setIsProcessingPayment(false);
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => {
      if (interval) {
        console.log("Stopping polling");
        clearInterval(interval);
      }
    };
  }, [
    txnId,
    isProcessingPayment,
    participants,
    name,
    phone,
    skillLevel,
    quantity,
    event,
  ]);

  const totalAmount = event ? event.price * quantity : 0;

  const handlePayment = async () => {
    console.log("Initiating PayU payment process...");
    if (!/^\d{10}$/.test(phone)) {
      console.warn("Invalid phone number entered:", phone);
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!phone || !name || !skillLevel) {
      console.warn(
        "Missing required fields - Name:",
        name,
        "Phone:",
        phone,
        "Skill:",
        skillLevel
      );
      alert("Please fill in all required fields");
      return;
    }

    setIsProcessingPayment(true);

    try {
      console.log("Sending booking request to server...");
      const response = await fetch(`${apiUrl}/events/${event._id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          skillLevel,
          quantity,
          clientUrl: window.location.origin, // added
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Booking failed with error:", errorData);
        throw new Error(errorData.error || "Booking failed");
      }

      const paymentData = await response.json();
      console.log("PayU payment data received:", paymentData);

      // Store PayU txnid for polling
      setTxnId(paymentData.txnid);

      // Create PayU payment form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.payuUrl;

      // Add PayU required fields
      const payuParams = {
        key: paymentData.key,
        txnid: paymentData.txnid,
        amount: paymentData.amount,
        productinfo: paymentData.productinfo,
        firstname: paymentData.firstname,
        email: paymentData.email,
        phone: paymentData.phone,
        surl: paymentData.surl,
        furl: paymentData.furl,
        hash: paymentData.hash,
        udf1: paymentData.udf1, // skillLevel
        udf2: paymentData.udf2, // quantity
        udf3: paymentData.udf3, // eventId
      };

      Object.keys(payuParams).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payuParams[key];
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      console.log("Submitting PayU form with data:", payuParams);
    } catch (error) {
      console.error("PayU payment initialization error:", error.message);
      alert(`Payment initialization failed: ${error.message}`);
      setIsProcessingPayment(false);
      setTxnId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!event) return null;

  const capitalizeText = (text) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const isBookButtonDisabled =
    event.currentParticipants >= event.participantsLimit || isProcessingPayment;

  return (
    <div className="min-h-screen bg-gray-50 mt-20 relative">
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-800 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">
              Processing payment...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {event.venueImage && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative">
              <img
                src={event.venueImage}
                alt="Venue"
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {event.venueName}
                </h1>
              </div>
              <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm sm:text-base md:text-lg">
                {event.slotsLeft} slots left
              </div>
            </div>
            <h2 className="text-sm text-black-500 mb-4">
              {capitalizeText(event.name)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Sport */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sport</p>
                  <p className="font-semibold text-gray-900">
                    {capitalizeText(event.sportsName)}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString("en-GB")} (
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                    })}
                    )
                  </p>
                </div>
              </div>

              {/* Slot */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot</p>
                  <p className="font-semibold text-gray-900">{event.slot}</p>
                </div>
              </div>

              {/* Location (NEW) */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <a
                    href={
                      event.mapUrl
                        ? event.mapUrl
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            event.venueName + ", " + event.location
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline hover:text-blue-900"
                  >
                    {event.venueName}
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Important Instructions
                </h2>
              </div>
              <ul className="space-y-3">
                {event.description.split("\n").map((instruction, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="ml-2 mr-3 text-black-500">•</span>
                    <span>{instruction.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                    disabled={isProcessingPayment}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                    disabled={isProcessingPayment}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                    disabled={isProcessingPayment}
                  >
                    <option value="">Select your skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate/advanced">
                      Intermediate/Advanced
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Select Slots (Max {event.slotsLeft} available)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1 || isProcessingPayment}
                      className="h-10 w-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="h-10 w-16 text-center border border-gray-300 rounded-lg flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(q + 1, event.slotsLeft))
                      }
                      disabled={
                        quantity >= event.slotsLeft || isProcessingPayment
                      }
                      className="h-10 w-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <span className="text-sm text-gray-600">TOTAL</span>
                <div className="text-2xl font-bold text-gray-900">
                  INR {totalAmount}
                </div>
              </div>
              <button
                onClick={handlePayment}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium ${
                  isBookButtonDisabled
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                disabled={isBookButtonDisabled}
              >
                {isProcessingPayment
                  ? "Processing..."
                  : `Book ${quantity} Slot${
                      quantity > 1 ? "s" : ""
                    } · ₹${totalAmount}`}
              </button>
            </div>
          </div>
        </div>
        {participants.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Participants
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Name
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Skill Level
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600">
                        Slots Booked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map((participant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-teal-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 2a4 4 0 110 8 4 4 0 010-8zm0 14c-3.313 0-6 2.687-6 6h12c0-3.313-2.687-6-6-6z"
                            />
                          </svg>
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {participant.name}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 capitalize">
                          {participant.skillLevel}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                          {participant.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        paymentDetails={paymentDetails}
        event={event}
      />
    </div>
  );
};

export default EventDetails;
