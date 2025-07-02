import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiFilter,
  FiMessageCircle,
  FiInbox,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../contant";

const Inquiries = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, read, unread
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/contact`);
      setContacts(response.data.contacts);
      setTotalContacts(response.data.total);
    } catch (error) {
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadContacts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/contact/unread/count`);
      setUnreadContacts(response.data.unreadCount);
    } catch (error) {
      toast.error("Failed to fetch unread contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchUnreadContacts();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${apiUrl}/contact/${id}/read`);
      toast.success("Marked as read");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/contact/${id}`);
      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "read") return matchesSearch && contact.isRead;
    if (filter === "unread") return matchesSearch && !contact.isRead;
    return matchesSearch;
  });

  const statsCards = [
    {
      icon: FiInbox,
      title: "Total Inquiries",
      value: totalContacts,
      color: "bg-blue-500",
    },
    {
      icon: FiMessageCircle,
      title: "Unread Messages",
      value: unreadContacts,
      color: "bg-teal-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="flex items-center">
                <stat.icon size={24} className="mr-4" />
                <div>
                  <h3 className="text-lg font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                filter === "all" ? "bg-teal-500 text-white" : "bg-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg ${
                filter === "unread" ? "bg-teal-500 text-white" : "bg-white"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg ${
                filter === "read" ? "bg-teal-500 text-white" : "bg-white"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Contacts Grid */}
        <AnimatePresence>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 ${
                  !contact.isRead ? "border-l-4 border-teal-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contact.name}
                  </h2>
                  <div className="flex space-x-2">
                    {!contact.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(contact._id)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <FiCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(contact._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Subject</h3>
                  <p className="text-gray-600">{contact.subject}</p>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Message</h3>
                  <p className="text-gray-600">{contact.message}</p>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm === contact._id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="mb-4">
                        Are you sure you want to delete this inquiry?
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(contact._id);
                            setShowDeleteConfirm(null);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredContacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8 p-8 bg-white rounded-lg shadow"
          >
            <FiInbox size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl">No inquiries found</p>
            <p className="text-sm text-gray-400">
              {searchTerm
                ? "Try adjusting your search"
                : "You haven't received any inquiries yet"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
