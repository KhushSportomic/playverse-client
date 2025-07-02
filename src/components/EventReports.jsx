import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contant";

const EventsReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${apiUrl}/events/today/report`);
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to fetch report");
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

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

  if (!report) {
    return (
      <div className="text-gray-500 text-center p-4 bg-gray-100 rounded-lg">
        No report available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Events Report - {report.date}
      </h2>

      <div className="report-summary space-y-6">
        <p className="text-lg font-medium text-gray-700">
          Total Venues Checked: {report.totalVenuesChecked}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Venues with Events
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                      Venue Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                      Total Events
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.venuesWithEvents.map((venue) => (
                    <tr
                      key={venue.venueName}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600 border-b">
                        {venue.venueName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 border-b">
                        {venue.totalEvents}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Venues with No Events
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-red-50">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                      Venue Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.venuesWithNoEvents.map((venue) => (
                    <tr
                      key={venue}
                      className="hover:bg-red-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-red-600 border-b">
                        {venue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsReports;
