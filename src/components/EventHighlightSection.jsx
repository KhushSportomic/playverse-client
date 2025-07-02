import React, { useState } from "react";
import img1 from "../assets/images/mask-group-3.jpg";
import img2 from "../assets/images/mask-group-4.jpg";
import img3 from "../assets/images/mask-group-5.jpg";

const EventHighlightsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [img1, img2, img3];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="font-bebas text-6xl text-[#27262a] mb-12">
        Event Highlights
      </h2>

      <div className="relative">
        {/* For Mobile: Show only one image and allow navigation */}
        <div className="md:hidden flex overflow-x-hidden space-x-6">
          <div className="w-full flex justify-center">
            <div className="rounded-3xl overflow-hidden">
              <img
                src={images[currentIndex]}
                alt={`Event ${currentIndex + 1}`}
                className="w-full h-[302px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* For Web: Show all images in a row */}
        <div className="hidden md:flex overflow-x-auto space-x-6">
          {images.map((img, index) => (
            <div key={index} className="w-1/3">
              <div className="rounded-3xl overflow-hidden">
                <div className="p-0">
                  <img
                    src={img}
                    alt={`Event ${index + 1}`}
                    className="w-full h-[302px] object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Previous and Next Buttons for Mobile Slider */}
        <button
          className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black opacity-80 text-white rounded-full p-3 text-lg sm:p-4 sm:text-xl"
          onClick={prevImage}
        >
          &lt;
        </button>
        <button
          className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black opacity-80 text-white rounded-full p-3 text-lg sm:p-4 sm:text-xl"
          onClick={nextImage}
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default EventHighlightsSection;
