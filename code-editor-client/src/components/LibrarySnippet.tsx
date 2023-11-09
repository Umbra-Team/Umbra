import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

import { EditorView } from "@codemirror/view";
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import React, { useState, useRef } from "react";

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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippetTitle(event.target.value);
  };

  return (
    <Card
      bgColor={useColorModeValue('white', 'black')}
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      id={String(id)}
      minHeight='400px'
      variant="elevated"
      border={useColorModeValue("1px solid", "none")}
      borderColor="gray.100"
      boxShadow="md"
    >
      <CardHeader textAlign='center' width='80%'>
        {isEditing ? (
          <Input
            border='1px solid lightgrey'
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
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter" && event.ctrlKey) {
                handleSaveClick();
              }
            }}
          />
        ) : (
          <Heading size='md' color='gray.600'>
            {snippetTitle}
          </Heading>
        )}
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
            bgColor='umbra.midnightGreen'
            _hover={{ bg: "umbra.logoText" }}
            onClick={() => appendEditorContent(snippetCode)}
          >
            Insert
          </Button>
          <Button
            borderRadius='15'
            color='white'
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='umbra.midnightGreen'
            _hover={{ bg: "umbra.logoText" }}
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            borderRadius='15'
            color='white'
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='umbra.midnightGreen'
            _hover={{ bg: "umbra.logoText" }}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default LibrarySnippet;
