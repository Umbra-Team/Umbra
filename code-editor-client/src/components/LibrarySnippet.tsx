import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
  Image,
  Input,
  Select,
} from "@chakra-ui/react";

import { EditorView } from "@codemirror/view";
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import React, { useState, useRef, useEffect } from "react";

import { getLanguageMode, languageIconMap } from "../utils/language";

type LibrarySnippetType = {
  id: number;
  title: string;
  code: string;
  language: string;
  appendEditorContent: Function;
  handleDeleteSnippet: Function;
  handleUpdateSnippet: Function;
};

const LibrarySnippet = ({
  id,
  title,
  code,
  language,
  appendEditorContent,
  handleDeleteSnippet,
  handleUpdateSnippet,
}: LibrarySnippetType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [snippetCode, setSnippetCode] = useState(code);
  const [snippetTitle, setSnippetTitle] = useState(title);
  const [snippetLanguage, setSnippetLanguage] = useState(language);
  const [languageIcon, setLanguageIcon] = useState(languageIconMap[language])
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleChangeLanguage = (event) => {
    setSnippetLanguage(event.target.value);
    setLanguageIcon(languageIconMap[event.target.value]);
  }

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
      handleUpdateSnippet(id, currentContent, snippetTitle, snippetLanguage);
    }
    setIsEditing((prevState) => !prevState);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippetTitle(event.target.value);
  };

  return (
    <Card
      bgColor='white'
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      id={String(id)}
      minHeight='400px'
      variant="elevated"
      border="1px solid"
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
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
      >
        <CardBody>
          <LibrarySnippetEditor
            editorViewRef={editorViewRef}
            code={snippetCode}
            isEditMode={isEditing}
            languageMode={getLanguageMode(language)}
          />
        </CardBody>
        <Flex align="end">
        {isEditing ?
          <Select
              bg="inherit"
              marginTop='2'
              width='3mu'
              size='sm'
              onChange={handleChangeLanguage}
              textColor={"gray.300"}
              iconColor={"gray.300"}
              borderColor={"gray.600"}
              value={snippetLanguage}
            >
              <option value='js'>JavaScript</option>
              <option value='ts'>TypeScript</option>
              <option value='py'>Python</option>
              <option value='go'>Golang</option>
              <option value='rb'>Ruby</option>
            </Select>
            :
            <Image
            src={languageIcon}
            boxSize='32px'
            alt='Code Language Icon'
            ml={2}
            mt={2}
          />
          }
          </Flex>
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
