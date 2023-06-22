import axios from 'axios';
import queryString from 'query-string';
import { ResidentialUserInterface, ResidentialUserGetQueryInterface } from 'interfaces/residential-user';
import { GetQueryInterface } from '../../interfaces';

export const getResidentialUsers = async (query?: ResidentialUserGetQueryInterface) => {
  const response = await axios.get(`/api/residential-users${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createResidentialUser = async (residentialUser: ResidentialUserInterface) => {
  const response = await axios.post('/api/residential-users', residentialUser);
  return response.data;
};

export const updateResidentialUserById = async (id: string, residentialUser: ResidentialUserInterface) => {
  const response = await axios.put(`/api/residential-users/${id}`, residentialUser);
  return response.data;
};

export const getResidentialUserById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/residential-users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteResidentialUserById = async (id: string) => {
  const response = await axios.delete(`/api/residential-users/${id}`);
  return response.data;
};
