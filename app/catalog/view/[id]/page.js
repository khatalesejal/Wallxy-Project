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
          if (data.catalog.fileUrl) {
            const fullPdfUrl = data.catalog.fileUrl.startsWith('http')
              ? data.catalog.fileUrl
              : `${window.location.origin}${data.catalog.fileUrl}`;
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
          <p className="mt-2 text-gray-600">The requested catalog could not be found or you don't have permission to view it.</p>
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
                <h1 className="text-3xl font-bold">{catalog.catalogName || 'Catalog'}</h1>
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
          <div className="p-4 md:p-8">
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              {pdfUrl ? (
                <div className="w-full h-[70vh]">
                  <iframe
                    src={`${pdfUrl}#view=fitH`}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={`PDF Viewer - ${catalog.catalogName || 'Catalog'}`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700">No PDF available</h3>
                  <p className="mt-1 text-gray-500">This catalog doesn't have a PDF file attached.</p>
                </div>
              )}
            </div>
            
            {/* Download Button */}
            {pdfUrl && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {catalog.fileName && (
                    <span>File: <span className="font-medium text-gray-700">{catalog.fileName}</span></span>
                  )}
                </div>
                <a
                  href={pdfUrl}
                  download={catalog.fileName || 'catalog.pdf'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </a>
              </div>
            )}
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
