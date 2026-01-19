import React from "react";

const FooterMiddleList = ({ title, listItem }) => {
  return (
    <div className="w-full">
      <h3 className="font-title-font text-white text-base font-semibold mb-3">
        {title}
      </h3>
      <ul className="flex flex-col gap- font-sans ">
        {listItem.map((item,i) => (
           <li key={i} className="footerLink hover:underline hover:tracking-tighter">
             {item.listData}
           </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterMiddleList;