import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import * as React from "react";

type DrawerPlacement = "top" | "right" | "bottom" | "left";

type LibraryDrawerProps = {
  placement: DrawerPlacement;
  onClose: () => void;
  isOpen: boolean;
  size: string;
  codeCards: React.ReactNode[];
};

const LibraryDrawer = ({
  placement,
  onClose,
  isOpen,
  size,
  codeCards,
}: LibraryDrawerProps) => {
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
