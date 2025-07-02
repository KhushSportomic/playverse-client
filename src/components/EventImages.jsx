import React from "react";
import { Carousel } from "@material-tailwind/react";

const EventImages = () => {
  return (
    <>
      <Carousel loop={true} autoplay={true} className="rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1983&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="image 1"
          className="h-full w-full object-cover object-center"
        />
        <img
          src="https://images.unsplash.com/photo-1595210382266-2d0077c1f541?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="image 2"
          className="h-full w-full object-cover object-center"
        />
        <img
          src="https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?q=80&w=2049&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="image 3"
          className="h-full w-full object-cover object-center"
        />
      </Carousel>
    </>
  );
};

export default EventImages;
