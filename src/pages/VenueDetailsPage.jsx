import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../contant';
import { toast, ToastContainer } from 'react-toastify';

const sportOptions = [
    "Cricket", "Pickle Ball", "Badminton", "Foot Ball", "Tennis", "Paint Ball", "Shooting",
    "Pool Table", "Snooker", "Table Tennis", "Archery", "Volley Ball", "Basket Ball", "Yoga",
    "Zumba", "Taekwondo", "Gym", "Boxing", "Throw Ball", "Squash", "Skating", "Running",
    "Rugby", "Swimming", "Kabaddi", "Hiking", "Golf", "Gokarting", "Frisbee", "FoosBall",
    "Cycling", "Chess", "Carrom", "Bowling", "BaseBall", "Horse Riding", "Hockey", "Marathon"
];

const VenueDetailsPage = () => {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSportForm, setShowSportForm] = useState(false);
    const [newSport, setNewSport] = useState({
        name: '',
        imageUrl: '',
        description: '',
        generalInstructions: '',
    });

    const fetchVenueDetails = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/venues/${venueId}`);
            if (data.success) {
                setVenue(data.data);
            }
        } catch (error) {
            toast.error('Failed to load venue details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenueDetails();
    }, [venueId]);

    const handleSportInputChange = (e) => {
        const { name, value } = e.target;
        setNewSport({ ...newSport, [name]: value });
    };

    const handleAddSport = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.post(
                `${apiUrl}/venues/${venueId}/sports`,
                newSport,
                { headers: { 'x-admin-token': token } }
            );
            if (data.success) {
                setVenue(data.data);
                toast.success('Sport added successfully!');
                setShowSportForm(false);
                setNewSport({ name: '', imageUrl: '', description: '', generalInstructions: '' });
            }
        } catch (error) {
            toast.error('Failed to add sport.');
        }
    };

    const handleRemoveSport = async (sportId) => {
        if (!window.confirm("Are you sure you want to remove this sport?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.delete(
                `${apiUrl}/venues/${venueId}/sports/${sportId}`,
                { headers: { 'x-admin-token': token } }
            );
            if (data.success) {
                setVenue(data.data);
                toast.success('Sport removed successfully!');
            }
        } catch (error) {
            toast.error('Failed to remove sport.');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!venue) return <div className="text-center mt-20">Venue not found.</div>;

    return (
        <div className="container mx-auto px-6 py-8 mt-20">
            <ToastContainer />
            <button onClick={() => navigate('/venues')} className="mb-4 text-teal-600 hover:text-teal-800">
                &larr; Back to Venues
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{venue.name}</h1>
            <p className="text-gray-600 mb-6">{venue.location}</p>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Available Sports</h2>
                <button
                    onClick={() => setShowSportForm(!showSportForm)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                    {showSportForm ? 'Cancel' : 'Add Sport'}
                </button>
            </div>

            {showSportForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleAddSport} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sport Name *</label>
                            <select
                                name="name"
                                value={newSport.name}
                                onChange={handleSportInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a sport</option>
                                {sportOptions.map(sport => (
                                    <option key={sport} value={sport}>{sport}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={newSport.imageUrl}
                                onChange={handleSportInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={newSport.description}
                                onChange={handleSportInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">General Instructions</label>
                            <textarea
                                name="generalInstructions"
                                value={newSport.generalInstructions}
                                onChange={handleSportInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md">
                            Save Sport
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venue.sports.map(sport => (
                    <div key={sport._id} className="border border-gray-200 rounded-lg p-4">
                        <img src={sport.imageUrl} alt={sport.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800">{sport.name}</h3>
                        {sport.description && <p className="text-gray-600 text-sm my-2">{sport.description}</p>}
                        {sport.generalInstructions && <p className="text-gray-600 text-sm">Instructions: {sport.generalInstructions}</p>}
                        <button onClick={() => handleRemoveSport(sport._id)} className="mt-4 w-full px-3 py-2 bg-red-600 text-white rounded-md">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            {venue.sports.length === 0 && !showSportForm && (
                <p className="text-gray-500 text-center py-8">No sports added to this venue yet. Click "Add Sport" to begin.</p>
            )}
        </div>
    );
};

export default VenueDetailsPage; 