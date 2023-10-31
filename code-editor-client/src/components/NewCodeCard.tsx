import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";
import { EditorView } from "@codemirror/view";
import CodeCardEditor from "./CodeCardEditor";
import { useState, useRef } from "react";

// type CodeCardType = {
//   id: number;
//   title: string;
//   code: string;
//   appendEditorContent: Function;
// };

const NewCodeCard = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [cardCode, setCardCode] = useState("");
  const [cardTitle, setCardTitle] = useState("Untitled");
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleSaveClick = () => {
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      setCardCode(currentContent);
    }
    setIsEditing((prevState) => !prevState);

    // somehow send the new info up to codeCards state (code and title)
  };

  return (
    <Card
      bgColor='gray.800'
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      // FIX THIS ID LATER
      id={String("test")}
      minHeight='400px'
    >
      <CardHeader textAlign='center'>
        <Heading size='md' color='gray.100'>
          {cardTitle}
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
          <CodeCardEditor
            editorViewRef={editorViewRef}
            code={cardCode}
            isEditMode={isEditing}
          />
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
            // onClick={() => appendEditorContent(cardCode)}
          >
            Save Snippet
          </Button>
          <Button
            borderRadius='15'
            color='white'
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='blue.700'
            _hover={{ bg: "blue.900" }}
            // onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            Cancel
            {/* {isEditing ? "Save Snippet" : "Edit Snippet"} */}
          </Button>
          {/* <Button
            borderRadius='15'
            color='white'
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='blue.700'
            _hover={{ bg: "blue.900" }}
          >
            Delete Snippet
          </Button> */}
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default NewCodeCard;
