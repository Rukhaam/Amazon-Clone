import React, { useState } from "react";
import Slider from "react-slick";
import {
  bannerOne,
  bannerTwo,
  bannerThree,
  bannerFour,
  bannerFive,
} from "../../src/assets";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Banner = () => {
  const [dotActive, setDocActive] = useState(0);

  // Custom Next Arrow Component
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        // Changed: 'hidden md:flex' -> Hides on mobile, Flex on desktop
        className="hidden md:flex absolute top-[30%] md:top-[40%] right-4 z-20 w-10 h-16 md:w-12 md:h-20 bg-transparent hover:bg-gray-200 hover:bg-opacity-20 hover:border border-gray-500 items-center justify-center cursor-pointer rounded shadow-none transition-all duration-200 group"
        onClick={onClick}
      >
        <ArrowForwardIosIcon className="text-gray-600 group-hover:text-gray-900" sx={{ fontSize: { xs: 20, md: 30 } }} />
      </div>
    );
  };

  // Custom Previous Arrow Component
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        // Changed: 'hidden md:flex' -> Hides on mobile
        className="hidden md:flex absolute top-[30%] md:top-[40%] left-4 z-20 w-10 h-16 md:w-12 md:h-20 bg-transparent hover:bg-gray-200 hover:bg-opacity-20 hover:border border-gray-500 items-center justify-center cursor-pointer rounded shadow-none transition-all duration-200 group"
        onClick={onClick}
      >
        <ArrowBackIosIcon className="text-gray-600 group-hover:text-gray-900" sx={{ fontSize: { xs: 20, md: 30 } }} />
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, 
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    // React Slick Responsive Settings (Optional backup if CSS hiding fails)
    responsive: [
        {
          breakpoint: 576,
          settings: {
            arrows: false, // Disables internal arrow logic on mobile
            autoplay: true,
          }
        }
    ]
  };

  return (
    <div className="w-full bg-gray-200 focus:outline-none">
      <div className="w-full h-full relative">
        <Slider {...settings}>
          {[bannerOne, bannerTwo, bannerThree, bannerFour, bannerFive].map((src, index) => (
             <div key={index} className="focus:outline-none">
                <img 
                  src={src} 
                  alt={`banner-${index}`} 
                  className="w-full h-auto object-cover" // Ensure image scales properly
                />
             </div>
          ))}
        </Slider>
        
        {/* Mask Gradient 
            - h-12 on mobile (thinner)
            - md:h-32 on desktop (taller)
        */}
        <div className="absolute w-full h-12 md:h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-10" />
      </div>
    </div>
  );
};

export default Banner;