import { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // console.log("Images received in Carousel:", images);
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
          //   console.log("Switching to index:", newIndex);
          return newIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="text-center py-4">No images available</div>;
  }

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Carousel Image ${index + 1}`}
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          onError={() => console.log(`Failed to load image: ${image}`)}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
