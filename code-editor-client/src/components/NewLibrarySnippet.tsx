import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Flex,
  Input,
  Select,
} from "@chakra-ui/react";
import { EditorView } from "@codemirror/view";
import LibrarySnippetEditor from "./LibrarySnippetEditor";
import { useState, useRef, useEffect } from "react";

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
  const [editorKey, setEditorKey] = useState(Math.random());
  const editorViewRef = useRef<EditorView | undefined>(undefined);

  const handleSaveClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault;
    setEditorKey(Math.random());
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
    setSnippetCode("");
    setEditorKey(Math.random());
  }

  useEffect(() => {
    setEditorKey(Math.random());
    console.log(`snippetLanguage: ${snippetLanguage}`);
  }, [snippetLanguage]);

  return (
    <Card
      bgColor='green.100'
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
            key={editorKey}
            editorViewRef={editorViewRef}
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
            bgColor='umbra.midnightGreen'
            _hover={{ bg: "blue.900" }}
            onClick={handleSaveClick}
          >
            Save
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
