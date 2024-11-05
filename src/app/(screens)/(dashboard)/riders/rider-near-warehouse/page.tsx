// app/rider/rider-near-warehouse/page.tsx
"use client";
import SecondaryHeader from "@/components/Header/Header";
import InfinityLoader from "@/components/Loaders/InfinityLoader";
import Pagination from "@/components/Pagination/Pagination";
import Switch from "@/components/Switch/Switch";
import Table from "@/components/Table/Table";
import { RiderStore } from "@/service/RiderStore";
import ListManager from "@/utils/helpers/ListManager"; // Adjust the import path as necessary
import debounce from "@/utils/helpers/debounce"; // Adjust the import path as necessary
import { stat } from "fs";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const RiderNearWarehouse = () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const listManager = useRef(new ListManager(RiderStore)).current;
  
  
  // Set permanent query parameter for active orders
  useEffect(() => {
    listManager.setFilter({ activeOrders: true  , status: "active" , approved : true , available : true});
  }, [listManager]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      await listManager.setSearch(query);
      setData(listManager.data);
    }, 300),
    []
  );



  const handleSort = async (key: string) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    await listManager.setSort(key, newOrder);
    console.log("after sort", listManager.data);
    setData(listManager.data);
  };

  const handleNext = async () => {
    if (!listManager.isLastPage(listManager.total)) {
      await listManager.setPage(listManager.query.page + 1);
      setData(listManager.data);
    }
  };

  const handlePrevious = async () => {
    if (!listManager.isFirstPage()) {
      await listManager.setPage(listManager.query.page - 1);
      setData(listManager.data);
    }
  };


  const columns = [
    { key: "name", label: "Name" },
    { key: "contact", label: "Contact" },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (row: any) => moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => <Switch checked={row.status === "active"} disabled={true} />,
    },
    {
      key: "approved",
      label: "Approved",
      render: (row: any) => <Switch checked={row.approved} disabled={true} />,
    },
    {
      key: "available",
      label: "Available",
      render: (row: any) => <Switch checked={row.available} disabled={true} />,
    },
  ];

  return (
    <>
      <SecondaryHeader
        title="Riders Near Warehouse"
        showBackButton={true} 
        showSearch={true}
        onSearch={handleSearch}
      />
     
     <div className="flex flex-col p-4 h-screen bg-gray-100 overflow-scroll">
        {loading ? (
          <InfinityLoader />
        ) : (
          <>
            <Table
              columns={columns}
              data={data}
              onSort={handleSort} // Pass handleSort to Table
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
            <Pagination
              listManager={listManager}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </>
        )}
      </div>
    </>
  );
};

export default RiderNearWarehouse;
