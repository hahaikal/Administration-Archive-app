import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewPDF = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const filePath = queryParams.get('fileurl');

  useEffect(() => {
    if (!filePath) {
      setError('Tidak ada file yang dipilih.');
      setLoading(false);
      return;
    }

    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/${filePath}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        setFileType(contentType);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        setError(err.message);
        console.log(file)
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [filePath]);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PDF Viewer</h2>
        <p>Loading file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PDF Viewer</h2>
        <p>Error loading file: {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">PDF Viewer</h2>
        <p>Tidak ada file yang tersedia.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-xl font-semibold">PDF Viewer</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </header>
      {fileType && fileType.includes('image') ? (
        <img src={fileUrl} alt="Loaded content" className="flex-grow w-full object-contain" />
      ) : (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="flex-grow w-full"
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

export default ViewPDF;
