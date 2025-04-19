import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import suratService from '../services/suratService';
import SuratCard from '../components/SuratCard';
import { FileText, Users, Clock, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [docsResponse, statsResponse] = await Promise.all([
          suratService.getAll({ limit: 6 }),
          suratService.getStatistics(),
        ]);
        setRecentDocuments(docsResponse.data);
        setStatistics(statsResponse);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Selamat datang, {user?.name}! Berikut adalah ringkasan sistem pengarsipan.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Dokumen</p>
              <h3 className="text-2xl font-bold text-gray-800">{statistics?.totalSurat || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pengguna</p>
              <h3 className="text-2xl font-bold text-gray-800">{statistics?.totalUsers || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Dokumen Hari Ini</p>
              <h3 className="text-2xl font-bold text-gray-800">{statistics?.suratToday || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BarChart3 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Jenis Dokumen</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {statistics?.suratByJenis ? Object.keys(statistics.suratByJenis).length : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Document distribution chart */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Distribusi Dokumen</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="flex space-x-6">
            {statistics?.suratByJenis && Object.entries(statistics.suratByJenis).map(([jenis, count]) => (
              <div key={jenis} className="flex flex-col items-center">
                <div className="text-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{jenis}</span>
                </div>
                <div className="relative w-24">
                  <div className="overflow-hidden h-40 bg-gray-200 rounded-t-lg">
                    <div 
                      className={`h-full rounded-t-lg ${
                        jenis === 'Masuk' ? 'bg-blue-500' : 
                        jenis === 'Keluar' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{
                        height: `${(count / (statistics.totalSurat || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Dokumen Terbaru</h2>
          <a href="/dokumen" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Lihat Semua
          </a>
        </div>
        
        {recentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDocuments.map((doc, index) => (
              <SuratCard key={doc.id ?? index} surat={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">Tidak ada dokumen</h3>
            <p className="text-gray-500">Belum ada dokumen yang diupload ke sistem.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
