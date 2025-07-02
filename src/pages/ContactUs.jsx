import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl } from "../contant";
import { toast, ToastContainer } from "react-toastify";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiMapPin,
} from "react-icons/fi";
import { motion } from "framer-motion";
// Import background image
// import contactBg from "../assets/contact-bg.jpg"; // Add your background image

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/contact`, data);
      if (response.data) {
        toast.success("🎉 Message sent successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        reset();
      }
    } catch (error) {
      console.error(
        error.response?.data?.errorMessage || "Error sending message:",
        error
      );
      toast.error("❌ " + "Failed to send message", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2070&q=80')`, // Replace with your image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative   pt-20 px-4 pb-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center backdrop-blur-sm bg-white/10 p-8 rounded-2xl mt-20 mb-20">
          {/* Left side - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="bg-teal-600 bg-opacity-90 text-white p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8 text-teal-100">
              We'd love to hear from you. Please fill out the form and we'll get
              back to you as soon as possible.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-500 p-3 rounded-full">
                  <FiMail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-teal-100">contact@sportomic.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-teal-500 p-3 rounded-full">
                  <FiPhone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-teal-100">+91 7899152424</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-teal-500 p-3 rounded-full">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-teal-100">
                    4th-Floor I-hub,Navrangpura,Ahmedabad
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-xl p-8"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters long",
                    },
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Subject Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMessageSquare className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("subject", {
                    required: "Subject is required",
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${
                    errors.subject
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter the subject"
                />
                {errors.subject && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              {/* Message Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMessageSquare className="text-gray-400" />
                </div>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters long",
                    },
                  })}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:outline-none focus:ring-2`}
                  rows="5"
                  placeholder="Enter your message"
                ></textarea>
                {errors.message && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 
                  transition duration-300 flex items-center justify-center space-x-2 
                  ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <FiSend />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
