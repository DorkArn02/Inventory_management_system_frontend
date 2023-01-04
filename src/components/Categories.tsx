import { Button, Flex, Heading, Table, TableContainer, Tbody, Th, Thead, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tr, useDisclosure, FormControl, Input, FormLabel, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getCategories, postCategory } from '../backend/api'
import { CategoryInterface } from '../backend/entities'
import CategoryItem from './CategoryItem'

export default function Categories() {

    // React Router Loader
    const [categories, setCategories] = useState<CategoryInterface[]>(
        (useLoaderData() as CategoryInterface[])
    )

    // Chakra UI Modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Chakra UI toast
    const toast = useToast()

    // Modal input
    const [catName, setCatName] = useState<string>("")

    // Modal errors
    const [nameErr, setNameErr] = useState<boolean>(false)

    // Save category to database
    const handleNewCategory = async () => {
        if (catName.trim().length === 0) {
            setNameErr(true)
            return
        }

        await postCategory({ name: catName }).then((resp) => {
            const cat = resp.data as any as CategoryInterface
            toast({
                title: 'Success',
                description: `Category, ${cat.name} has been saved successfully!`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
            handleRerender()
            closeModal()
        })
    }
    // Reload category list
    const handleRerender = async () => {
        const { data } = await getCategories()
        setCategories(data as any as CategoryInterface[])
    }

    const closeModal = () => {
        setNameErr(false)
        setCatName("")
        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add new category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={nameErr} isRequired>
                            <FormLabel>Category name</FormLabel>
                            <Input onChange={(e) => { setCatName(e.target.value); setNameErr(false) }} type="text" placeholder="Name of the category ex. 'electronics'" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeModal} variant='ghost' mr={3} >
                            Cancel
                        </Button>
                        <Button onClick={handleNewCategory} colorScheme='blue' >Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex gap={5} align={'center'} flexDir={'column'} justify={'center'}>
                <Heading size={'sm'}>Manage categories</Heading>
                <Button onClick={onOpen} colorScheme={'green'} size={'sm'} >Add new category</Button>
                <TableContainer>
                    <Table size={"sm"} variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>Name</Th>
                                <Th>Methods</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {categories && categories.map((item, key) => {
                                return <CategoryItem rerender={handleRerender} {...item} key={key} />
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </>
    )
}
