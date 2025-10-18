



"use client"

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import CatalogModal from "../components/CatalogModal";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [stats, setStats] = useState({ uploadsCount: 0, catalogCount: 0, recentUploads: [], userCatalogs: [] });
  const [loading, setLoading] = useState(true);
  const openDropdownIdRef = useRef(null);


  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
  };

 const handleEdit = (id) => {
  const catalogToEdit = catalogs.find((c) => c._id === id);
  if (!catalogToEdit) return;
  setEditId(id);
  setShowModal(true);
  setOpenDropdownId(null); // close dropdown
};


  // const handleDelete = async (id) => {
  //   if (!confirm("Are you sure you want to delete this catalog?")) {
  //     setOpenDropdownId(null);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`/api/catalog/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     if (response.ok) {
  //       // Remove from local state
  //       setCatalogs(catalogs.filter((c) => c._id !== id));
  //       toast.success('Catalog deleted successfully!');
  //     } else {
  //       const errorData = await response.json();
  //       toast.error(errorData.error || 'Failed to delete catalog');
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     toast.error('Failed to delete catalog');
  //   }
    
  //   setOpenDropdownId(null);
  // };

 async function handleDelete(id) {
  console.log("delete",id)
  if (!confirm("Are you sure you want to delete this catalog?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You are not logged in!");
    return;
  }

  const res = await fetch(`/api/catalog/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    toast.error(data.error || "Failed to delete catalog");
    return;
  }

  setCatalogs(prev => prev.filter(c => c._id !== id));
  toast.success("Catalog deleted successfully!");
  setOpenDropdownId(null);
}

  const handleSubmit = async (catalogData) => {
    // Close modal first
    closeModal();
    
    // Refresh the dashboard data to get the latest catalogs
    try {
      const res = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {});
        setCatalogs(data.stats.userCatalogs || []);
      }
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      // Fallback: try to update the local state
      if (editId !== null) {
        setCatalogs(
          catalogs.map((c) =>
            c._id === editId ? { ...catalogData, _id: editId } : c
          )
        );
      } else {
        // For new catalogs, we'll just refresh on next page load
        // since we don't have the proper structure from the API response
      }
    }
  };
  const handleDownload = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name || "catalog.pdf";
    a.click();
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", {
      icon: "🔗",
      style: {
        borderRadius: "12px",
        background: "linear-gradient(to right, #6366f1, #8b5cf6)", // Indigo → Purple gradient
        color: "#ffffff",
        fontWeight: "500",
        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)", // soft indigo glow
        padding: "12px 16px",
      },
    });
  };


  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // keep ref in sync so the outside-click handler sees latest value without changing effect deps
  openDropdownIdRef.current = openDropdownId;


  useEffect(() => {
    const handleClickOutside = (event) => {
      const currentId = openDropdownIdRef.current;
      if (!currentId) return;
      const container = document.getElementById(`dropdown-${currentId}`);
      if (container && !container.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include auth header if your API requires JWT
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await res.json();
        console.log("Get response ", data)
        setStats(data.stats || {});
        setCatalogs(data.stats.userCatalogs || []);
      } catch (err) {
        console.error(err);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header with Stats */}
        {/* <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your PDF catalogs</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">{stats.catalogCount}</div>
                <div className="text-sm opacity-90">Total Catalogs</div>
              </div>

            </div>
          </div>
        </div> */}



        {/* Catalogs Section */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md p-6">

          {catalogs.length === 0 ? (
            <div
              onClick={openModal}
              className="group relative bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-16 min-h-[400px]"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-3xl font-bold text-indigo-700">
                Create Your First Catalog
              </h3>
              <p className="mt-3 text-gray-600 text-lg max-w-md">
                Start by uploading your first PDF catalog to organize and share your content
              </p>
              <div className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg">
                Get Started
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalogs.map((catalog) => {
                // console.log("catalog ",catalog)
                
                const name = (catalog?.catalogName ?? "").toString();

                return (
                  <div
                    key={catalog._id}
                    className="relative group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-80"
                  >
                    {/* Dropdown Menu */}
                    <div className="absolute top-3 right-3 z-10" id={`dropdown-${catalog._id}`}>
                      <button
                        onClick={() => toggleDropdown(catalog._id)}
                        className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-indigo-600 hover:bg-white shadow-sm transition-all"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {openDropdownId === catalog._id && (
                        <div className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-t-lg"
                            onClick={() => handleEdit(catalog._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-b-lg"
                            onClick={() => handleDelete(catalog._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PDF Preview - Full Card Coverage */}
                    {/* inside your map for each catalog */}
                    <div className="relative flex-1 w-full bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: 180 }}>
                      {catalog.fileUrl && /\.pdf$/i.test(catalog.fileUrl) ? (
                        <iframe
                          src={catalog.fileUrl + "#toolbar=0&navpanes=0&view=FitH"}
                          title={catalog.catalogName || "PDF Preview"}
                          className="w-full h-full"
                          style={{
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            minHeight: 180,
                            pointerEvents: 'auto',   // allow interaction
                            transform: 'none',       // remove weird zoom/offset
                            backgroundColor: 'transparent',
                          }}
                          // let the iframe scroll
                          scrolling="yes"
                          // helpful error handler
                          onError={(e) => {
                            console.error("Iframe load failed for", catalog.fileUrl, e);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <p>No preview available</p>
                        </div>
                      )}
                    </div>


                    {/* Catalog Info - Compact Design with Hover Overlay */}
                    <div className="relative p-3 flex-shrink-0">
                      {/* File Details - Normal State */}
                      <div className="group-hover:opacity-60 transition-all duration-300">
                        {/* File Name Badge */}
                        <div className="mb-2">
                          <span className="inline-flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium border border-indigo-100">
                            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {name}
                          </span>
                        </div>

                        {/* Catalog Name */}
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 leading-tight">{catalog.name}</h3>

                        {/* Description - More Compact */}
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {catalog.description || "No description available"}
                        </p>
                      </div>

                      {/* Action Buttons Overlay - Appears on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/70 backdrop-blur-sm rounded-lg">
                        <div className="flex justify-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={() => window.open(catalog.preview, "_blank")}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-indigo-50 text-indigo-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-indigo-100"
                            title="View PDF"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDownload(catalog.preview, catalog.name)}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-green-50 text-green-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-green-100"
                            title="Download PDF"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleCopyLink(catalog.preview)}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-purple-50 text-purple-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-purple-100"
                            title="Copy Link"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 10h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2m-8 8h8" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Catalog Card - Compact Design */}
              <div
                onClick={openModal}
                className="group relative bg-white/70 backdrop-blur-lg rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="mt-3 text-base font-medium text-indigo-700">
                  Add New Catalog
                </h3>
                <p className="mt-1 text-xs text-gray-500 px-4">
                  Click to upload a new PDF
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CatalogModal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
       editCatalog={editId ? catalogs.find((c) => c._id === editId) : null}
      />
    </div>
  );
}

