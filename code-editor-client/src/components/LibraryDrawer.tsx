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
import NewCodeCard from "./NewCodeCard";
import CodeCard from "./CodeCard";
import generateId from "../utils/generateId";

type DrawerPlacement = "top" | "right" | "bottom" | "left";

type LibraryDrawerProps = {
  placement: DrawerPlacement;
  onClose: () => void;
  isOpen: boolean;
  size: string;
  codeCards: React.ReactNode[];
  setCodeCards: Function;
  appendEditorContent: Function;
};

const LibraryDrawer = ({
  placement,
  onClose,
  isOpen,
  size,
  codeCards,
  setCodeCards,
  appendEditorContent,
}: LibraryDrawerProps) => {
  const [addSnippetMode, setAddSnippetMode] = React.useState(false); // temporarily showing this by default

  const handleAddSnippet = (code: string, title: string) => {
    const newCard = (
      <CodeCard
        id={generateId()}
        title={title}
        code={code}
        appendEditorContent={appendEditorContent}
      />
    );
    setCodeCards((prevCards: React.ReactNode[]) => [...prevCards, newCard]);
    setAddSnippetMode(false);
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
              <NewCodeCard
                handleAddSnippet={handleAddSnippet}
                handleCancel={() => setAddSnippetMode(false)}
              />
            ) : null}
            {codeCards.map((card, index) => {
              return <React.Fragment key={index}>{card}</React.Fragment>;
            })}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
