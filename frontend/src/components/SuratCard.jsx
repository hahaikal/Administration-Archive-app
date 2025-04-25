
import suratService from '../services/suratService';
import { useState, useRef, useEffect } from 'react';
import { File, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ConfirmPopUp, AlertPopUp} from './PopUp';

const SuratCard = ({ surat, onDeleteSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAdmin } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const confirmDelete = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      await suratService.delete(deleteId);
      setAlertMessage('Surat berhasil dihapus!');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Gagal menghapus surat: ' + (error.message || error));
      setShowAlert(true);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    if (onDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleDelete = (id) => {
    if (deleting) return;
    setDeleteId(id);
    setShowConfirm(true);
  };


  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{surat.title.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</h3>
            <p className="text-sm text-gray-600 mb-2">{surat.number}</p>
          </div>
          <div className="relative">
            <button 
              ref={buttonRef}
              onClick={toggleDropdown}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>
            
            {showDropdown && (
              <div ref={dropdownRef} className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <Link
                    to={`/viewpdf?fileurl=${surat.fileUrl}`}
                    className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center"
                  >
                    <Eye size={16} className="mr-2" />
                    Lihat
                  </Link>
                  {isAdmin() && (
                    <button
                      onClick={() => handleDelete(surat._id)}
                      disabled={deleting}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {deleting ? 'Menghapus...' : 'Hapus'}
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
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-cyan-800 ms-2`}>
            {surat.category}
          </span>
        </div>
          <span className="text-xs text-gray-500 ml-2">
            {formatDate(surat.date)}
          </span>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
        <div className="flex items-center">
          <File size={16} className="text-gray-500" />
          <span className="text-xs text-gray-500 ml-1">PDF</span>
        </div>
      </div>
    </div>

    {showConfirm && (
      <ConfirmPopUp
        message="Apakah Anda yakin ingin menghapus surat ini?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    )}
    
    {showAlert && (
      <AlertPopUp
        message={alertMessage}
        onClose={handleAlertClose}
      />
    )}
    </>
  );
};

export default SuratCard;
