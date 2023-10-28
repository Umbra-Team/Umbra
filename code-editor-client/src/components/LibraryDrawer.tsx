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
          Code Library
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody bgGradient='linear(to-r, black, gray.100, blue.800)'>
          <SimpleGrid
            spacing={5}
            templateColumns='repeat(auto-fill, minmax(300px, 1fr))'
          >
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
            <Card bgColor='gray.800' pl='2' pr='2' minH='300px'>
              <CardHeader textAlign='center'>
                <Heading size='md' color='gray.100'>
                  Hello World
                </Heading>
              </CardHeader>
              <CardBody
                bg='#232D3F'
                border='2px'
                borderRadius='10'
                borderColor='black'
                color='white'
              >
                "Some Code"
              </CardBody>
              <CardFooter p={2}>
                <Flex gap='5px' justifyContent='space-between' pr='3' pl='4'>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Insert Into Editor
                  </Button>
                  <Button
                    borderRadius='15'
                    color='white'
                    whiteSpace='normal'
                    overflow='hidden'
                    w='49%'
                    bgColor='blue.700'
                    _hover={{ bg: "blue.900" }}
                  >
                    Delete Snippet
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default LibraryDrawer;
