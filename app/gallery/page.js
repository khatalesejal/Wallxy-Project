'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import toast, { Toaster } from "react-hot-toast";

export default function Gallery() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    async function fetchCatalogs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/catalog/all');
        console.log("response--",res) // Your backend endpoint
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setCatalogs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load catalogs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading catalogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
        <Navbar />
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Gallery Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-lg text-gray-600">Browse through all your catalogs</p>
        </div>

        {/* Catalogs Section */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md p-6">

          {catalogs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center text-center p-16 min-h-[400px]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100">
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-3xl font-bold text-indigo-700">
                No Catalogs Available
              </h3>
              <p className="mt-3 text-gray-600 text-lg max-w-md">
                No catalogs have been shared yet. Check back later or create your own in the dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalogs.map((catalog, index) => {
                console.log("catalog data:", catalog);
               
                const pdfFileName = catalog?.file?.filename || "Untitled PDF";
                const pdfUrl = catalog?.file?.fileUrl;

                return (
                  <div
                    key={catalog._id || `catalog-${index}`}
                    className="relative group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-80"
                  >
                    {/* PDF Preview - Full Card Coverage */}
                    <div className="relative flex-1 w-full bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: 180 }}>
                      {pdfUrl && /\.pdf$/i.test(pdfUrl) ? (
                        <iframe
                          src={pdfUrl + "#toolbar=0&navpanes=0&view=FitH"}
                          title={catalog.title || "PDF Preview"}
                          className="w-full h-full"
                          style={{
                            border: 'none',
                            width: '100%',
                            height: '100%',
                            minHeight: 180,
                            pointerEvents: 'auto',
                            transform: 'none',
                            backgroundColor: 'transparent',
                          }}
                          scrolling="yes"
                          onError={(e) => {
                            console.error("Iframe load failed for", pdfUrl, e);
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
                              console.log("Opening PDF:", pdfUrl);
                              if (pdfUrl) {
                                window.open(pdfUrl, "_blank");
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
                              console.log("Downloading PDF:", pdfUrl, pdfFileName);
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
                              console.log("Copying PDF link:", pdfUrl);
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
