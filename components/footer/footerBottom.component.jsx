import React from "react";
import { footerBottomItem } from "../../constants/footerBottom.data";

const FooterBottom = () => {
  return (
    <div className="w-full bg-footer-bottom py-8">
      <div className="max-w-container mx-auto px-4">
        {/* --- Top Section: Links Grid --- */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-4 gap-3 place-content-center text-gray-400">
          {footerBottomItem.map((item) => (
            <div className="group cursor-pointer" key={item._id}>
              <h3 className="w-24 font-semibold text-[12px] group-hover:underline text-[#DDD] leading-3 mb-[2px]">
                {item.title}
              </h3>
              <p className="w-24 tracking-tight text-[12px] text-[#999] group-hover:underline leading-3">
                {item.descr}
              </p>
            </div>
          ))}
        </div>

        {/* --- Bottom Section: Copyright & Legal --- */}
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex flex-col md:flex-row gap-4 text-xs text-[#CCC] hover:text-white cursor-pointer mb-2">
            <p className="hover:underline">Conditions of Use & Sale</p>
            <p className="hover:underline">Privacy Notice</p>
            <p className="hover:underline">Interest-Based Ads</p>
          </div>
          <p className="text-xs text-[#DDD]">
            © 1996-2026, Amazon.com, Inc. or its affiliates
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
