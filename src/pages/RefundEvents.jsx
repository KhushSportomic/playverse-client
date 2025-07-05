// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { apiUrl } from "../contant";

// const RefundEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refundStatus, setRefundStatus] = useState({});
//   const [selectedParticipants, setSelectedParticipants] = useState({});
//   const [bulkRefundLoading, setBulkRefundLoading] = useState(false);

//   // Get admin token from localStorage
//   const token = localStorage.getItem("adminToken");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${apiUrl}/events/refunds/events-with-payments`,
//           {
//             headers: { "x-admin-token": token },
//           }
//         );
//         setEvents(res.data);
//       } catch (err) {
//         setError("Failed to fetch events with payments");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//     // eslint-disable-next-line
//   }, []);

//   const handleRefund = async (eventId, participantId) => {
//     if (!window.confirm("Are you sure you want to refund this payment?"))
//       return;
//     try {
//       setRefundStatus((prev) => ({ ...prev, [participantId]: "processing" }));
//       const res = await axios.post(
//         `${apiUrl}/events/${eventId}/refund/${participantId}`,
//         {},
//         {
//           headers: { "x-admin-token": token },
//         }
//       );
//       setRefundStatus((prev) => ({ ...prev, [participantId]: "success" }));
//       alert("Refund processed successfully!");
//       // Refresh events to get updated status
//       window.location.reload();
//     } catch (err) {
//       setRefundStatus((prev) => ({ ...prev, [participantId]: "error" }));
//       alert("Refund failed. Please try again.");
//     }
//   };

//   const handleBulkRefund = async (eventId) => {
//     const selectedForEvent = selectedParticipants[eventId] || [];
//     if (selectedForEvent.length === 0) {
//       alert("Please select participants to refund");
//       return;
//     }

//     if (!window.confirm(`Are you sure you want to refund ${selectedForEvent.length} participants?`))
//       return;

//     try {
//       setBulkRefundLoading(true);
//       const res = await axios.post(
//         `${apiUrl}/events/${eventId}/refund`,
//         { participantIndexes: selectedForEvent },
//         {
//           headers: { "x-admin-token": token },
//         }
//       );

//       if (res.data.success) {
//         alert(`Bulk refund completed! ${res.data.successfulRefunds} successful, ${res.data.failedRefunds} failed.`);
//         // Clear selections and refresh
//         setSelectedParticipants({});
//         window.location.reload();
//       } else {
//         alert("Bulk refund failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Bulk refund error:", err);
//       alert("Bulk refund failed. Please try again.");
//     } finally {
//       setBulkRefundLoading(false);
//     }
//   };

//   const handleParticipantSelection = (eventId, participantIndex, checked) => {
//     setSelectedParticipants(prev => ({
//       ...prev,
//       [eventId]: checked 
//         ? [...(prev[eventId] || []), participantIndex]
//         : (prev[eventId] || []).filter(idx => idx !== participantIndex)
//     }));
//   };

//   const isParticipantRefunded = (participant) => {
//     return participant.refunded === true;
//   };

//   const canRefund = (participant) => {
//     return participant.paymentStatus === "success" && !isParticipantRefunded(participant);
//   };

//   if (loading)
//     return <div className="mt-40 text-center">Loading events...</div>;
//   if (error)
//     return <div className="mt-40 text-center text-red-500">{error}</div>;
//   if (events.length === 0)
//     return (
//       <div className="mt-40 text-center">No events with payments found.</div>
//     );

//   return (
//     <div className="container mx-auto mt-40 p-4">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Events with Payments (Refund Section)
//       </h2>
//       {events.map((event) => {
//         const refundableParticipants = event.participants.filter(canRefund);
//         const selectedForEvent = selectedParticipants[event.eventId] || [];
        
//         return (
//           <div
//             key={event.eventId}
//             className="bg-white rounded-lg shadow-md p-6 mb-6"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{event.eventName}</h3>
//               {refundableParticipants.length > 0 && (
//                 <div className="flex gap-2">
//                   <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                     onClick={() => {
//                       const allIndices = event.participants
//                         .map((p, idx) => canRefund(p) ? idx : null)
//                         .filter(idx => idx !== null);
//                       setSelectedParticipants(prev => ({
//                         ...prev,
//                         [event.eventId]: allIndices
//                       }));
//                     }}
//                   >
//                     Select All
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//                     disabled={selectedForEvent.length === 0 || bulkRefundLoading}
//                     onClick={() => handleBulkRefund(event.eventId)}
//                   >
//                     {bulkRefundLoading ? "Processing..." : `Bulk Refund (${selectedForEvent.length})`}
//                   </button>
//                 </div>
//               )}
//             </div>
//             <ul>
//               {event.participants.map((p, idx) => (
//                 <li
//                   key={p.id}
//                   className="flex items-center justify-between border-b py-2"
//                 >
//                   <div className="flex items-center gap-3">
//                     {canRefund(p) && (
//                       <input
//                         type="checkbox"
//                         checked={selectedForEvent.includes(idx)}
//                         onChange={(e) => handleParticipantSelection(event.eventId, idx, e.target.checked)}
//                         className="mr-2"
//                       />
//                     )}
//                     <span>
//                       <span className="font-medium">{p.name}</span> (Payment ID:{" "}
//                       {p.paymentId}, Amount: ₹{p.amount})
//                       {p.refundDate && (
//                         <span className="text-sm text-gray-500 ml-2">
//                           Refunded: {new Date(p.refundDate).toLocaleDateString()}
//                         </span>
//                       )}
//                     </span>
//                   </div>
//                   <button
//                     className={`px-4 py-2 rounded text-white ${
//                       isParticipantRefunded(p)
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : refundStatus[p.id] === "success"
//                         ? "bg-green-500"
//                         : refundStatus[p.id] === "processing"
//                         ? "bg-yellow-500"
//                         : canRefund(p)
//                         ? "bg-teal-600 hover:bg-teal-700"
//                         : "bg-gray-400 cursor-not-allowed"
//                     }`}
//                     disabled={
//                       isParticipantRefunded(p) ||
//                       refundStatus[p.id] === "processing" ||
//                       refundStatus[p.id] === "success" ||
//                       !canRefund(p)
//                     }
//                     onClick={() => handleRefund(event.eventId, p.id)}
//                   >
//                     {isParticipantRefunded(p)
//                       ? "Refunded"
//                       : refundStatus[p.id] === "success"
//                       ? "Refunded"
//                       : refundStatus[p.id] === "processing"
//                       ? "Processing..."
//                       : p.paymentStatus === "success"
//                       ? "Refund"
//                       : "Cannot Refund"}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default RefundEvents;
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
