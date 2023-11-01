import { cards } from "../mockData/mockCards";
import generateId from "./generateId";

export interface LibrarySnippetData {
  id: number;
  title: string;
  code: string;
}

export const fetchLibraryData = (): LibrarySnippetData[] => {
  return cards.map((card) => {
    return {
      id: generateId(),
      title: card.title,
      code: card.code,
    };
  });
};
