import axios from 'axios';
const baseUrl = `/api`;
import { Snippet } from '../types/types';

const tokenToHeader = (token: string) => {
  return { Authorization: `Bearer ${token}` };
}

export const getAllUserFiles = async (cognitoClientToken: string): Promise<Snippet[]> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };
  
  const response = await axios.get(`${baseUrl}/files`, config);
  return response.data as Snippet[];
};