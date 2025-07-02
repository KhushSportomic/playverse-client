import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../contant";

const RefundEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundStatus, setRefundStatus] = useState({});

  // Get admin token from localStorage
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${apiUrl}/events/refunds/events-with-payments`,
          {
            headers: { "x-admin-token": token },
          }
        );
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events with payments");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const handleRefund = async (eventId, participantId) => {
    if (!window.confirm("Are you sure you want to refund this payment?"))
      return;
    try {
      setRefundStatus((prev) => ({ ...prev, [participantId]: "processing" }));
      const res = await axios.post(
        `${apiUrl}/events/${eventId}/refund/${participantId}`,
        {},
        {
          headers: { "x-admin-token": token },
        }
      );
      setRefundStatus((prev) => ({ ...prev, [participantId]: "success" }));
      alert("Refund processed successfully!");
    } catch (err) {
      setRefundStatus((prev) => ({ ...prev, [participantId]: "error" }));
      alert("Refund failed. Please try again.");
    }
  };

  if (loading)
    return <div className="mt-40 text-center">Loading events...</div>;
  if (error)
    return <div className="mt-40 text-center text-red-500">{error}</div>;
  if (events.length === 0)
    return (
      <div className="mt-40 text-center">No events with payments found.</div>
    );

  return (
    <div className="container mx-auto mt-40 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Events with Payments (Refund Section)
      </h2>
      {events.map((event) => (
        <div
          key={event.eventId}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
          <ul>
            {event.participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span>
                  <span className="font-medium">{p.name}</span> (Payment ID:{" "}
                  {p.paymentId}, Amount: ₹{p.amount})
                </span>
                <button
                  className={`px-4 py-2 rounded text-white ${
                    refundStatus[p.id] === "success"
                      ? "bg-green-500"
                      : refundStatus[p.id] === "processing"
                      ? "bg-yellow-500"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  disabled={
                    refundStatus[p.id] === "processing" ||
                    refundStatus[p.id] === "success"
                  }
                  onClick={() => handleRefund(event.eventId, p.id)}
                >
                  {refundStatus[p.id] === "success"
                    ? "Refunded"
                    : refundStatus[p.id] === "processing"
                    ? "Processing..."
                    : "Refund"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RefundEvents;
