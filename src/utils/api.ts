import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`);
  return response;
};

export const fetchProfileById = async (id:any) => {
  const response = await axios.get(`${API_URL}/profile/${id}`);
  return response.data;
};

export const deleteProfile = async (id: any) => {
  const response = await axios.delete(`${API_URL}/profile/${id}`);
  return response.data;
};

export const saveProfile = async (profile: any) => {
  if (profile.id) {
    const response = await axios.put(`${API_URL}/profile/${profile.id}`, profile);
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/profile`, profile);
    return response.data;
  }
};
