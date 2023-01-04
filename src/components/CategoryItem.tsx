import { Button, ButtonGroup, FormControl, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { CategoryInterface } from '../backend/entities'
import { FaTrash, FaPen } from "react-icons/fa"
import { deleteCategoryById, updateCategoryById } from '../backend/api'
import { useState } from 'react'

export default function CategoryItem({ id, name, rerender }: CategoryInterface) {

    // Chakra UI Modal
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const [nameErr, setNameErr] = useState<boolean>(false)
    const [catName, setCatName] = useState<string>(name)

    // Chakra UI toast
    const toast = useToast()

    // Handle delete category
    const handleDeleteCategory = async () => {
        await deleteCategoryById(id as number).then(() => {
            rerender?.()
        })

        toast({
            title: 'Success',
            description: `Category, ${name} has been deleted!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        onCloseDelete()
    }

    // Handle category update
    const handleUpdateCategory = async () => {

        if (catName === null || catName.trim().length === 0) {
            setNameErr(true)
            return
        }

        await updateCategoryById({ name: catName }, id as number).then(() => {
            rerender?.()
        })

        toast({
            title: 'Success',
            description: `Category, ${name} has been updated!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        closeEditModal()
    }

    const closeEditModal = () => {
        setCatName("")
        setNameErr(false)
        onCloseEdit()
    }

    return (
        <>
            <Modal isOpen={isOpenEdit} onClose={closeEditModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={nameErr} isRequired>
                            <FormLabel>Category name</FormLabel>
                            <Input defaultValue={name} onChange={(e) => { setCatName(e.target.value); setNameErr(false) }} type="text" placeholder="Name of category ex. 'electronics'" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeEditModal} variant='ghost' mr={3} >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateCategory} colorScheme='blue' >Save</Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Category id: <b>{id}</b> and category name: <b>{name}</b></Text>
                        <Text mb={5}><b>Warning:</b> After the deletion some products will lose this category</Text>
                        <Text mb={3}>Are you sure?</Text>
                        <ButtonGroup>
                            <Button onClick={() => handleDeleteCategory()}>Yes</Button>
                            <Button colorScheme={'linkedin'} onClick={onCloseDelete}>No</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>

            </Modal>
            <Tr>
                <Td textAlign={'center'}>{id}</Td>
                <Td>{name}</Td>
                <Td>
                    <ButtonGroup>
                        <IconButton aria-label={'Törlés'} colorScheme={'red'} onClick={onOpenDelete} icon={<FaTrash />} />
                        <IconButton aria-label={'Módosítás'} colorScheme={'linkedin'} onClick={onOpenEdit} icon={<FaPen />} />
                    </ButtonGroup>
                </Td>
            </Tr>
        </>
    )
}
