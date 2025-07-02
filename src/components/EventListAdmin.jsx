import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import axios from "axios";
import { apiUrl } from "../contant";
// Search Box Component
const EventSearchBox = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative w-full mb-4">
      <input
        type="text"
        placeholder="Search Event By ID or Name"
        className="w-full py-3 pl-5 pr-12 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleSearch}
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onClick={handleSearch}
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

const EventSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 md:p-6 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-lg flex-shrink-0 md:mr-4"></div>
      <div className="flex-grow space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex flex-wrap gap-x-4 mt-1">
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center md:justify-end mt-4 md:mt-0">
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
        <div className="px-3 py-1 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

const EventListAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [availableSports, setAvailableSports] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents(selectedSport);
  }, [selectedSport]);

  // Apply search filter when events or search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.name?.toLowerCase().includes(query) ||
          event._id?.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    }
  }, [events, searchQuery]);

  const fetchEvents = async (sport) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/events?sport=${sport}`);
      // console.log("API Response:", response.data);

      const { events, availableSports } = response.data;

      setEvents(events || []);
      setFilteredEvents(events || []);
      setAvailableSports([
        "all",
        ...(Array.isArray(availableSports) ? availableSports : []),
      ]);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${apiUrl}/events/${eventId}`);
      // console.log("Delete Response:", response.data);

      if (response.status === 200 || response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } else {
        throw new Error("Deletion failed on the server");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Please try again.");
      fetchEvents(selectedSport);
    }
  };

  const handleEditSubmit = async (updatedEvent) => {
    try {
      const { _id, __v, ...eventToSubmit } = updatedEvent;
      const response = await axios.put(
        `${apiUrl}/events/${_id}`,
        eventToSubmit
      );
      // console.log("Edit Response:", response.data);

      if (response.status === 200 || response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === _id ? { ...event, ...eventToSubmit } : event
          )
        );
        setEditingEvent(null);
      } else {
        throw new Error("Edit failed on the server");
      }
    } catch (error) {
      console.error("Error editing event:", error);
      alert("Failed to edit the event. Please try again.");
      fetchEvents(selectedSport);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse md:p-6">
        <EventSkeleton />
        <EventSkeleton />
        <EventSkeleton />
      </div>
    );
  }

  return (
    <div>
      {/* Search Box */}
      <EventSearchBox onSearch={handleSearch} />

      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border rounded"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          {availableSports.map((sport) => (
            <option key={sport} value={sport}>
              {sport.charAt(0).toUpperCase() + sport.slice(1)}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">
          {events.length === 0
            ? "No events available for this sport."
            : "No events match your search."}
        </p>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            handleDelete={handleDelete}
            setEditingEvent={setEditingEvent}
          />
        ))
      )}

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleEditSubmit}
        />
      )}
    </div>
  );
};

// Edit Modal Component remains the same

