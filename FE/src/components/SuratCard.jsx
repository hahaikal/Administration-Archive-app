import { useState } from 'react';
import { File, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SuratCard = ({ surat, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAdmin } = useAuth();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak valid';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const handleDownload = () => {
    window.open(surat.file_url, '_blank');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{surat.title.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</h3>
            <p className="text-sm text-gray-600 mb-2">{surat.number}</p>
          </div>
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleDownload}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    Unduh Dokumen
                  </button>
                  <a
                    href={surat.fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center"
                  >
                    <Eye size={16} className="mr-2" />
                    Lihat Dokumen
                  </a>
                  {isAdmin() && onDelete && (
                    <button
                      onClick={() => onDelete(surat._id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            surat.type === 'in' ? 'bg-blue-100 text-blue-800' : 
            surat.type === 'out' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {surat.type}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
            {surat.category}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            {formatDate(surat.date)}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
        <div className="flex items-center">
          <File size={16} className="text-gray-500" />
          <span className="text-xs text-gray-500 ml-1">PDF</span>
        </div>
      </div>
    </div>
  );
};

export default SuratCard;
