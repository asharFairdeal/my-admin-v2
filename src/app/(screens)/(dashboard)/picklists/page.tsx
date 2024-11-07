"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import SecondaryHeader from "@/components/Header/Header";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import ListManager from "@/utils/helpers/ListManager";
import { toast } from "react-toastify";
import debounce from "@/utils/helpers/debounce";
import InfinityLoader from "@/components/Loaders/InfinityLoader";
import Switch from "@/components/Switch/Switch";
import moment from "moment";
import Swal from "sweetalert2";
import { PickListStore } from "@/service/PicklistStore";

const statusOptions = ["Pending", "Hold", "Completed", "Progress"];

function PickList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const listManager = useRef(new ListManager(PickListStore)).current;

  const router = useRouter();

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Show confirmation dialog with SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
  
    // If the user confirms, proceed with the status update
    if (result.isConfirmed) {
      try {
        const res: any = await PickListStore.updateStatus({ id, status: newStatus });
        if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
          toast.success("Status updated successfully");
          await listManager.refresh().then(() => {
            setData(listManager.data);
          });
        }
      } catch (error) {
        toast.error("Failed to change status");
        console.log("Failed to change status:", error);
      }
    } else {
      // If the user cancels, do nothing
      console.log("Status change canceled");
    }
  };
  
  const columns = [
    { key: "_id", label: "PickList ID #" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: any) =>
        moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    { key: "pickerId", label: "Picker ID #" , render: (row: any) => row.pickerId?._id?.slice(0, 5)},
    { key: "pickerId", label: "Picker Name" , render: (row: any) => row.pickerId?.name},
    { key: "pickerId", label: "Picker Contact" , render: (row: any) => row.pickerId?.contact},
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <select
          className="border border-gray-300 rounded-md p-2 w-full md:w-auto text-sm md:text-base focus:outline-none focus:border-blue-500"
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    
  ];

  return (
    <>
      <SecondaryHeader
        title="PickLists"
        showSearch={false}
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
              onSort={handleSort}
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
}

export default PickList;
