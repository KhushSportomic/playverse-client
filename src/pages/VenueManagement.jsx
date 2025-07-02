import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sportOptions = [
  "Cricket", "Pickle Ball", "Badminton", "Foot Ball", "Tennis", "Paint Ball", "Shooting",
  "Pool Table", "Snooker", "Table Tennis", "Archery", "Volley Ball", "Basket Ball", "Yoga",
  "Zumba", "Taekwondo", "Gym", "Boxing", "Throw Ball", "Squash", "Skating", "Running",
  "Rugby", "Swimming", "Kabaddi", "Hiking", "Golf", "Gokarting", "Frisbee", "FoosBall",
  "Cycling", "Chess", "Carrom", "Bowling", "BaseBall", "Horse Riding", "Hockey", "Marathon"
];

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    imageUrl: "",
    description: "",
    sport: "",
    generalInstructions: "",
    amenities: [],
    mapUrl: ""
  });

  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${apiUrl}/venues`);
      if (response.data.success) {
        setVenues(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSportChange = (e) => {
    setFormData({ ...formData, sport: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const venueData = {
        ...formData
      };
      let response;
      if (editingVenue) {
        response = await axios.put(`${apiUrl}/venues/${editingVenue._id}`, venueData, {
          headers: { "x-admin-token": token }
        });
        toast.success("Venue updated successfully!");
      } else {
        response = await axios.post(`${apiUrl}/venues`, venueData, {
          headers: { "x-admin-token": token }
        });
        toast.success("Venue created successfully!");
      }
      if (response.data.success) {
        resetForm();
        fetchVenues();
        setShowForm(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      imageUrl: venue.imageUrl,
      description: venue.description,
      sport: venue.sport || "",
      generalInstructions: venue.generalInstructions,
      amenities: venue.amenities || [],
      mapUrl: venue.mapUrl || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(`${apiUrl}/venues/${venueId}`, {
        headers: { "x-admin-token": token }
      });
      if (response.data.success) {
        toast.success("Venue deleted successfully!");
        fetchVenues();
      }
    } catch (error) {
      toast.error("Failed to delete venue");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      imageUrl: "",
      description: "",
      sport: "",
      generalInstructions: "",
      amenities: [],
      mapUrl: ""
    });
    setEditingVenue(null);
    setNewAmenity("");
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (index) => {
    const updatedAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 mt-20">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Venue Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Add New Venue
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {editingVenue ? "Edit Venue" : "Add New Venue"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sports *
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleSportChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a Sport</option>
                  {sportOptions.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Instructions (for auto-fill)
                </label>
                <textarea
                  name="generalInstructions"
                  value={formData.generalInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Default general instructions for events at this venue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleInputChange}
                  placeholder="Paste Google Maps link here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : (editingVenue ? "Update Venue" : "Create Venue")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Existing Venues ({venues.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform">
              <img
                src={venue.imageUrl || 'https://placehold.co/400x200'}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{venue.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Location: {venue.location}</p>
                {venue.description && (
                    <p className="text-sm text-gray-600 mt-1">{venue.description}</p>
                )}
                {venue.sport && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Sport: {venue.sport}</p>
                  </div>
                )}
                {venue.generalInstructions && (
                    <p className="text-sm text-gray-600 mt-1">Instructions: {venue.generalInstructions}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(venue)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(venue._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueManagement;