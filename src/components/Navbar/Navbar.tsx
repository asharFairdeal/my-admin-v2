"use client";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const { user , logout } = useUser();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsPopoverOpen((prev) => !prev); // Toggle popover visibility
  };

  const handleLogout = () => {
    // Logic for logout (you'll need to implement this)
    console.log("Logout clicked");
    logout();
    setIsPopoverOpen(false); // Close popover after logout
  };

  return (
    <div className='flex items-center justify-between p-2'>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/announcement.png" alt="" width={20} height={20}/>
        </div>

        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">{user?.firstName + " " + user?.lastName}</span>
          <span className="text-[10px] text-gray-500 text-right">{user?.role || "Admin"}</span>
        </div>

        <div className='relative'>
          <Image 
            src="/avatar.png" 
            alt="" 
            width={36} 
            height={36} 
            className="rounded-full cursor-pointer"
            onClick={handleAvatarClick} 
          />

          {isPopoverOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
              <p className="text-sm">Are you sure you want to logout?</p>
              <div className="flex justify-between mt-2">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-xs bg-blue-400 btn-outline text-white hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                  Logout
                </button>
                <button 
                  onClick={() => setIsPopoverOpen(false)} 
                  className="btn btn-outline btn-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar;
