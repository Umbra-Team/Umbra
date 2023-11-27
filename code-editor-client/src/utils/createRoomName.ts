import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  names,
  starWars,
} from "unique-names-generator";

const createRandomRoomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, names],
    style: "capital",
    separator: "",
    length: 2,
  });
};

export default createRandomRoomName;
