import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Flex,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditorView } from "@codemirror/view";
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import { useState, useRef } from "react";

import { getLanguageMode } from "../utils/language";

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
  const [snippetLanguage, setSnippetLanguage] = useState('js');
  const [editorViewRef, setEditorViewRef] = useState<
  React.MutableRefObject<EditorView | undefined>
>({ current: undefined });

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault;
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      setSnippetCode(currentContent);
      handleAddSnippet(currentContent, snippetTitle, snippetLanguage);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippetTitle(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSnippetLanguage(event.target.value);
  }

  return (
    <Card
      bgColor={useColorModeValue('green.100', 'umbra.midnightGreen')}
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
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
      >
        <CardBody>
          <LibrarySnippetEditor
            setEditorViewRef={setEditorViewRef}
            code={snippetCode}
            isEditMode={true}
            languageMode={getLanguageMode(snippetLanguage)}
          />
        </CardBody>
        <Flex align="end">
          <Select
            bg="inherit"
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
            bgColor={useColorModeValue('umbra.midnightGreen', 'lightblue.700')}
            _hover={{ bg: useColorModeValue("blue.900", "lightblue.800") }}
            onClick={handleSaveClick}
          >
            Save
          </Button>
          <Button
            borderRadius='15'
            color={useColorModeValue('umbra.midnightGreen', "lightblue.600")}
            whiteSpace='normal'
            overflow='hidden'
            w='49%'
            bgColor='inherit'
            _hover={{ color: useColorModeValue("umbra.softBlack", "lightblue.700") }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default NewLibrarySnippet;
