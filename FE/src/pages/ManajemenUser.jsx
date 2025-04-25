import { useState, useEffect } from 'react';
import api from '../services/api';
import { PopUp, ConfirmPopUp, AlertPopUp } from '../components/PopUp';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  AlertCircle, 
  Check,
  X,
  User
} from 'lucide-react';

const ManajemenUser = () => {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('guru');
  const [responseMsg, setResponseMsg] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const handleAddUser = () => {
    setModalMode('add');
    setCurrentUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setNumberPhone(user.phone);
    setPassword('');
    setRole(user.role);
    setShowModal(true);
  };

  const resetForm = () => {
    setName('');
    setNumberPhone('');
    setPassword('');
    setConfirmPassword('');
    setRole('guru');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);
      
      if (modalMode === 'add') {
        if (!name || !email || !password || !numberPhone) {
          setError('Semua kolom harus diisi');
          setIsSubmitting(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Password tidak cocok');
          setIsSubmitting(false);
          return;
        }

        const response = await api.post('register', {
          name,
          email,
          password,
          role,
          numberPhone
        });
        
        setResponseMsg(response.data.message);
        
      } else if (modalMode === 'edit' && currentUser) {
        const userData = {
          name,
          email,
          role,
          numberPhone
        };
        
        if (password) {
          userData.password = password;
        }
        
        const response = await api.put(`admin/users/${currentUser._id}`, userData);
        
        setUsers(users.map(user => 
          user._id === currentUser._id ? response.data.user : user
        ));
        
        setSuccess('Pengguna berhasil diperbarui');
      }
      
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting user:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Terjadi kesalahan, silakan coba lagi');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      const response = await api.post('verify-otp', { email, otp });
      setResponseMsg('User berhasil ditambahkan!');
      setShowAlert(true);
      setEmail('');
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete === user.id) {
      setError('Anda tidak dapat menghapus akun Anda sendiri');
      setShowConfirm(false);
      return;
    }
  
    try {
      await api.delete(`admin/users/${userToDelete}`);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setSuccess('Pengguna berhasil dihapus');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat menghapus pengguna');
      setTimeout(() => setError(''), 3000);
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setResponseMsg('');
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'guru':
        return 'Guru';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Manajemen Pengguna</h1>
            <p className="text-sm text-gray-600">Kelola pengguna sistem pengarsipan</p>
          </div>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center text-sm"
          >
            <UserPlus size={16} className="mr-2" />
            Tambah Pengguna
          </button>
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
            <span className="text-sm">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {responseMsg ? PopUp({ responseMsg, otp, setOtp, setResponseMsg, handleOtpSubmit }) : null}

        {showConfirm && (
          <ConfirmPopUp
            message="Apakah Anda yakin ingin menghapus pengguna ini?"
            onConfirm={confirmDeleteUser}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        {showAlert && (
          <AlertPopUp
            message={responseMsg}
            onClose={handleCloseAlert}
          />
        )}

        <div className="p-6">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">Tidak ada pengguna</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `Tidak ada pengguna yang cocok dengan pencarian "${searchTerm}"` 
                  : 'Belum ada pengguna yang terdaftar di sistem.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peran
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={(user.id || user._id) + '-' + index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'kepala_sekolah'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-800 mr-4"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id || user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === 'add' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <User size={32} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Masukkan nama"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Masukkan email"
                  />
                </div>

                <div>
                  <label htmlFor="numberPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="numberPhone"
                    value={numberPhone}
                    onChange={(e) => setNumberPhone(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Contoh 0822xxxxxxxx"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={modalMode === 'add'}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder={modalMode === 'add' ? "Masukkan password" : "Kosongkan jika tidak ingin diubah"}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={modalMode === 'add'}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder={modalMode === 'add' ? "Masukkan Konfirmasi password" : "Kosongkan jika tidak ingin diubah"}
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Peran <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="admin">Administrator</option>
                    <option value="guru">Guru</option>
                    <option value="kepala sekolah">Kepala Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isSubmitting ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {isSubmitting && modalMode === 'add' ? (
                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    modalMode === 'add' ? 'Tambah Pengguna' : 'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenUser;
