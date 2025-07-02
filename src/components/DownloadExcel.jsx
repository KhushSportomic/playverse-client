import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contant";
import { useAdmin } from "../contexts/AdminContext.jsx";
import EventsReports from "./EventReports.jsx";

const DownloadExcel = () => {
  const { isAdmin } = useAdmin();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${apiUrl}/events/today/by-venue`, {
        headers: {
          "x-admin-token": token,
        },
      });
      setEventData(response.data.venues);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError("Failed to load event data");
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${apiUrl}/events/excel`, {
        responseType: "blob",
        headers: {
          "x-admin-token": token,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "events.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            isAdmin
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          type="button"
          onClick={downloadExcel}
          disabled={!isAdmin}
        >
          Download Excel
        </button>
      </div>

      <div className="mb-8">
        <EventsReports />
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Today's Event Statistics
        </h2>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Venue
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Event ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Event Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Sport
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                Participants
              </th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((venue, venueIndex) =>
              venue.events.map((event, eventIndex) => (
                <tr
                  key={`${venueIndex}-${eventIndex}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {eventIndex === 0 && (
                    <td
                      className="py-3 px-4 text-sm text-gray-600 border-b align-top"
                      rowSpan={venue.events.length}
                    >
                      {venue.venue} ({venue.totalEvents})
                    </td>
                  )}
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event._id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b capitalize">
                    {event.sport}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.time}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-b">
                    {event.currentParticipants}/{event.participantsLimit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadExcel;
