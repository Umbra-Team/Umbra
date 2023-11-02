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
} from "@chakra-ui/react";
import * as React from "react";
import { CognitoContext } from "../context/cognito";
import NewLibrarySnippet from "./NewLibrarySnippet";
import LibrarySnippet from "./LibrarySnippet";
// import generateId from "../utils/generateId";
// import { LibrarySnippetData } from "../utils/fetchLibraryData";
import { EditorView } from "codemirror";
// import {
//   fetchLibraryData,
//   LibrarySnippetData,
// } from "../utils/fetchLibraryData";
import {
  createSnippet,
  editSnippet,
  deleteSnippet,
  getAllUserSnippets,
} from "../services/snippets";
import { Snippet } from "../types/types";

type DrawerPlacement = "top" | "right" | "bottom" | "left";

type LibraryDrawerProps = {
  user?: any;
  placement: DrawerPlacement;
  onClose: () => void;
  isOpen: boolean;
  size: string;
  appendEditorContent: Function;
  editorViewRef: React.MutableRefObject<EditorView | undefined>;
};

const LibraryDrawer = ({
  placement,
  onClose,
  isOpen,
  size,
  appendEditorContent,
  editorViewRef,
}: LibraryDrawerProps) => {
  const [librarySnippets, setLibrarySnippets] = React.useState<Snippet[]>([]);
  const [addSnippetMode, setAddSnippetMode] = React.useState(false);
  const cognitoClientToken = React.useContext(CognitoContext);

  React.useEffect(() => {
    if (editorViewRef) {
      const fetchAndSetLibrarySnippetData = async () => {
        try {
          const librarySnippetData = await getAllUserSnippets(
            cognitoClientToken
          );
          console.log(`Cognito token is ${cognitoClientToken}`);
          console.log(`librarySnippetData is ${librarySnippetData}`);
          // const librarySnippetData = await fetchLibraryData();

          setLibrarySnippets(librarySnippetData);
        } catch (e) {
          console.error(e);
        }
      };
      fetchAndSetLibrarySnippetData();
    }
  }, [editorViewRef]);

  const handleAddSnippet = async (code: string, title: string) => {
    try {
      const newSnippet = await createSnippet(cognitoClientToken, title, code);

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
    newTitle: string
  ) => {
    try {
      const updatedSnippet = await editSnippet(
        cognitoClientToken,
        id,
        newTitle,
        newCode
      );
      setLibrarySnippets((prevSnippets: Snippet[]) =>
        prevSnippets.map((snippet) =>
          snippet.id === updatedSnippet.id
            ? {
                ...snippet,
                code: updatedSnippet.code,
                title: updatedSnippet.title,
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
      const allSnippets = await deleteSnippet(cognitoClientToken, id);
      setLibrarySnippets(allSnippets);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          color='white'
          bgGradient='linear(to-r, black, gray.100, blue.800)'
          borderBottomWidth='2px'
          borderBottomColor='white'
        >
          <Flex justifyContent='space-between'>
            <Text>Code Library</Text>
            <Button
              marginRight={10}
              borderRadius='15'
              color='white'
              bgColor='blue.700'
              _hover={{ bg: "blue.900" }}
              onClick={() => setAddSnippetMode(true)}
            >
              New Code Snippet
            </Button>
            <DrawerCloseButton size='lg' />
          </Flex>
        </DrawerHeader>

        <DrawerBody bgGradient='linear(to-r, black, gray.100, blue.800)'>
          <SimpleGrid
            spacing={5}
            // templateColumns='repeat(auto-fill, minmax(300px, 1fr))'
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
