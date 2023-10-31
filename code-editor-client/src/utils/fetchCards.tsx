import { cards } from "../mockData/mockCards";
import CodeCard from "../components/CodeCard";

const fetchCards = (
  appendEditorContent: Function,
  replaceEditorContent: Function
) => {
  const results = [];

  for (let card of cards) {
    results.push(
      <CodeCard
        id={card.id}
        title={card.title}
        code={card.code}
        appendEditorContent={appendEditorContent}
        replaceEditorContent={replaceEditorContent}
      />
    );
  }
  return results;
};

export default fetchCards;
