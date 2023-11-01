import axios from 'axios';
const baseUrl = `/api`;
import { Snippet } from '../types/types';

let token = null;

const setToken = (newToken: string) => {
  token = `Bearer ${newToken}`;
};

const getAllUserFiles = async (): Promise<Snippet[]> => {
  const config = {
    headers: { Authorization: token },
  };
  
  const response = await axios.get(`${baseUrl}/users/files`, config);
  return response.data as Snippet[];

};