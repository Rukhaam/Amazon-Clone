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
        className="absolute top-[40%] right-4 z-20 w-12 h-20 bg-transparent  hover:bg-opacity-40 hover:border border-gray-500 flex items-center justify-center cursor-pointer rounded shadow-none transition-all duration-200 group"
        onClick={onClick}
      >
        <ArrowForwardIosIcon className="text-gray-600 group-hover:text-gray-900" sx={{ fontSize: 30 }} />
      </div>
    );
  };

  // Custom Previous Arrow Component
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-[40%] left-4 z-20 w-12 h-20 bg-transparent  hover:bg-opacity-40 hover:border border-gray-500 flex items-center justify-center cursor-pointer rounded shadow-none transition-all duration-200 group"
        onClick={onClick}
      >
        <ArrowBackIosIcon className="text-gray-600 group-hover:text-gray-900" sx={{ fontSize: 30 }} />
      </div>
    );
  };

  const settings = {
    dots: false, // Disable dots
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Enable arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
  };

  return (
    <div className="w-full">
      <div className="w-full h-full relative">
        <Slider {...settings}>
          <div>
            <img src={bannerOne} alt="bannerOne" />
          </div>
          <div>
            <img src={bannerTwo} alt="bannerTwo" />
          </div>
          <div>
            <img src={bannerThree} alt="bannerThree" />
          </div>
          <div>
            <img src={bannerFour} alt="bannerFour" />
          </div>
          <div>
            <img src={bannerFive} alt="bannerFive" />
          </div>
        </Slider>
         {/* Mask Gradient */}
         <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-10" />
      </div>
    </div>
  );
};

export default Banner;