import { cards } from "../mockData/mockCards";
import CodeCard from "../components/CodeCard";

const fetchCards = (appendEditorContent: Function) => {
  const results = [];

  for (let card of cards) {
    results.push(
      <CodeCard
        id={card.id}
        heading={card.heading}
        code={card.code}
        appendEditorContent={appendEditorContent}
      />
    );
  }
  return results;
};

export default fetchCards;
