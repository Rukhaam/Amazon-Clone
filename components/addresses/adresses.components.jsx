import React from "react";
import { useAddress } from "../../src/context/adresses.context";
import { Link } from "react-router-dom"; // <--- Import Link
import AddIcon from "@mui/icons-material/Add";

const AddressManager = () => {
  const { addresses, selectedAddress, setSelectedAddress } = useAddress();


  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">1. Delivery Address</h2>
          
          {/* LINK TO CENTRAL PAGE */}
          <Link 
            to="/addresses" 
            className="text-sm text-blue-600 hover:underline hover:text-orange-700"
          >
            Manage Addresses
          </Link>
      </div>

      {/* === LIST OF SAVED ADDRESSES === */}
      <div className="flex flex-col gap-3 mb-4">
        {addresses.length > 0 ? (
            addresses.map((addr) => (
            <div 
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`cursor-pointer border p-3 rounded flex items-start gap-3 transition-colors ${
                selectedAddress?.id === addr.id 
                    ? "border-yellow-500 bg-yellow-50" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
            >
                <input 
                type="radio" 
                name="address" 
                checked={selectedAddress?.id === addr.id} 
                readOnly 
                className="mt-1 text-amazon-yellow focus:ring-amazon-yellow accent-yellow-500"
                />
                <div className="text-sm">
                    <p className="font-bold">{addr.fullName}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.zip}</p>
                    <p className="text-gray-500">{addr.country} | Phone: {addr.phone}</p>
                </div>
            </div>
            ))
        ) : (
            <div className="text-gray-500 text-sm">
                No addresses found. Please add one.
            </div>
        )}
      </div>

      {/* === ADD NEW ADDRESS BUTTON (Redirects) === */}
      <Link 
        to="/addresses"
        className="flex items-center gap-2 text-gray-600 hover:text-black hover:bg-gray-100 p-2 rounded-md w-fit transition-colors"
      >
         <AddIcon fontSize="small" />
         <span className="text-sm font-medium">Add a new address</span>
      </Link>

    </div>
  );
};

export default AddressManager;