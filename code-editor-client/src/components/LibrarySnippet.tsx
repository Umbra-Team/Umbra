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
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import { useState, useRef } from "react";

type LibrarySnippetType = {
  id: number;
  title: string;
  code: string;
  appendEditorContent: Function;
  handleDeleteSnippet: Function;
  handleUpdateSnippet: Function;
};

const LibrarySnippet = ({
  id,
  title,
  code,
  appendEditorContent,
  handleDeleteSnippet,
  handleUpdateSnippet,
}: LibrarySnippetType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [snippetCode, setSnippetCode] = useState(code);
  const [snippetTitle, setSnippetTitle] = useState(title);
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleDeleteClick = () => {
    handleDeleteSnippet(id);
  };

  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSaveClick = () => {
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      setSnippetCode(currentContent);
      handleUpdateSnippet(id, currentContent, snippetTitle);
    }
    setIsEditing((prevState) => !prevState);
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
          {snippetTitle}
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
          <LibrarySnippetEditor
            editorViewRef={editorViewRef}
            code={snippetCode}
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
            onClick={() => appendEditorContent(snippetCode)}
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
            onClick={isEditing ? handleSaveClick : handleEditClick}
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
            onClick={handleDeleteClick}
          >
            Delete Snippet
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default LibrarySnippet;