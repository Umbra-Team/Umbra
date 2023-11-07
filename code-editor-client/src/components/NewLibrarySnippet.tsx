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
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import { useState, useRef } from "react";

type NewLibrarySnippetProps = {
  handleAddSnippet: Function;
  handleCancel: React.MouseEventHandler<HTMLButtonElement>;
};

const NewLibrarySnippet = ({
  handleAddSnippet,
  handleCancel,
}: NewLibrarySnippetProps) => {
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("Untitled");
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault;
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      setSnippetCode(currentContent);
      handleAddSnippet(currentContent, snippetTitle);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippetTitle(event.target.value);
  };

  return (
    <Card
      bgColor='#FFF5AC'
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      id='new'
      minHeight='400px'
    >
      <CardHeader textAlign='center'>
        <Input
          border="1px solid lightgrey"
          width='60%'
          size='md'
          color='umbra.midnightGreen'
          bg='white'
          placeholder={snippetTitle}
          _placeholder={{ color: "gray", fontWeight: "bold" }}
          _hover={{ borderColor: "umbra.midnightGreen" }}
          textAlign='center'
          fontWeight='bold'
          onChange={handleTitleChange}
        />
      </CardHeader>
      <CardBody
        bg='#1e1e1e'
        border='2px'
        borderRadius='10'
        borderColor='black'
        color='white'
        w='90%'
      >
        <CardBody>
          <LibrarySnippetEditor
            editorViewRef={editorViewRef}
            code={snippetCode}
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
            bgColor='umbra.midnightGreen'
            _hover={{ bg: "blue.900" }}
            onClick={handleSaveClick}
          >
            Save Snippet
          </Button>
          <Button
            borderRadius='15'
            color='umbra.midnightGreen'
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='inherit'
            _hover={{ color: "umbra.softBlack" }}
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

export default NewLibrarySnippet;
