import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface SecondaryHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  buttons?: JSX.Element[]; // This allows passing multiple buttons dynamically
  showBackButton?: boolean; // New prop to control the back button visibility
}

function SecondaryHeader({
  title,
  onSearch,
  buttons = [],
  showSearch = false,
  showBackButton = false, // Default value is false
}: SecondaryHeaderProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter(); // Get the router for navigation

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <div className="flex justify-between items-center p-1 shadow-md relative">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={() => router.back()} // Use router.back() to navigate back
            className="mr-2 text-blue-500"
            aria-label="Go Back"
          >
            <Image src="/arrow-left.png" alt="Back" width={20} height={20} />
          </button>
        )}
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="px-2 py-1 bg-blue-400 text-white rounded transition duration-300 ease-in-out transform hover:bg-blue-600"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {showSearch && (
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2">
            {buttons && (
              <div className="flex gap-2">
                {React.Children.map(buttons, (button) =>
                  React.cloneElement(button, {
                    className:
                      "h-8 px-4 text-blue-500 border border-blue-400 rounded hover:bg-blue-50 transition",
                  })
                )}
              </div>
            )}
            {/* Search Input */}
            <div className="flex h-8 items-center gap-0 rounded-lg ring-[1.5px] ring-gray-300">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="w-full max-w-[200px] p-2 bg-transparent outline-none rounded-l-lg"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center w-10 h-8 bg-blue-200 text-white rounded-r-lg hover:bg-blue-500 transition"
                aria-label="Search"
              >
                <Image src="/search.png" alt="" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Popup Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-10 right-0 z-10 mt-2 w-48 bg-white border rounded shadow-lg md:hidden">
          <div className="p-2">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center mb-2 bg-red-500 text-white rounded py-1 hover:bg-red-600 transition"
              aria-label="Close Menu"
            >
              Close
            </button>

            {buttons && (
              <div className="flex flex-col gap-1">
                {React.Children.map(buttons, (button) =>
                  React.cloneElement(button, {
                    className:
                      "h-8 px-4 text-blue-500 border border-blue-400 rounded hover:bg-blue-50 transition overflow-hidden whitespace-nowrap truncate",
                  })
                )}
              </div>
            )}

            {/* Search Input for Mobile */}
            <div className="flex flex-col mt-2">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="mt-1 bg-gray-200 text-black rounded h-8 flex items-center justify-center transition"
                aria-label="Search"
              >
                <Image src="/search.png" alt="" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecondaryHeader;
