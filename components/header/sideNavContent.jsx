import React from "react";
import { KeyboardArrowRight } from "@mui/icons-material";
const SideNavContent = ({ title, one, two, three }) => {
  return (
   
      <div className="py-3 border-b border-b-gray-500">
        <h3 className="text-xl  font-sans font-semibold mb-1 px-6">{title}</h3>
        <ul className="text-sm font-medium">
          <li className="flex items-center justify-between hover:bg-zinc-200 px-6 py-2 cursor-pointer">
            {one}
            <span>
              <KeyboardArrowRight></KeyboardArrowRight>
            </span>
          </li>
          <li className="flex items-center justify-between hover:bg-zinc-200 px-6 py-2 cursor-pointer">
            {two}
            <span>
              <KeyboardArrowRight></KeyboardArrowRight>
            </span>
          </li>
          <li className="flex items-center justify-between hover:bg-zinc-200 px-6 py-2 cursor-pointer">
            {three}
            <span>
              <KeyboardArrowRight></KeyboardArrowRight>
            </span>
          </li>
        </ul>
      </div>
  );
};
export default SideNavContent;
