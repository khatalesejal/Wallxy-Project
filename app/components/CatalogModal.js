'use client';

import { useState, useEffect } from 'react';

export default function CatalogModal({
  show,
  onClose,
  onSubmit,
  editCatalog,
}) {
  const [catalog, setCatalog] = useState({
    name: '',
    description: '',
    file: null,
    preview: '',
  });


  useEffect(() => {
    if (editCatalog) {
      setCatalog(editCatalog);
    } else {
      setCatalog({ name: '', description: '', file: null, preview: '' });
    }
  }, [editCatalog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCatalog((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type === 'application/pdf') {
  //     const previewURL = URL.createObjectURL(file);
  //     setCatalog((prev) => ({ ...prev, file, preview: previewURL }));
  //   } else {
  //     alert('Please upload a valid PDF file.');
  //   }
  // };

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== 'application/pdf') {
    alert('Only PDF files are allowed!');
    e.target.value = null; 
    setCatalog((prev) => ({ ...prev, file: null, preview: '' }));
    return;
  }

  const previewURL = URL.createObjectURL(file);
  setCatalog((prev) => ({ ...prev, file: file, preview: previewURL }));
};

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!catalog.name.trim() || !catalog.file) {
      alert('Please fill all required fields and upload a PDF.');
      return;
    }
    onSubmit(catalog);
    setCatalog({ name: '', description: '', file: null, preview: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-indigo-700">
              {editCatalog ? 'Edit Catalog' : 'Create New Catalog'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catalog Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={catalog.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="description"
                value={catalog.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Describe your catalog..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
              />
              {/* {catalog.preview && (
                <div className="mt-3">
                  <iframe
                    src={catalog.preview}
                    className="w-full h-60 border border-gray-300 rounded-lg"
                    title="PDF Preview"
                  ></iframe>
                </div>
              )} */}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition"
              >
                {editCatalog ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
