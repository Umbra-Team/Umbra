import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import NewLibrarySnippet from "./NewLibrarySnippet";
import LibrarySnippet from "./LibrarySnippet";
import { EditorView } from "codemirror";
import {
  createSnippet,
  editSnippet,
  deleteSnippet,
  getAllUserSnippets,
} from "../services/snippets";
import { Snippet } from "../types/types";
import { examples, ExampleSnippet } from "../constants/exampleSnippetData";

type DrawerPlacement = "top" | "right" | "bottom" | "left";

type LibraryDrawerProps = {
  user: any;
  placement: DrawerPlacement;
  onClose: () => void;
  isOpen: boolean;
  size: string;
  appendEditorContent: Function;
  editorViewRef: React.MutableRefObject<EditorView | undefined>;
};

const LibraryDrawer = ({
  user,
  placement,
  onClose,
  isOpen,
  size,
  appendEditorContent,
  editorViewRef,
}: LibraryDrawerProps) => {
  const [librarySnippets, setLibrarySnippets] = React.useState<Snippet[]>([]);
  const [addSnippetMode, setAddSnippetMode] = React.useState(false);
  const cognitoClientToken = user?.signInUserSession.accessToken.jwtToken;

  React.useEffect(() => {
    if (user) {
      if (editorViewRef) {
        const fetchAndSetLibrarySnippetData = async () => {
          try {
            const librarySnippetData = await getAllUserSnippets(
              cognitoClientToken
            );
            setLibrarySnippets(librarySnippetData);
          } catch (e) {
            console.error(e);
          }
        };
        fetchAndSetLibrarySnippetData();
      }
    } else {
      setLibrarySnippets([]);
    }
  }, [editorViewRef, user]);

  const handleAddSnippet = async (code: string, title: string, language: string) => {
    try {
      const newSnippet = await createSnippet(cognitoClientToken, title, code, language);

      setLibrarySnippets((prevSnippets: Snippet[]) => [
        ...prevSnippets,
        newSnippet,
      ]);
      setAddSnippetMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSnippet = async (
    id: number,
    newCode: string,
    newTitle: string,
    newLanguage: string,
  ) => {
    try {
      const updatedSnippet = await editSnippet(
        cognitoClientToken,
        id,
        newTitle,
        newCode,
        newLanguage,
      );
      setLibrarySnippets((prevSnippets: Snippet[]) =>
        prevSnippets.map((snippet) =>
          snippet.id === updatedSnippet.id
            ? {
                ...snippet,
                code: updatedSnippet.code,
                title: updatedSnippet.title,
                language: updatedSnippet.language
              }
            : snippet
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSnippet = async (id: number) => {
    try {
      const status = await deleteSnippet(cognitoClientToken, id);
      if (status === 204) {
        setLibrarySnippets((prevSnippets) =>
          prevSnippets.filter((snippet) => snippet.id !== id)
        );
      } else {
        throw new Error("Deletion of snippet failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return user ? (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          color={useColorModeValue('umbra.midnightGreen', 'white')}
          bg={useColorModeValue(
            'linear-gradient(45deg, hsla(205, 100%, 72%, 1) 0%, hsla(189, 100%, 72%, 1) 50%, hsla(167, 58%, 58%, 1) 100%)',
            'linear-gradient(45deg, hsla(205, 100%, 36%, 1) 0%, hsla(189, 100%, 36%, 1) 50%, hsla(176, 73%, 38%, 1) 100%)')}
          // borderBottomWidth='1px'
          // borderBottomColor='lightgray'
        >
          <Flex justifyContent='center'>
            <Text 
              mt={1.5}
              fontSize="32px"
              fontWeight="700"
              
            >
              Code Library
            </Text>
            {/* <Button
              marginRight={10}
              borderRadius='15'
              color='white'
              bg='#0096FF'
              _hover={{ bg: "#04BCF9" }}
              onClick={() => setAddSnippetMode(true)}
            >
              New Code Snippet
            </Button> */}
            <DrawerCloseButton size='lg' />
          </Flex>
        </DrawerHeader>
        <DrawerBody bg={useColorModeValue('white', 'gray.800')} >
          <Flex justifyContent="left">
          <Button
            // marginRight={10}
            mt={2}
            mb={4}
            borderRadius='10'
            color='white'
            bg='#0096FF'
            _hover={{ bg: "#04BCF9" }}
            onClick={() => setAddSnippetMode(true)}
            size="md"
          >
              Create New
          </Button>
          </Flex>
          <SimpleGrid
            spacing={5}
            templateColumns='repeat(1, minmax(600px, 1fr))'
          >
            {addSnippetMode ? (
              <NewLibrarySnippet
                handleAddSnippet={handleAddSnippet}
                handleCancel={() => setAddSnippetMode(false)}
              />
            ) : null}
            {librarySnippets.map((snippet: Snippet) => (
              <LibrarySnippet
                key={snippet.id}
                id={snippet.id}
                title={snippet.title}
                code={snippet.code}
                language={snippet.language}
                loggedIn={true}
                appendEditorContent={appendEditorContent}
                handleDeleteSnippet={handleDeleteSnippet}
                handleUpdateSnippet={handleUpdateSnippet}
              />
            ))}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        {/* <Box>
          <Text>Nope</Text>
        </Box> */}
        <DrawerHeader
          color={useColorModeValue('umbra.midnightGreen', 'white')}
          bg={useColorModeValue(
            'linear-gradient(45deg, hsla(205, 100%, 72%, 1) 0%, hsla(189, 100%, 72%, 1) 50%, hsla(167, 58%, 58%, 1) 100%)',
            'linear-gradient(45deg, hsla(205, 100%, 36%, 1) 0%, hsla(189, 100%, 36%, 1) 50%, hsla(176, 73%, 38%, 1) 100%)')}
          textAlign="center"
          
        >
          Here are some examples. Sign up or log in to create your own!
        </DrawerHeader>
        <DrawerBody bg={useColorModeValue('white', 'gray.800')}>
          <SimpleGrid
            spacing={5}
            templateColumns='repeat(1, minmax(600px, 1fr))'
          >
            {examples.map((snippet: ExampleSnippet) => (
              <LibrarySnippet
                key={snippet.id}
                id={snippet.id}
                title={snippet.title}
                code={snippet.code}
                language={snippet.language}
                loggedIn={false}
                appendEditorContent={appendEditorContent}
                handleDeleteSnippet={handleDeleteSnippet}
                handleUpdateSnippet={handleUpdateSnippet}
              />
            ))}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
