import React from "react";
import AddEvent from "./AddEvent";
import EventListAdmin from "../components/EventListAdmin";

const AdminDashboard = () => {
  return (
    <div>
      <h2
        className="
    mt-40
    my-20 
    text-center 
    text-gray-700 
    text-3xl 
    hover:text-teal-700 
    hover:scale-110 
    hover:shadow-md 
    transition duration-300 ease-in-out
  "
      >
        Welcome to Admin Dashboard
      </h2>

      {/* <AddEvent /> */}
      <EventListAdmin />
    </div>
  );
};

export default AdminDashboard;
