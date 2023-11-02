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
  Box,
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
        {user ? (
          <DrawerBody bgGradient='linear(to-r, black, gray.100, blue.800)'>
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
                  appendEditorContent={appendEditorContent}
                  handleDeleteSnippet={handleDeleteSnippet}
                  handleUpdateSnippet={handleUpdateSnippet}
                />
              ))}
            </SimpleGrid>
          </DrawerBody>
        ) : (
          <Box>
            <Text>Nope</Text>
          </Box>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
