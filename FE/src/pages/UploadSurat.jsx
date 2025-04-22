import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import suratService from '../services/suratService';
import { Upload, AlertCircle, Check, X } from 'lucide-react';

const UploadSurat = () => {
  const [jenis, setJenis] = useState('out');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        setError('File harus berformat PDF');
        setFile(null);
        e.target.value = '';
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Ukuran file tidak boleh lebih dari 5MB');
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('File dokumen harus diunggah');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('type', jenis);
      formData.append('category', category);
      formData.append('file', file);

      await suratService.create(formData);
      
      setSuccess(true);
      setJenis('');
      setCategory('');
      setFile(null);
      
      setTimeout(() => {
        navigate('/arsip');
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Terjadi kesalahan saat mengunggah dokumen');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Upload Dokumen Baru</h1>
          <p className="text-sm text-gray-600">Lengkapi informasi dokumen yang akan diarsipkan</p>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 bg-green-50 text-green-700 p-3 rounded-md flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">Dokumen berhasil diunggah! Mengalihkan ke halaman dokumen...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">

            <div>
              <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Dokumen <span className="text-red-500">*</span>
              </label>
              <select
                id="jenis"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option key="keluar" value="out">Surat Keluar</option>
                <option key="masuk" value="in">Surat Masuk</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Dokumen <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option key="placeholder" value="">Pilih Kategori Dokumen</option>
                <option key="Surat_Undangan" value="Surat Undangan">Surat Undangan</option>
                <option key="Surat_Pengantar<" value="Surat Pengantar<">Surat Pengantar</option>
                <option key="Surat_Keputusan" value="Surat Keputusan">Surat Keputusan</option>
                <option key="Surat_Permohonan" value="Surat Permohonan">Surat Permohonan</option>
                <option key="Surat_Perjanjian" value="Surat Perjanjian">Surat Perjanjian</option>
                <option key="Surat_Keterangan" value="Surat Keterangan">Surat Keterangan</option>
                <option key="Surat_Pindah_Keluar" value="Surat Pindah Keluar">Surat Pindah Keluar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Dokumen (PDF) <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="file-upload"
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              >
                <div className="space-y-1 text-center w-full">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Upload file
                    </span>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF hingga 5MB</p>
                  {file && (
                    <p className="text-sm text-primary-600 font-medium">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                (isLoading || success) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </span>
              ) : (
                'Unggah Dokumen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSurat;
