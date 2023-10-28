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
} from "@chakra-ui/react";

const LibraryDrawer = ({ placement, onClose, isOpen, size }) => {
  return (
    <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          color='white'
          bgGradient='linear(to-r, black, gray.100, blue.800)'
          borderBottomWidth='1px'
        >
          Snippet Library
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody bgGradient='linear(to-r, black, gray.100, blue.800)'>
          <SimpleGrid
            spacing={5}
            templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
          >
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  FizzBuzz
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  Spiral Matrix
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  Fibonaci
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  HTML 5 Skeleton
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
            <Card bgColor='whiteAlpha.900'>
              <CardHeader>
                <Heading size='md' color='gray.100'>
                  Even more code
                </Heading>
              </CardHeader>
              <CardBody border='2px' borderRadius='10' borderColor='black'>
                <Code>"Some code"</Code>
              </CardBody>
              <CardFooter>
                <Button
                  color='whitek'
                  bgColor='blue.700'
                  _hover={{ bg: "blue.900" }}
                >
                  Insert Into Editor
                </Button>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
