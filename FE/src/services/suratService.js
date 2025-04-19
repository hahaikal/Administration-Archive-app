import api from './api';

const suratService = {
  getAll: async (filters = {}) => {
    const response = await api.get('getAllDoc', { params: filters });
    return response.data;
  },

  // Get a specific surat by id
  getById: async (id) => {
    const response = await api.get(`/surat/${id}`);
    return response.data;
  },

  // Create a new surat
  create: async (formData) => {
    const response = await api.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update an existing surat
  update: async (id, formData) => {
    const response = await api.put(`/surat/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete a surat
  delete: async (id) => {
    const response = await api.delete(`/surat/${id}`);
    return response.data;
  },

  // Get document statistics
  getStatistics: async () => {
    const response = {
      data: {
        totalSurat: 100,
        totalUsers: 50,
        suratToday: 30,
        suratByJenis: ['keluar', 'masuk', 'disposisi']
      }
    }
    return response.data;
  }
};

export default suratService;
