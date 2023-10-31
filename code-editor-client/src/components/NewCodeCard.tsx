import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Flex,
  Input,
} from "@chakra-ui/react";
import { EditorView } from "@codemirror/view";
import CodeCardEditor from "./CodeCardEditor";
import { useState, useRef } from "react";
import generateId from "../utils/generateId";

type NewCodeCardProps = {
  handleAddSnippet: Function;
  handleCancel: React.MouseEventHandler<HTMLButtonElement>;
};

const NewCodeCard = ({ handleAddSnippet, handleCancel }: NewCodeCardProps) => {
  const [cardCode, setCardCode] = useState("");
  const [cardTitle, setCardTitle] = useState("Untitled");
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault;
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      handleAddSnippet(currentContent, cardTitle);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(event.target.value);
  };

  return (
    <Card
      bgColor='gray.800'
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      // FIX THIS ID LATER
      id={String(generateId())}
      minHeight='400px'
    >
      <CardHeader textAlign='center'>
        <Input
          size='md'
          color='gray.100'
          bg='azure'
          placeholder={cardTitle}
          _placeholder={{ color: "gray", fontWeight: "bold" }}
          textAlign='center'
          fontWeight='bold'
          onChange={handleTitleChange}
        />
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
            isEditMode={true}
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
            onClick={handleSaveClick}
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
            onClick={handleCancel}
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
