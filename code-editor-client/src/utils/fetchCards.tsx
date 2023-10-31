import { cards } from "../mockData/mockCards";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";

const fetchCards = (appendEditorContent: Function) => {
  const results = [];

  for (let card of cards) {
    results.push(
      <Card
        bgColor='gray.800'
        pl='2'
        pr='2'
        minH='300px'
        align='center'
        id={String(card.id)}
      >
        <CardHeader textAlign='center'>
          <Heading size='md' color='gray.100'>
            {card.heading}
          </Heading>
        </CardHeader>
        <CardBody
          bg='#232D3F'
          border='2px'
          borderRadius='10'
          borderColor='black'
          color='white'
          w='90%'
        >
          {card.code}
        </CardBody>
        <CardFooter p={2}>
          <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
            <Button
              borderRadius='15'
              color='white'
              whiteSpace='normal'
              overflow='hidden'
              w='49%'
              bgColor='blue.700'
              _hover={{ bg: "blue.900" }}
              onClick={() => appendEditorContent(card.code)}
            >
              Insert Into Editor
            </Button>
            <Button
              borderRadius='15'
              color='white'
              whiteSpace='normal'
              overflow='hidden'
              w='49%'
              bgColor='blue.700'
              _hover={{ bg: "blue.900" }}
            >
              Delete Snippet
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    );
  }
  return results;
};

export default fetchCards;
