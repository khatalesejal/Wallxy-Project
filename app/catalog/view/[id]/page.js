'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

const ViewCatalogPage = () => {
  const router = useRouter();
  const params = useParams();
  const [catalog, setCatalog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`/api/catalog/share/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setCatalog(data.catalog);
          // Ensure we have the full URL for the PDF
          if (data.catalog.file?.fileUrl) {
            const fullPdfUrl = data.catalog.file.fileUrl.startsWith('http')
              ? data.catalog.file.fileUrl
              : `${window.location.origin}${data.catalog.file.fileUrl}`;
            setPdfUrl(fullPdfUrl);
          }
        } else {
          throw new Error(data.error || 'Failed to load catalog');
        }
      } catch (error) {
        console.error('Error fetching catalog:', error);
        toast.error('Failed to load catalog');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchCatalog();
    }
  }, [params?.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Catalog not found</h1>
          <p className="mt-2 text-gray-600">The requested catalog could not be found or you dont have permission to view it.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header with Catalog Info */}
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{catalog.title || 'Catalog'}</h1>
                {catalog.description && (
                  <p className="mt-2 text-indigo-100 max-w-3xl">{catalog.description}</p>
                )}
              </div>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
          
          {/* PDF Viewer Section */}
          <div className="p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {pdfUrl ? (
                <div className="flex flex-col h-[calc(100vh-250px)]">
                  {/* PDF Viewer Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">{catalog.file?.filename || 'Document'}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(catalog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(pdfUrl, '_blank')}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        title="Open in new tab"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      <a
                        href={pdfUrl}
                        download={catalog.file?.filename || 'catalog.pdf'}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        title="Download"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* PDF Container */}
                  <div className="flex-1 bg-gray-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="w-full max-w-4xl h-full flex items-center justify-center bg-white shadow-sm">
                        <iframe
                          src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH&zoom=fit`}
                          className="w-full h-full border-0"
                          style={{
                            aspectRatio: '1/1.4142', // A4 aspect ratio (1:√2)
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }}
                          frameBorder="0"
                          allowFullScreen
                          title={`PDF Viewer - ${catalog.title || 'Catalog'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center min-h-[50vh]">
                  <div className="p-4 bg-indigo-50 rounded-full mb-4">
                    <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No document available</h3>
                  <p className="mt-2 text-gray-500 max-w-md">
                    This catalog doesnt have a document attached or the file could not be loaded.
                  </p>
                </div>
              )}
            </div>
            
            {/* File Info */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                {catalog.file?.filename && (
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
                    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {catalog.file.filename}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {catalog.file?.filename?.split('.').pop()?.toUpperCase()} • {catalog.file?.size ? 
                  `${Math.round(catalog.file.size / 1024)} KB` : 'PDF Document'}
              </div>
            </div>
          </div>
          
          {/* Catalog Details */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Created on: {new Date(catalog.createdAt).toLocaleDateString()}</span>
              </div>
              {catalog.owner && (
                <div className="flex items-center space-x-1">
                  <span>Shared by:</span>
                  <span className="font-medium text-indigo-600">{catalog.owner.username || catalog.owner.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCatalogPage;
