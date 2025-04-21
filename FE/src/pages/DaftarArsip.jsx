import { useState, useEffect } from 'react';
import suratService from '../services/suratService';
import SuratCard from '../components/SuratCard';
import { Search } from 'lucide-react';

const DaftarArsip = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (typeFilter) params.type = typeFilter;
        if (dateFilter) params.date = dateFilter;

        const data = await suratService.getAll(params);
        const { suratByJenis } = await suratService.getStatistics();
        setCategories(Object.keys(suratByJenis));
        setDocuments(data.data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [searchTerm, categoryFilter, typeFilter, dateFilter]);

  return (
    <div className="container mx-auto ">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Daftar Arsip Dokumen</h1>
            <p className="text-sm text-gray-600">Kelola Sistem Pengarsipan</p>
          </div>
        </div>
        
        <div className="p-6 ">
          <div className="mb-4 flex justify-end mt-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block mr-2 pl-3 pr-1 py-1 border border-gray-300 rounded-md leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Jenis Surat</option>
              {Array.isArray(categories) ? categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )) : null}
            </select>
            
            <label
              htmlFor="input-date"
              className="cursor-pointer flex items-center border border-gray-300 rounded-md px-3 py-1 bg-white"
              onClick={() => {
                const input = document.getElementById('input-date');
                if (input) {
                  input.showPicker?.() || input.focus();
                }
              }}
            >
              <input
                id="input-date"
                name="input-date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 border-none p-0 m-0 leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm appearance-none"
              />
            </label>
          </div>

          <div className="mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari dokumen berdasarkan nomor atau judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <SuratCard key={doc._id ?? index} surat={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Tidak ada dokumen yang ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarArsip;