const EditModal = ({ event, onClose, onSave }) => {
  // Your existing EditModal implementation
  const [editedEvent, setEditedEvent] = useState({ ...event });
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    phone: "",
    skillLevel: "",
    paymentStatus: "success",
    bookingDate: new Date().toISOString(),
    quantity: 1,
    amount: editedEvent.price || 0,
  });
  const [editingParticipantIndex, setEditingParticipantIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Modified calculation to only count successful participants
  const calculateSuccessfulParticipants = (participants) =>
    participants.reduce(
      (sum, p) =>
        p.paymentStatus === "success" ? sum + (p.quantity || 0) : sum,
      0
    );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const addParticipant = () => {
    if (
      !newParticipant.name ||
      !newParticipant.phone ||
      !newParticipant.skillLevel ||
      !newParticipant.quantity
    ) {
      alert("Please fill in all participant details.");
      return;
    }

    // Only check for participant limit if the new participant has "success" payment status
    if (newParticipant.paymentStatus === "success") {
      const successfulParticipants = calculateSuccessfulParticipants([
        ...editedEvent.participants,
        newParticipant,
      ]);

      if (successfulParticipants > editedEvent.participantsLimit) {
        alert(
          "Adding this participant exceeds the participant limit for successful payments."
        );
        return;
      }
    }

    // Add the participant regardless of payment status
    const updatedParticipants = [...editedEvent.participants, newParticipant];
    const successfulParticipants =
      calculateSuccessfulParticipants(updatedParticipants);

    setEditedEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipants: successfulParticipants,
      slotsLeft: prev.participantsLimit - successfulParticipants,
    }));

    setNewParticipant({
      name: "",
      phone: "",
      skillLevel: "",
      paymentStatus: "success",
      bookingDate: new Date().toISOString(),
      quantity: 1,
      amount: editedEvent.price || 0,
    });
  };

  const deleteParticipant = (index) => {
    const updatedParticipants = editedEvent.participants.filter(
      (_, i) => i !== index
    );
    const successfulParticipants =
      calculateSuccessfulParticipants(updatedParticipants);

    setEditedEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipants: successfulParticipants,
      slotsLeft: prev.participantsLimit - successfulParticipants,
    }));
  };

  const editParticipant = (index) => {
    setEditingParticipantIndex(index);
    setNewParticipant({ ...editedEvent.participants[index] });
  };

  const saveParticipantEdit = () => {
    if (
      !newParticipant.name ||
      !newParticipant.phone ||
      !newParticipant.skillLevel ||
      !newParticipant.quantity
    ) {
      alert("Please fill in all participant details.");
      return;
    }

    const updatedParticipants = editedEvent.participants.map((p, i) =>
      i === editingParticipantIndex ? newParticipant : p
    );

    // Only check for participant limit if the edited participant has "success" payment status
    if (newParticipant.paymentStatus === "success") {
      const successfulParticipants =
        calculateSuccessfulParticipants(updatedParticipants);

      if (successfulParticipants > editedEvent.participantsLimit) {
        alert(
          "Editing this participant exceeds the participant limit for successful payments."
        );
        return;
      }
    }

    const successfulParticipants =
      calculateSuccessfulParticipants(updatedParticipants);

    setEditedEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
      currentParticipants: successfulParticipants,
      slotsLeft: prev.participantsLimit - successfulParticipants,
    }));

    setEditingParticipantIndex(null);
    setNewParticipant({
      name: "",
      phone: "",
      skillLevel: "",
      paymentStatus: "success",
      bookingDate: new Date().toISOString(),
      quantity: 1,
      amount: editedEvent.price || 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedEvent);
  };

  // Add payment status selection to the participant form
  const handlePaymentStatusChange = (e) => {
    setNewParticipant((prev) => ({
      ...prev,
      paymentStatus: e.target.value,
    }));
  };

  // Payment status badge styles
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          <h3 className="text-xl font-bold">Edit Event</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "details"
                ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Event Details
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "participants"
                ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
            <span className="ml-2 px-2 py-0.5 text-xs bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 rounded-full">
              {editedEvent.participants.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow p-6">
          <form onSubmit={handleSubmit}>
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="name"
                  >
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedEvent.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Event Name"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="description"
                  >
                    General Instructions
                  </label>
                  <textarea
                    name="description"
                    value={editedEvent.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Provide detailed instructions for participants"
                    rows="4"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={
                      new Date(editedEvent.date).toISOString().split("T")[0]
                    }
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="slot"
                  >
                    Time Slot
                  </label>
                  <input
                    type="text"
                    name="slot"
                    value={editedEvent.slot}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. 9:00 AM - 11:00 AM"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="participantsLimit"
                  >
                    Participants Limit
                  </label>
                  <input
                    type="number"
                    name="participantsLimit"
                    value={editedEvent.participantsLimit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Maximum number of participants"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="price"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">
                        ₹
                      </span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={editedEvent.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="sportsName"
                  >
                    Sport Name
                  </label>
                  <input
                    type="text"
                    name="sportsName"
                    value={editedEvent.sportsName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. Basketball, Tennis, etc."
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="venueName"
                  >
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={editedEvent.venueName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. Central Park Court"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="venueImage"
                  >
                    Venue Image URL
                  </label>
                  <input
                    type="text"
                    name="venueImage"
                    value={editedEvent.venueImage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editedEvent.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Full address"
                  />
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div>
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Participant Stats
                    </h4>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="text-teal-700 dark:text-teal-300">
                        <span className="text-xl font-bold">
                          {editedEvent.currentParticipants}
                        </span>
                        <span className="text-xs ml-1">Confirmed</span>
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        <span className="text-xl font-bold">
                          {editedEvent.slotsLeft}
                        </span>
                        <span className="text-xs ml-1">Slots Left</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        <span className="text-xl font-bold">
                          {editedEvent.participants.length}
                        </span>
                        <span className="text-xs ml-1">Total Entries</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Note: Only successful payments count toward participant
                      limit
                    </div>
                  </div>
                </div>

                {/* Participant List */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Participant List
                  </h4>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {editedEvent.participants.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No participants added yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {editedEvent.participants.map((participant, index) => (
                          <div
                            key={index}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {participant.name}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                                    participant.paymentStatus
                                  )}`}
                                >
                                  {participant.paymentStatus}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4">
                                <span>📱 {participant.phone}</span>
                                <span>🏆 {participant.skillLevel}</span>
                                <span>👥 Qty: {participant.quantity}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => editParticipant(index)}
                                className="px-3 py-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-md text-sm font-medium transition-colors dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-800/50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteParticipant(index)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add/Edit Participant Form */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    {editingParticipantIndex !== null
                      ? "Edit Participant"
                      : "Add New Participant"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newParticipant.name}
                        onChange={handleParticipantChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="phone"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={newParticipant.phone}
                        onChange={handleParticipantChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="skillLevel"
                      >
                        Skill Level
                      </label>
                      <select
                        name="skillLevel"
                        value={newParticipant.skillLevel}
                        onChange={handleParticipantChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate/advanced">
                          Intermediate/Advanced
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="quantity"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={newParticipant.quantity}
                        onChange={handleParticipantChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Quantity"
                        min="1"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="paymentStatus"
                      >
                        Payment Status
                      </label>
                      <select
                        name="paymentStatus"
                        value={newParticipant.paymentStatus}
                        onChange={handlePaymentStatusChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                        htmlFor="amount"
                      >
                        Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400">
                            ₹
                          </span>
                        </div>
                        <input
                          type="number"
                          name="amount"
                          value={newParticipant.amount}
                          onChange={handleParticipantChange}
                          className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {editingParticipantIndex !== null ? (
                      <button
                        type="button"
                        onClick={saveParticipantEdit}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Add Participant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventListAdmin;
