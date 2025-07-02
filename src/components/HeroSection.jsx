import React from "react";
import { useNavigate } from "react-router";

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-6 pt-32 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-bebas text-[60px] md:text-[80px] leading-[80px] md:leading-[100px] text-[#27262a]">
            Play, Learn, <br /> and Make New Friends
          </h2>
          <p className="font-outfit font-semibold text-xl mt-4 mb-8">
            A Space Where Fun Meets Learning, And Connections Turn Into
            Friendships Starting At Just ₹99/-
          </p>
          {/* Direct Button Element */}
          <button
            onClick={() => navigate("/events")}
            className="bg-[#008080] text-white text-xl rounded-full px-8 py-3 font-outfit font-semibold"
          >
            PLAY NOW
          </button>
        </div>

        {/* Graphic Section (Visible on Medium and Larger Screens Only) */}
        <div className="hidden md:block md:flex-1 relative mt-8 md:mt-0">
          <div className="w-[280px] md:w-[398px] h-[280px] md:h-[398px] bg-white rounded-full shadow-2xl mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
