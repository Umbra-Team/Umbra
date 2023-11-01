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
import NewLibrarySnippet from "./NewLibrarySnippet";
import LibrarySnippet from "./LibrarySnippet";
import generateId from "../utils/generateId";
// import { LibrarySnippetData } from "../utils/fetchLibraryData";
import { EditorView } from "codemirror";
import {
  fetchLibraryData,
  LibrarySnippetData,
} from "../utils/fetchLibraryData";

type DrawerPlacement = "top" | "right" | "bottom" | "left";

type LibraryDrawerProps = {
  placement: DrawerPlacement;
  onClose: () => void;
  isOpen: boolean;
  size: string;
  // librarySnippets: LibrarySnippetData[];
  // setLibrarySnippets: Function;
  appendEditorContent: Function;
  editorViewRef: React.MutableRefObject<EditorView | undefined>;
};

const LibraryDrawer = ({
  placement,
  onClose,
  isOpen,
  size,
  // librarySnippets,
  // setLibrarySnippets,
  appendEditorContent,
  editorViewRef,
}: LibraryDrawerProps) => {
  const [librarySnippets, setLibrarySnippets] = React.useState<
    LibrarySnippetData[]
  >([]);
  const [addSnippetMode, setAddSnippetMode] = React.useState(false);

  React.useEffect(() => {
    if (editorViewRef) {
      const fetchAndSetLibrarySnippetData = async () => {
        const librarySnippetData = await fetchLibraryData();

        setLibrarySnippets(librarySnippetData);
      };
      fetchAndSetLibrarySnippetData();
    }
  }, [editorViewRef]);

  const handleAddSnippet = (code: string, title: string) => {
    const newSnippetData = {
      id: generateId(),
      title,
      code,
    };

    // <CodeCard
    //   id={generateId()}
    //   title={title}
    //   code={code}
    //   appendEditorContent={appendEditorContent}
    //   handleDeleteSnippet={handleDeleteSnippet}
    // />

    setLibrarySnippets((prevSnippets: LibrarySnippetData[]) => [
      ...prevSnippets,
      newSnippetData,
    ]);
    setAddSnippetMode(false);
  };

  const handleUpdateSnippet = (
    id: number,
    newCode: string,
    newTitle: string
  ) => {
    setLibrarySnippets((prevSnippets: LibrarySnippetData[]) =>
      prevSnippets.map((snippet) =>
        snippet.id === id
          ? { ...snippet, code: newCode, title: newTitle }
          : snippet
      )
    );
  };

  const handleDeleteSnippet = (id: number) => {
    setLibrarySnippets((prevSnippets: LibrarySnippetData[]) =>
      prevSnippets.filter((snippet: LibrarySnippetData) => snippet.id !== id)
    );
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
            <DrawerCloseButton />
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
            {librarySnippets.map((snippet: LibrarySnippetData) => (
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
