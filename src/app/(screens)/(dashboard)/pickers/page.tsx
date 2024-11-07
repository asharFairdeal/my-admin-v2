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
import { PickerStore } from "@/service/PickerStore";
import Swal from "sweetalert2";

function Picker() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const listManager = useRef(new ListManager(PickerStore)).current;

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

  const handleSwitchChange = useCallback(
    async (key: string, id: string, currentStatus: string | boolean) => {
      let newStatus: string | boolean;

      if (key === "status") {
        newStatus = currentStatus === "active" ? "inactive" : "active"; // for "active" / "inactive"
      } else {
        newStatus = currentStatus === true ? false : true; // for true / false (approved, available)
      }

      await handleToggleStatus(key, id, newStatus);
    },
    []
  );

  // Function to trigger Swal dialog and update status
  const handleToggleStatus = async (
    key: string,
    id: string,
    status: string | boolean
  ) => {
    console.log(
      "handleToggle called with key:",
      key,
      "id:",
      id,
      "isActive:",
      status
    );

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update the status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        let response = null;

        // Simplify API call with a map for better readability
        const apiMap: any = {
          status: PickerStore.updateStatus,
          available: PickerStore.updateAvailable,
          approved: PickerStore.updateApproved,
        };

        if (apiMap[key]) {
          response = await apiMap[key]({ id, status });
        }

        if (
          response?.data?.status === "success" ||
          response?.data?.status === "SUCCESS"
        ) {
          toast.success("Successfully updated!");
          listManager.refresh().then(() => {
            console.log("after reset", listManager.data);
            setData(listManager.data);
          });
        } else {
          toast.error("Failed to update");
        }
      } catch (error) {
        toast.error("Failed to update");
        console.error("Failed to update:", error);
      }
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "contact", label: "Contact" },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (row: any) =>
        moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      key: "activePicklist",
      label: "PickList",
      render: (row: any) => (
        <span>
          {row.activePicklist &&
            row.activePicklist?.map((item: any) => {
              return (
                <>
                  {console.log(item)}
                  <div key={item}>{item}</div>
                </>
              );
            })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <Switch
          checked={row.status === "active"}
          onChange={() => handleSwitchChange("status", row._id, row.status)}
        />
      ),
    },
    {
      key: "approved",
      label: "Approved",
      render: (row: any) => (
        <Switch
          checked={row.approved === true}
          onChange={() => handleSwitchChange("approved", row._id, row.approved)}
        />
      ),
    },
    {
      key: "available",
      label: "Available",
      render: (row: any) => (
        <Switch
          checked={row.available === true}
          onChange={() =>
            handleSwitchChange("available", row._id, row.available)
          }
        />
      ),
    },
    // {
    //   key: "view",
    //   label: "View",
    //   render: (row: any) => (
    //     <button
    //       onClick={() => router.push(`/pickers/${row._id}`)}
    //       className='btn bg-blue-400 btn-sm'
    //     >
    //       <span>View</span>
    //     </button>
    //   ),
    // },
  ];

  return (
    <>
      <SecondaryHeader
        title='Pickers'
        showSearch={true}
        onSearch={handleSearch}
      />
      <div className='flex flex-col p-4 h-screen bg-gray-100 overflow-scroll'>
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

export default Picker;
