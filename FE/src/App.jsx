import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadSurat from './pages/UploadSurat';
import ManajemenUser from './pages/ManajemenUser';
import NotFound from './pages/NotFound';
import DaftarArsip from './pages/DaftarArsip';
import ViewPDF from './pages/ViewPDF';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="upload" element={<UploadSurat />} />
        <Route path="users" element={<ManajemenUser />} />
        <Route path="arsip" element={<DaftarArsip />} />
        <Route path="viewpdf" element={<ViewPDF />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;