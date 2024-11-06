"use client";
import SecondaryHeader from "@/components/Header/Header";
import InfinityLoader from "@/components/Loaders/InfinityLoader";

import { RiderStore } from "@/service/RiderStore";
import ListManager from "@/utils/helpers/ListManager";
import debounce from "@/utils/helpers/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Card from "@/components/Card/Card";

// Dynamically import the map component
const RiderOnMapComponent = dynamic(() => import("./(component)/MapComponent"), { ssr: false });

const RiderOnMap = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedRider, setSelectedRider] = useState<any>(null); // State for the selected rider
  const listManager = useRef(new ListManager(RiderStore)).current;

  useEffect(() => {
    listManager.setFilter({ status: "active", approved: true, available: true });
    listManager.setLimit(200);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await listManager.fetchData();
      setData(listManager.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      await listManager.setSearch(query);
      setData(listManager.data);
    }, 300),
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Debugging: Log selected rider on click
  useEffect(() => {
    console.log("Selected Rider:", selectedRider);
  }, [selectedRider]);

  return (
    <>
      <SecondaryHeader title="Active Riders" showBackButton={true} showSearch={true} onSearch={handleSearch} />
      <div className="flex flex-col md:flex-row p-4 h-screen bg-gray-100">
        <div className="flex-1 overflow-scroll mb-4 md:mb-0 md:pr-2">
          {loading ? (
            <InfinityLoader />
          ) : (
            <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((item) => (
                <Card 
                  key={item?._id} 
                  className={`bg-white shadow-md rounded-lg p-4 flex flex-col transition-transform duration-200 ${selectedRider?._id === item?._id ? 'bg-blue-100 border border-blue-500' : ''}`} // Highlight selected card
                  onClick={() => setSelectedRider(item)} // Set selected rider on card click
                >
                  <h2 className="text-lg font-semibold">{item?.name}</h2>
                  <p className="text-gray-600">{item?.contact}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 h-96 md:h-auto">
          <RiderOnMapComponent data={data} selectedRider={selectedRider} /> {/* Pass selectedRider prop */}
        </div>
      </div>
    </>
  );
};

export default RiderOnMap;
