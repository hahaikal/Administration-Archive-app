import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

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
        const response = await api.get(`/${filePath}`, { responseType: 'blob' });
        const contentType = response.headers['content-type'];
        setFileType(contentType);
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (err) {
        setError(err.message);
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
          onClick={() => window.history.back()}
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
          onClick={() => window.history.back()}
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
          onClick={() => window.history.back()}
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
