import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Upload, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  School
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      allowedRoles: ['admin', 'guru', 'kepala_sekolah'],
    },
    {
      name: 'Upload Arsip',
      path: '/upload',
      icon: <Upload size={20} />,
      allowedRoles: ['admin', 'guru'],
    },
    {
      name: 'Daftar Arsip',
      path: '/dokumen',
      icon: <FileText size={20} />,
      allowedRoles: ['admin', 'guru', 'kepala_sekolah'],
    },
    {
      name: 'Manajemen User',
      path: '/users',
      icon: <Users size={20} />,
      allowedRoles: ['admin'],
    },
    {
      name: 'Pengaturan',
      path: '/settings',
      icon: <Settings size={20} />,
      allowedRoles: ['admin'],
    },
  ];

  return (
    <aside className={`bg-white shadow-md transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'} h-screen z-20 fixed md:relative`}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <School className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-800">SIPAS</h1>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center w-full">
              <School className="h-8 w-8 text-primary-600" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              (item.allowedRoles.includes('admin') && isAdmin()) || 
              !item.path.includes('users') ? (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150
                  `}
                >
                  <div className="mr-3 flex-shrink-0">{item.icon}</div>
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              ) : null
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center md:justify-start p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={20} />
                <span className="ml-2 text-sm font-medium">Ciutkan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;