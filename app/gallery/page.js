'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Gallery() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery catalog data with working PDF URLs
  const dummyCatalogs = [
   
    {
      id: 1,
      name: "BMW Lighting Catalog",
      description: "Complete BMW automotive lighting solutions",
      preview: "https://www.africau.edu/images/default/sample.pdf",
      file: { name: "bmw_lighting_catalog.pdf" }
    },
   
   
  ];

  useEffect(() => {
    // Load catalogs from localStorage
    const savedCatalogs = JSON.parse(localStorage.getItem('catalogs') || '[]');
    // Combine uploaded catalogs with dummy catalogs
    const allCatalogs = [...savedCatalogs, ...dummyCatalogs];
    setCatalogs(allCatalogs);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading catalogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
          <p className="text-lg text-gray-600">Browse through all your catalogs</p>
        </div>

        {catalogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No catalogs found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new catalog in the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogs.map((catalog) => {
              const name = (catalog?.file?.name ?? "").toString();
              
              return (
                <div 
                  key={catalog.id} 
                  className="relative group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-80"
                >
                  {/* PDF Preview - Full Card Coverage */}
                  <div 
                    className="relative flex-1 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
                    style={{ overflow: 'hidden', minHeight: '180px' }}
                  >
                    {catalog.preview ? (
                      <iframe
                        src={`${catalog.preview}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width&view=FitH`}
                        title={catalog.name || "PDF Preview"}
                        className="w-full h-full pointer-events-none"
                        style={{ 
                          border: 'none', 
                          overflow: 'hidden',
                          width: '120%',
                          height: '120%',
                          marginLeft: '-10%',
                          marginTop: '-10%',
                          transform: 'scale(0.85)'
                        }}
                        scrolling="no"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Catalog Info - Compact Design with Hover Overlay */}
                  <div className="relative p-4 flex-shrink-0">
                    {/* File Details - Normal State */}
                    <div className="group-hover:opacity-60 transition-all duration-300">
                      {/* File Name Badge - Fixed Width with 2 Lines */}
                      <div className="mb-3">
                        <div className="w-full">
                          <span className="inline-flex items-start text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-md font-medium border border-indigo-100 w-full break-words leading-relaxed">
                            <svg className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="line-clamp-2 leading-tight">
                              {name}
                            </span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Catalog Name */}
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">{catalog.name}</h3>
                      
                      {/* Description - More Compact */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
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
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = catalog.preview;
                            a.download = catalog.name || "catalog.pdf";
                            a.click();
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
                            navigator.clipboard.writeText(catalog.preview);
                            alert("Link copied to clipboard!");
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
      </main>
    </div>
  );
}
