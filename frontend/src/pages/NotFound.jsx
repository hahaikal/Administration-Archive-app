import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <FileQuestion className="h-24 w-24 text-gray-400 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-medium text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default NotFound;