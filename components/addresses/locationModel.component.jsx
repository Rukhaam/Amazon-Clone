import React from "react";
import { useAddress } from "../../src/context/adresses.context";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const LocationModal = ({ setShowModal }) => {
  const { addresses, selectedAddress, setSelectedAddress } = useAddress();

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
          <h3 className="font-bold text-lg text-black">Choose your location</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-black"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Delivery options and delivery speeds may vary for different
            locations
          </p>

          {/* ADDRESS LIST */}
          <div className="flex flex-col gap-3">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelect(addr)}
                  className={`cursor-pointer p-4 rounded-md border-2 transition-all ${
                    selectedAddress?.id === addr.id
                      ? "border-amazon_blue bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm">{addr.fullName}</span>
                    <span className="text-sm text-gray-600">
                      {addr.street}, {addr.city} {addr.zip}
                    </span>
                    {selectedAddress?.id === addr.id && (
                      <span className="text-xs text-amazon_blue mt-1 font-bold">
                        Default address
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500 text-sm">
                No addresses saved yet.
              </div>
            )}
          </div>

          {/* === UPDATED LINK === */}
          <div className="mt-4">
            <Link
              to="/addresses" // <--- CHANGED: Now points to Address Page
              onClick={() => setShowModal(false)}
              className="text-blue-600 text-sm hover:underline hover:text-orange-700"
            >
              Manage address book
            </Link>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="border rounded-md px-2 py-1 w-full bg-white shadow-inner">
                <input
                  type="text"
                  placeholder="or enter a US zip code"
                  className="w-full text-sm outline-none"
                />
              </div>
              <button className="px-4 py-1 rounded-md border shadow-sm text-sm hover:bg-gray-100">
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 text-right">
          <button
            onClick={() => setShowModal(false)}
            className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-6 py-1 rounded-md text-sm font-medium shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
