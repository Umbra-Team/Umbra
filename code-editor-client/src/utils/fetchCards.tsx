import { cards } from "../mockData/mockCards";
import CodeCard from "../components/CodeCard";
import generateId from "./generateId";

const fetchCards = (
  appendEditorContent: Function,
  handleDeleteSnippet: Function
) => {
  const results = [];

  for (let card of cards) {
    card.id = generateId();
    results.push(
      <CodeCard
        id={card.id}
        title={card.title}
        code={card.code}
        appendEditorContent={appendEditorContent}
        handleDeleteSnippet={handleDeleteSnippet}
      />
    );
  }
  return results;
};

export default fetchCards;
