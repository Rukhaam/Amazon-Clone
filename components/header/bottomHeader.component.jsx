import React, { useEffect, useRef, useState } from "react";
import {
  AccountCircle,
  Close,
  Menu as MenuIcon,
  ArrowBack,
} from "@mui/icons-material"; 
import { motion } from "framer-motion";
import SideNavContent from "./sideNavContent";

const BottomHeader = () => {
  const [open, setOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState("main"); 
  const ref = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest('.menu-trigger')) {
        setOpen(false);
      }
    });
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSidebarView("main");
    }
  }, [open]);

  // --- MENU DATA ---
  const digitalContent = [
    { title: "Amazon Music", action: null },
    { title: "Kindle E-readers & Books", action: null },
    { title: "Amazon Appstore", action: null },
  ];

  const shopByDepartment = [
    {
      title: "Electronics",
      action: () => setSidebarView("electronics"), 
    },
    { title: "Computers", action: null },
    { title: "Smart Home", action: null },
  ];

  const programs = [
    { title: "Gift Cards", action: null },
    { title: "Amazon Live", action: null },
    { title: "International Shopping", action: null },
  ];

  const help = [
    { title: "Your Account", action: null },
    { title: "Customer Service", action: null },
    { title: "Contact Us", action: null },
  ];

  const electronicsItems = [
    { title: "Camera & Photo", action: null },
    { title: "Audio & Headphones", action: null },
    { title: "Video Games", action: null },
    { title: "Television & Video", action: null },
    { title: "Car & Vehicle Electronics", action: null },
  ];

  return (
    <div className="w-full px-4 h-9 lg:h-10 bg-amazon-light text-white flex items-center overflow-x-auto no-scrollbar">
      {/* Trigger Button */}
      <ul className="flex items-center gap-2 lg:gap-4 text-sm lg:text-base tracking-wide whitespace-nowrap">
        <li className="headerHover gap-1 menu-trigger flex items-center font-bold px-2" onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
          <MenuIcon /> All
        </li>
        <li className="headerHover hidden md:inline-flex px-2">Today's Deals</li>
        <li className="headerHover hidden md:inline-flex px-2">Customer Service</li>
        <li className="headerHover hidden md:inline-flex px-2">Gift Cards</li>
        <li className="headerHover hidden md:inline-flex px-2">Registry</li>
        <li className="headerHover hidden md:inline-flex px-2">Sell</li>
      </ul>

      {/* Sidebar Overlay */}
      {open && (
        <div className="w-full h-screen text-black fixed top-0 left-0 bg-amazon-blue/70 z-[100] transition-opacity">
          <div className="w-full h-full relative">
            <motion.div
              ref={ref}
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-[85%] md:w-[350px] lg:w-[400px] h-full bg-white border-r border-black overflow-y-scroll pb-10 relative"
            >
              <div 
                onClick={() => setOpen(false)}
                className="absolute top-2 -right-12 w-10 h-10 text-white flex items-center justify-center cursor-pointer md:fixed md:left-[360px] lg:left-[410px] md:top-4 z-50"
              >
                <Close fontSize="large" />
              </div>

              <div className="w-full bg-amazon-light text-white py-3 px-5 flex items-center gap-4 text-lg lg:text-xl font-bold sticky top-0 z-40">
                <AccountCircle fontSize="large" />
                <h3>Hello, { "Sign in" }</h3>
              </div>

              {/* === MAIN MENU VIEW === */}
              {sidebarView === "main" && (
                <div className="animate-fadeIn">
                  <SideNavContent
                    title="Digital Content & Devices"
                    items={digitalContent}
                  />
                  <SideNavContent
                    title="Shop By Departments"
                    items={shopByDepartment}
                  />
                  <SideNavContent
                    title="Programs and Features"
                    items={programs}
                  />
                  <SideNavContent title="Help and Settings" items={help} />
                </div>
              )}

              {/* === ELECTRONICS SUB-MENU VIEW === */}
              {sidebarView === "electronics" && (
                <div className="w-full animate-fadeInRight">
                  {/* Back Button */}
                  <div
                    onClick={() => setSidebarView("main")}
                    className="py-3 px-6 text-lg lg:text-xl font-semibold cursor-pointer hover:bg-zinc-200 border-b border-gray-300 flex items-center gap-2 sticky top-[52px] bg-white z-30"
                  >
                    <ArrowBack /> Main Menu
                  </div>

                  {/* Sub Items */}
                  <SideNavContent
                    title="Electronics"
                    items={electronicsItems}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomHeader;