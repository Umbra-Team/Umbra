import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";
import CodeCardEditor from "./CodeCardEditor";
import { useState } from "react";

type CodeCardType = {
  id: number;
  heading: string;
  code: string;
  appendEditorContent: Function;
};

const CodeCard = ({ id, heading, code, appendEditorContent }: CodeCardType) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
    console.log("edit button was clicked");
    console.log(isEditing);
  };

  return (
    <Card
      bgColor='gray.800'
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      id={String(id)}
      minHeight='400px'
    >
      <CardHeader textAlign='center'>
        <Heading size='md' color='gray.100'>
          {heading}
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
        <CardBody>
          <CodeCardEditor code={code} isEditMode={isEditing} />
        </CardBody>
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
            onClick={() => appendEditorContent(code)}
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
            onClick={handleEditClick}
          >
            {isEditing ? "Save Snippet" : "Edit Snippet"}
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
};

export default CodeCard;
