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
  useColorModeValue,
} from "@chakra-ui/react";

import { EditorView } from "@codemirror/view";
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import React, { useState } from "react";

import { getLanguageMode, languageIconMap } from "../utils/language";

type LibrarySnippetType = {
  id: number;
  title: string;
  code: string;
  language: string;
  loggedIn: boolean;
  appendEditorContent: Function;
  handleDeleteSnippet: Function;
  handleUpdateSnippet: Function;
};

const LibrarySnippet = ({
  id,
  title,
  code,
  language,
  loggedIn,
  appendEditorContent,
  handleDeleteSnippet,
  handleUpdateSnippet,
}: LibrarySnippetType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [snippetCode, setSnippetCode] = useState(code);
  const [snippetTitle, setSnippetTitle] = useState(title);
  const [snippetLanguage, setSnippetLanguage] = useState(language);
  const [languageIcon, setLanguageIcon] = useState(languageIconMap[language])
  const [editorViewRef, setEditorViewRef] = useState<
  React.MutableRefObject<EditorView | undefined>
>({ current: undefined });


  const handleLanguageChange = (event) => {
    setSnippetLanguage(event.target.value);
    setLanguageIcon(languageIconMap[event.target.value]);
  };

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

  const handleCancelClick = () => {
    setSnippetTitle(title);
    setSnippetCode(code);
    setIsEditing((prevState) => !prevState);
  };

  return (
    <Card
      bgColor={useColorModeValue("white", "black")}
      pl='2'
      pr='2'
      minH='300px'
      align='center'
      id={String(id)}
      minHeight='400px'
      variant='elevated'
      border={useColorModeValue("1px solid", "none")}
      borderColor='gray.100'
      boxShadow='md'
    >
      <CardHeader textAlign='center' width='80%'>
        {isEditing ? (
          <Input
            border='1px solid'
            borderColor={useColorModeValue("lightgrey", "umbra.midnightGreen")}
            focusBorderColor='blue.400'
            width='60%'
            size='md'
            color={useColorModeValue("umbra.midnightGreen", "lightblue.600")}
            bg={useColorModeValue("white", "gray.800")}
            placeholder={snippetTitle}
            _placeholder={{ color: "gray", fontWeight: "bold" }}
            _hover={{ borderColor: "blue.400" }}
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
            setEditorViewRef={setEditorViewRef}
            code={snippetCode}
            isEditMode={isEditing}
            languageMode={getLanguageMode(snippetLanguage)}
          />
        </CardBody>
        <Flex align='end'>
          {isEditing ? (
            <Select
              bg='inherit'
              marginTop='2'
              width='3mu'
              size='sm'
              onChange={handleLanguageChange}
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
          ) : (
            <Image
              src={languageIcon}
              boxSize='32px'
              alt='Code Language Icon'
              ml={2}
              mt={2}
            />
          )}
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
            isDisabled={!loggedIn}
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
          { isEditing ?
          <Button
          borderRadius='15'
          color={useColorModeValue('umbra.midnightGreen', "lightblue.700")}
          whiteSpace='normal'
          overflow='hidden'
          w='49%'
          bgColor='inherit'
          _hover={{ color: useColorModeValue("umbra.softBlack", "lightblue.600") }}
          onClick={() => {
            setSnippetTitle(title);
            setSnippetCode(code);
            setIsEditing(prevState => !prevState);
          }}
        >
          Cancel
        </Button>
          :
          <Button
          isDisabled={!loggedIn}
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
        }

        </Flex>
      </CardFooter>
    </Card>
  );
};

export default LibrarySnippet;
