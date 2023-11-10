import axios from "axios";
const baseUrl = `/api`;
import { Snippet } from "../types/types";

const tokenToHeader = (token: string) => {
  return { Authorization: `Bearer ${token}` };
};

export const getAllUserSnippets = async (
  cognitoClientToken: string
): Promise<Snippet[]> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };

  const response = await axios.get(`${baseUrl}/snippets`, config);
  console.log(
    `In snippets.ts, getAllUserSnippets is returning ${JSON.stringify(response.data)} for data`
  );
  return response.data as Snippet[];
};

// not sure if we need this
export const getSnippet = async (
  cognitoClientToken: string,
  snippetId: number
): Promise<Snippet> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };

  const response = await axios.get(`${baseUrl}/snippets${snippetId}`, config);
  return response.data as Snippet;
};

export const createSnippet = async (
  cognitoClientToken: string,
  title: string,
  code: string,
  language: string,
): Promise<Snippet> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };
  const response = await axios.post(
    `${baseUrl}/snippets`,
    { title, code, language },
    config
  );
  return response.data as Snippet;
};

// await Snippet.update(req.body)

export const editSnippet = async (
  cognitoClientToken: string,
  id: number,
  newTitle: string,
  newCode: string,
  newLanguage: string,
): Promise<Snippet> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };
  const response = await axios.patch(
    `${baseUrl}/snippets/${id}`,
    { title: newTitle, code: newCode, language: newLanguage },
    config
  );
  return response.data as Snippet;
};

// not sure what the delete route will ultimately return, for now having it return all snippets
export const deleteSnippet = async (
  cognitoClientToken: string,
  snippetId: number
): Promise<number> => {
  const config = {
    headers: tokenToHeader(cognitoClientToken),
  };

  const response = await axios.delete(
    `${baseUrl}/snippets/${snippetId}`,
    config
  );
  return response.status;
};
