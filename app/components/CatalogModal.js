
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
    fileUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});



  useEffect(() => {
    console.log("CatalogModal useEffect - editCatalog:", editCatalog);
    
    if (editCatalog) {
      console.log("Setting up edit mode with catalog:", editCatalog);
      // Map the editCatalog data to our form structure
      setCatalog({
        name: editCatalog.catalogName || editCatalog.title || '',
        description: editCatalog.description || '',
        file: null, 
        preview: '',
        fileUrl: editCatalog.fileUrl || '' 
      });
    } else {
      console.log("Setting up create mode");
      setCatalog({ name: '', description: '', file: null, preview: '', fileUrl: '' });
    }
  }, [editCatalog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCatalog((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
   if (!catalog.name.trim()) {
    setErrors({ name: 'Catalog name is required' });
     return;
  } else {
  setErrors({}); 
}

    
    // For new catalogs, file is required
    if (!editCatalog && !catalog.file) {
      toast.error('Please upload a PDF file');
      return;
    }
    
    // For editing, if no new file is selected, we'll use existing fileUrl
    if (editCatalog && !catalog.file && !catalog.fileUrl) {
      toast.error('Please upload a PDF file');
      return;
    }

    setLoading(true);
    
    try {
      let fileUrl = catalog.fileUrl; // Use existing fileUrl for edits
      
      // If a new file is selected, upload it first
      if (catalog.file) {
        console.log('Uploading file:', catalog.file.name);
        
        const formData = new FormData();
        formData.append('file', catalog.file);
        formData.append('catalogName', catalog.name);
        formData.append('description', catalog.description || '');
        formData.append('catalog', 'true');

        console.log('FormData prepared, sending to /api/files/upload');

        const uploadResponse = await fetch('/api/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        console.log('Upload response status:', uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload failed with response:', errorText);
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Failed to parse error response as JSON:', e);
            throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
          }
          throw new Error(errorData.error || errorData.details || 'File upload failed');
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload successful, response:', uploadData);
        
        // The upload API returns the file data in uploadData.file
        if (!uploadData.file || !uploadData.file.fileUrl) {
          console.error('Invalid upload response structure:', uploadData);
          throw new Error('Upload response missing file URL');
        }
        
        fileUrl = uploadData.file.fileUrl;
        console.log('File URL extracted:', fileUrl);
      }

      // Now create or update the catalog
      let catalogResponse;
      
      if (editCatalog) {
        // Update existing catalog
        console.log("id", editCatalog._id)
        catalogResponse = await fetch(`/api/catalog/${editCatalog._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: catalog.name,
            description: catalog.description || '',
            fileUrl: fileUrl
            
          })
        });
      } else {
        // Create new catalog
        catalogResponse = await fetch('/api/catalog/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: catalog.name,
            description: catalog.description || '',
            fileUrl: fileUrl,
            filename: catalog.file ? catalog.file.name : (editCatalog?.file?.filename || 'document.pdf')
          })
        });
      }

      if (!catalogResponse.ok) {
        const errorData = await catalogResponse.json();
        throw new Error(errorData.error || 'Catalog operation failed');
      }

      const catalogData = await catalogResponse.json();
      
      toast.success(editCatalog ? 'Catalog updated successfully!' : 'Catalog created successfully!');
      
      // Call the parent's onSubmit with the result
      onSubmit(catalogData);
      
      // Reset form
      setCatalog({ name: '', description: '', file: null, preview: '', fileUrl: '' });
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
                
              />
              {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
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
                Upload PDF File {!editCatalog && <span className="text-red-500">*</span>}
                {editCatalog && <span className="text-gray-400">(leave empty to keep current file)</span>}
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
              />
              {editCatalog && !catalog.file && (
                <p className="mt-2 text-xs text-gray-500">
                  Current file: {editCatalog.catalogName || 'Existing PDF'}
                </p>
              )}
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
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg shadow transition flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Processing...' : (editCatalog ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}