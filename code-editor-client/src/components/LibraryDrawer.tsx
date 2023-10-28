import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Heading,
  Button,
  Text,
  Code,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";

const LibraryDrawer = ({ placement, onClose, isOpen, size, codeCards }) => {
  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          color='white'
          bgGradient='linear(to-r, black, gray.100, blue.800)'
          borderBottomWidth='1px'
        >
          Code Library
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody bgGradient='linear(to-r, black, gray.100, blue.800)'>
          <SimpleGrid
            spacing={5}
            templateColumns='repeat(auto-fill, minmax(300px, 1fr))'
          >
            {codeCards.map((card, index) => (
              <React.Fragment key={card.id}>{card}</React.Fragment>
            ))}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
