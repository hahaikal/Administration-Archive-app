import api from './api';
 
 const suratService = {
   getAll: async (filters = {}) => {
     const response = await api.get('/getAllDoc', { params: filters });
     return response.data;
   },
 
   getById: async (id) => {
     const response = await api.get(`/surat/${id}`);
     return response.data;
   },
 
   create: async (formData) => {
     const response = await api.post('/upload', formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     return response.data;
   },
 
   update: async (id, formData) => {
     const response = await api.put(`/surat/${id}`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     return response.data;
   },
 
   delete: async (id) => {
     const response = await api.delete(`/${id}`);
     return response.data;
   },
 
   getStatistics: async () => {
     const letterResponse = await api.get('/getAllDoc');
     const userResponse = await api.get('/admin/users');
     const letters = letterResponse.data.data;
 
     const suratByJenis = {};
     letters.forEach((letter) => {
       const category = letter.category || 'unknown';
       suratByJenis[category] = (suratByJenis[category] || 0) + 1;
     });
 
     const today = new Date();
     const suratToday = letters.filter((letter) => {
       const uploadDate = new Date(letter.createdAt);
       return (
         uploadDate.getDate() === today.getDate() &&
         uploadDate.getMonth() === today.getMonth() &&
         uploadDate.getFullYear() === today.getFullYear()
       );
     }).length;
 
     const response = {
       data: {
         totalSurat: letters.length,
         totalUsers: userResponse.data.length,
         suratToday,
         suratByJenis,
       }
     };
     return response.data;
   }
 };
 
 export default suratService;