"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import CatalogModal from "../components/CatalogModal";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track open dropdown
  const dropdownRef = useRef(null); // Reference for dropdown

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const handleEdit = (id) => {
    const catalogToEdit = catalogs.find((c) => c.id === id);
    if (!catalogToEdit) return;
    setEditId(id);
    setOpenDropdownId(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this catalog?")) {
      setCatalogs(catalogs.filter((c) => c.id !== id));
    }
    setOpenDropdownId(null);
  };

  const handleSubmit = (catalogData) => {
    if (editId !== null) {
      setCatalogs(
        catalogs.map((c) =>
          c.id === editId ? { ...catalogData, id: editId } : c
        )
      );
    } else {
      const newId =
        (catalogs.length ? Math.max(...catalogs.map((c) => c.id)) : 0) + 1;
      setCatalogs([...catalogs, { ...catalogData, id: newId }]);
    }
    closeModal();
  };
  const handleDownload = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name || "catalog.pdf";
    a.click();
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 pt-28 px-6 pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Catalogs
          </h2>

          {catalogs.length === 0 ? (
            <div
              onClick={openModal}
              className="group relative bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-16 min-h-[300px]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-600"
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
              <h3 className="mt-5 text-2xl font-semibold text-indigo-700">
                Create Your First Catalog
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Start by uploading your first PDF catalog
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {catalogs.map((catalog) => {
                console.log("catalog", catalog);
                return (
                  <div
                    key={catalog.id}
                    className="relative group bg-gradient-to-br from-white to-blue-50 border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Dropdown Menu */}
                    <div className="absolute top-2 right-2" ref={dropdownRef}>
                      <button
                        onClick={() => toggleDropdown(catalog.id)}
                        className="flex items-center text-gray-400 hover:text-indigo-500 transition cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {openDropdownId === catalog.id && (
                        <div className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-20">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() => handleEdit(catalog.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(catalog.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Catalog Card */}
                    <button
                      type="button"
                      onClick={() => window.open(catalog.preview, "_blank")}
                      className="block w-full text-left focus:outline-none"
                    >
                      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                        {/* ✅ PDF Preview */}
                        {catalog.file &&
                        (/pdf/i.test(catalog.file.type || "") ||
                          /\.pdf$/i.test(
                            catalog.preview || catalog.name || ""
                          )) ? (
                          <div className="w-full h-64 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            <iframe
                              src={`${catalog.preview}#toolbar=0&navpanes=0&scrollbar=0`}
                              title={catalog.name || "PDF Preview"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                            No preview available
                          </div>
                        )}

                        {/* ✅ File Name & Description */}
                        {/* <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                        {catalog.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {catalog.description || "No description"}
                      </p> */}
                      </div>

                      <div className="px-4 py-3 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 uppercase font-medium">
                            {(
                              catalog.preview?.split(".").pop() || ""
                            ).toString()}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* <div
                      className="absolute inset-x-0 bottom-10 flex items-center justify-center gap-2 
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0"
                    >
                      <button
                        onClick={() => {
                          window.open(file.fileUrl, "_blank");
                          handleLog("view", { url: file.fileUrl });
                        }}
                        className="p-1.5 rounded-xl bg-white/95 hover:bg-white shadow-lg border border-white/50 text-gray-700 hover:text-indigo-600 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                        aria-label="Preview file"
                      >
                        E{" "}
                      </button>
                      <button
                        onClick={() =>
                          downloadFile(file.fileUrl, file.fileName)
                        }
                        className="p-1.5 rounded-xl bg-white/95 hover:bg-white shadow-lg border border-white/50 text-gray-700 hover:text-green-600 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                        aria-label="Download file"
                      >
                        D{" "}
                      </button>
                      <button
                        className="p-1.5 rounded-xl bg-white/95 hover:bg-white shadow-lg border border-white/50 text-gray-700 hover:text-purple-600 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                        aria-label="Copy link"
                      >
                        C{" "}
                      </button>
                    </div> */}

                     <div className="flex justify-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {/* 👁 View */}
                      <button
                        onClick={() => window.open(catalog.preview, "_blank")}
                        className="p-2 rounded-full bg-white shadow-md hover:bg-indigo-50 text-indigo-600 hover:scale-110 transition"
                        title="View PDF"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {/* ⬇️ Download */}
                      <button
                        onClick={() =>
                          handleDownload(catalog.preview, catalog.name)
                        }
                        className="p-2 rounded-full bg-white shadow-md hover:bg-green-50 text-green-600 hover:scale-110 transition"
                        title="Download PDF"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                      </button>

                      {/* 📋 Copy */}
                      <button
                        onClick={() => handleCopyLink(catalog.preview)}
                        className="p-2 rounded-full bg-white shadow-md hover:bg-purple-50 text-purple-600 hover:scale-110 transition"
                        title="Copy PDF Link"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 10h2a2 2 0 002-2v-8a2 2 0 00-2-2h-2m-8 8h8"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Catalog Card */}
              <div
                onClick={openModal}
                className="group relative bg-white/70 backdrop-blur-lg rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-600"
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
                <h3 className="mt-4 text-lg font-medium text-indigo-700">
                  Create New Catalog
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click to add another catalog
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
        editCatalog={
          editId !== null ? catalogs.find((c) => c.id === editId) : null
        }
      />
    </div>
  );
}
