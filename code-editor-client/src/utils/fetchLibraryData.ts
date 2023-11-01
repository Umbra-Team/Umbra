import { cards } from "../mockData/mockCards";
import CodeCard from "../components/LibrarySnippet";
import generateId from "./generateId";

export interface LibrarySnippetData {
  id: number;
  title: string;
  code: string;
}

export const fetchLibraryData = (): LibrarySnippetData[] =>
  // appendEditorContent: Function,
  // handleDeleteSnippet: Function
  {
    return cards.map((card) => {
      return {
        id: generateId(),
        title: card.title,
        code: card.code,
      };
    });

    // for (let card of cards) {
    //   card.id = generateId();
    //   results.push(
    //     <CodeCard
    //       id={card.id}
    //       title={card.title}
    //       code={card.code}
    //       appendEditorContent={appendEditorContent}
    //       handleDeleteSnippet={handleDeleteSnippet}
    //     />
    //   );
    // }
    // return results;
  };
