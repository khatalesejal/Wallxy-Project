"use client"

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import CatalogModal from "../components/CatalogModal";
import DeleteModal from "../components/DeleteModal";
import ShareModal from "../components/ShareModal";
import toast, { Toaster } from "react-hot-toast";
import { useGetDashboardQuery,useDeleteCatalogMutation } from "../services/api";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [shareCatalog, setShareCatalog] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); 
  const dropdownRefs = useRef({});
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  

  // Default fallback data
  const stats = data?.stats || { uploadsCount: 0, catalogCount: 0, userCatalogs: [] };
  const catalogs = stats.userCatalogs || [];
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCatalog] = useDeleteCatalogMutation();

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
  };

 const handleEdit = (id) => {
  console.log("handleEdit called with ID:", id);
  console.log("Available catalogs:", catalogs.map(c => ({ id: c._id, name: c.title })));
  
  const catalogToEdit = catalogs.find((c) => c._id === id);
  console.log("Found catalog to edit:", catalogToEdit);
  
  if (!catalogToEdit) {
    console.error("Catalog not found for ID:", id);
    return;
  }
  
  setEditId(id);
  setShowModal(true);
  setOpenDropdownId(null); // close dropdown
  
  console.log("Edit modal should open with editId:", id);
};


  // const handleDelete = async () => {
  
  //     try {
  //       const res = await fetch(`/api/catalog/${deleteId}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${localStorage.getItem("token")}`
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to delete catalog");
  //       }

  //       toast.success('Catalog deleted successfully!');
  //       // Refresh the catalog list from server
  //       await refetch();
  //     } catch (error) {
  //       console.error('Error deleting catalog:', error);
  //       toast.error('Error deleting catalog');
  //     }finally {
  //     setDeleteId(null);
  //     setOpenDropdownId(null);
  //   }
    
   
  // };


  // const handleSubmit = async (catalogData) => {
  //   try {
      
  //     await fetchDashboardData();
  //     closeModal();
  //   } catch (error) {
  //     console.error('Error refreshing catalog list:', error);
  //     toast.error('Error refreshing catalog list');
  //   }
  // };

  // const fetchDashboardData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/dashboard", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch dashboard data");
  //     }

  //     const data = await res.json();
  //     console.log("Get response ", data)
  //     const userCatalogs = data.stats?.userCatalogs || [];
  //     setCatalogs(userCatalogs);
  //     setStats({
  //       ...data.stats,
  //       catalogCount: userCatalogs.length
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error loading dashboard data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async () => {
  try {
    const result = await deleteCatalog(deleteId).unwrap();
    toast.success("Catalog deleted successfully!");
    await refetch(); 
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Error deleting catalog");
  } finally {
    setDeleteId(null);
    setOpenDropdownId(null);
  }
};
 
  
  const handleSubmit = async () => {
    await refetch();
    setShowModal(false);
    setEditId(null);
  };
  const handleDownload = async (url, name) => {
    try {
      // Create a more robust download function
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = name || "catalog.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("PDF downloaded successfully!", {
        icon: "📥",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(to right, #10b981, #059669)",
          color: "#ffffff",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
          padding: "12px 16px",
        },
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF", {
        icon: "❌",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(to right, #ef4444, #dc2626)",
          color: "#ffffff",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
          padding: "12px 16px",
        },
      });
    }
  };

  const handleShare = (catalog) => {
    setShareCatalog(catalog);
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("PDF link copied to clipboard!", {
        icon: "🔗",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
          color: "#ffffff",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
          padding: "12px 16px",
        },
      });
    } catch (error) {
      console.error("Copy failed:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast.success("PDF link copied to clipboard!", {
        icon: "🔗",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
          color: "#ffffff",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
          padding: "12px 16px",
        },
      });
    }
  };


  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      const isClickInsideAnyDropdown = Object.values(dropdownRefs.current).some(ref => 
        ref && ref.contains(event.target)
      );
      
      if (!isClickInsideAnyDropdown) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);
 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Dashboard Header with Stats */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar - Moved to header */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-indigo-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className={`block w-full pl-12 pr-10 py-3.5 bg-white/90 text-gray-800 placeholder-indigo-300/80 rounded-xl shadow-sm 
                    border-2 border-transparent 
                    focus:border-indigo-400 focus:ring-0 focus:ring-offset-0
                    transition-all duration-200 text-base outline-none
                    ${searchQuery ? 'border-indigo-300' : 'border-transparent hover:border-indigo-200'}`}
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    boxShadow: '0 4px 20px -5px rgba(99, 102, 241, 0.15)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-400 hover:text-indigo-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Catalog Count - Kept on the right */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">{stats.catalogCount}</div>
                <div className="text-sm opacity-90">Total Catalogs</div>
              </div>
            </div>
          </div>
        </div>

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
              {catalogs
                .filter(catalog => 
                  searchQuery === '' || 
                  catalog.title?.toLowerCase().includes(searchQuery.toLowerCase()) 
                )
                .map((catalog, index) => {
                console.log("catlog",catalog)
                // Try multiple possible paths for filename
               const pdfFileName = catalog?.file?.filename || "Untitled PDF";
                
                
                return (
                  <div
                    key={catalog._id || `catalog-${index}`}
                    className="group relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-80 animate-fade-in"
                  >
                    {/* Dropdown Menu */}
                    <div 
                      className="absolute top-3 right-3 z-10" 
                      ref={el => dropdownRefs.current[catalog._id] = el}
                    >
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
                            onClick={() => setDeleteId(catalog._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PDF Preview - Full Card Coverage */}
                    {/* inside your map for each catalog */}
                    <div className="relative flex-1 w-full bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: 180 }}>
                      {catalog.file?.fileUrl && /\.pdf$/i.test(catalog.file.fileUrl) ? (
                        <iframe
                          src={catalog.file.fileUrl + "#toolbar=0&navpanes=0&view=FitH"}
                          title={catalog.title || "PDF Preview"}
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
                            console.error("Iframe load failed for", catalog.file?.fileUrl, e);
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
                        {/* PDF Name - Primary Title */}
                        <h3 className="inline-flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-medium border border-indigo-100">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          {pdfFileName}
                        </h3>

                        {/* Catalog Name - Secondary */}
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1 leading-tight">
                            
                            {catalog.title || "No catalog name"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {catalog.description || "No description available"}
                        </p>
                      </div>

                      {/* Action Buttons Overlay - Appears on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/70 backdrop-blur-sm rounded-lg">
                        <div className="flex justify-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={() => {
                              console.log("Opening PDF:", catalog.file?.fileUrl);
                              if (catalog.file?.fileUrl) {
                                window.open(catalog.file.fileUrl, "_blank");
                              } else {
                                toast.error("PDF URL not available");
                              }
                            }}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-indigo-50 text-indigo-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-indigo-100"
                            title="View PDF"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => {
                              // console.log("Downloading PDF:", catalog.fileUrl, catalog.catalogName);
                              const pdfUrl = catalog.file?.fileUrl || catalog.fileUrl;
                              if (pdfUrl) {
                               handleDownload(pdfUrl, pdfFileName || 'catalog.pdf');
                              } else {
                               toast.error("PDF URL not available for download");
                              }

                            }}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-green-50 text-green-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-green-100"
                            title="Download PDF"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                          </button>

                          <button
                            onClick={() => {
                              console.log("Copying PDF link:", catalog.fileUrl);
                              const pdfUrl = catalog.file?.fileUrl || catalog.fileUrl;
                              if (pdfUrl) {
                                handleCopyLink(pdfUrl);
                              } else {
                                toast.error("PDF URL not available for copying");
                              }
                            }}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-purple-50 text-purple-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-purple-100"
                            title="Copy Link"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 10h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2m-8 8h8" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleShare(catalog)}
                            className="flex flex-col items-center justify-center w-12 h-12 bg-white shadow-md rounded-lg hover:bg-blue-50 text-blue-600 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-blue-100"
                            title="Share"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
       <DeleteModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <ShareModal
        show={!!shareCatalog}
        onClose={() => setShareCatalog(null)}
        catalogId={shareCatalog?._id}
        catalogData={shareCatalog}
      />
    </div>
  );
}