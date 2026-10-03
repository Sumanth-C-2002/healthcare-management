import api from './client.js';

export const authApi = {
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload),
};

export const patientApi = {
  getProfile: () => api.get('/api/patient/profile'),
  updateProfile: (payload) => api.put('/api/patient/profile', payload),
  getAppointments: () => api.get('/api/patient/appointments'),
  bookAppointment: (payload) => api.post('/api/patient/appointments', payload),
  cancelAppointment: (id) => api.put(`/api/patient/appointments/${id}/cancel`),
  getRecords: () => api.get('/api/patient/records'),
  downloadRecord: (id) => api.get(`/api/patient/records/${id}/download`, { responseType: 'blob' }),
};

export const doctorApi = {
  list: (specialization) =>
    api.get('/api/doctors', { params: specialization ? { specialization } : {} }),
  get: (id) => api.get(`/api/doctors/${id}`),
};

export const adminApi = {
  getDoctors: () => api.get('/api/admin/doctors'),
  addDoctor: (payload) => api.post('/api/admin/doctors', payload),
  updateDoctor: (id, payload) => api.put(`/api/admin/doctors/${id}`, payload),
  updateDoctorStatus: (id, status) => api.put(`/api/admin/doctors/${id}/status`, { status }),
  getAppointments: (status) =>
    api.get('/api/admin/appointments', { params: status ? { status } : {} }),
  updateAppointmentStatus: (id, payload) => api.put(`/api/admin/appointments/${id}/status`, payload),
  getRecords: (patientId) =>
    api.get('/api/admin/records', { params: patientId ? { patientId } : {} }),
  addRecord: (formData) => api.post('/api/admin/records', formData),
  getUsers: () => api.get('/api/admin/users'),
  updateUserStatus: (id, status) => api.put(`/api/admin/users/${id}/status`, { status }),
};