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
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
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
  const [languageIcon, setLanguageIcon] = useState(languageIconMap[language]);
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
    <Accordion allowToggle>
      <AccordionItem>
        <Card
          bgColor={useColorModeValue("white", "black")}
          pl='2'
          pr='2'
          id={String(id)}
          variant='elevated'
          border={useColorModeValue("1px solid", "none")}
          borderColor='gray.100'
          boxShadow='md'
        >
          <CardHeader textAlign='center' width='100%'>
            {isEditing ? (
              <Flex position='relative'>
                <Select
                  bg='inherit'
                  marginTop='2'
                  size='sm'
                  onChange={handleLanguageChange}
                  textColor={"gray.300"}
                  iconColor={"gray.300"}
                  borderColor={"gray.600"}
                  value={snippetLanguage}
                  marginRight='5%'
                  width='15%'
                >
                  <option value='js'>JavaScript</option>
                  <option value='ts'>TypeScript</option>
                  <option value='py'>Python</option>
                  <option value='go'>Golang</option>
                  <option value='rb'>Ruby</option>
                </Select>
                <Box
                  position='absolute'
                  left='50%'
                  transform='translateX(-50%)'
                >
                  <Input
                    fontSize='20px'
                    border='1px solid'
                    borderColor={useColorModeValue(
                      "lightgrey",
                      "umbra.midnightGreen"
                    )}
                    focusBorderColor='blue.400'
                    width='100%'
                    size='md'
                    color={useColorModeValue(
                      "umbra.midnightGreen",
                      "lightblue.600"
                    )}
                    bg={useColorModeValue("white", "gray.800")}
                    placeholder={snippetTitle}
                    _placeholder={{ color: "gray", fontWeight: "bold" }}
                    _hover={{ borderColor: "blue.400" }}
                    textAlign='center'
                    fontWeight='bold'
                    onChange={handleTitleChange}
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (event.key === "Enter" && event.ctrlKey) {
                        handleSaveClick();
                      }
                    }}
                  />
                </Box>
              </Flex>
            ) : (
              <Heading size='md' color='gray.600'>
                <AccordionButton display='flex' position='relative'>
                  <Image
                    src={languageIcon}
                    boxSize='32px'
                    alt='Code Language Icon'
                    ml={2}
                    mt={2}
                  />
                  <Box
                    position='absolute'
                    left='50%'
                    transform='translateX(-50%)'
                    fontSize='20px'
                    fontWeight={"bold"}
                  >
                    {snippetTitle}
                  </Box>
                  <AccordionIcon ml='auto' />
                </AccordionButton>
              </Heading>
            )}
          </CardHeader>
          <AccordionPanel
            w='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
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
              <Box width='100%'>
                <LibrarySnippetEditor
                  setEditorViewRef={setEditorViewRef}
                  code={snippetCode}
                  isEditMode={isEditing}
                  languageMode={getLanguageMode(snippetLanguage)}
                />
              </Box>
            </CardBody>
            <CardFooter p={2}>
              <Flex
                gap='5px'
                justifyContent='center'
                pr='3'
                pl='4'
                width='100%'
              >
                <Button
                  borderRadius='15'
                  color='white'
                  whiteSpace='normal'
                  overflow='hidden'
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
                  bgColor='umbra.midnightGreen'
                  _hover={{ bg: "umbra.logoText" }}
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
                {isEditing ? (
                  <Button
                    borderRadius='15'
                    color={useColorModeValue(
                      "umbra.midnightGreen",
                      "lightblue.700"
                    )}
                    whiteSpace='normal'
                    overflow='hidden'
                    bgColor='inherit'
                    _hover={{
                      color: useColorModeValue(
                        "umbra.softBlack",
                        "lightblue.600"
                      ),
                    }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    isDisabled={!loggedIn}
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    bgColor='umbra.midnightGreen'
                    _hover={{ bg: "umbra.logoText" }}
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                )}
              </Flex>
            </CardFooter>
          </AccordionPanel>
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

export default LibrarySnippet;
