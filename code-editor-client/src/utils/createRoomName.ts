import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const createRandomRoomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    style: "capital",
    separator: "",
    length: 3,
  });
};

export default createRandomRoomName;
