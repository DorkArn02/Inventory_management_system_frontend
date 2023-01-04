import { Button, ButtonGroup, FormControl, FormLabel, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { BiExport, BiImport } from 'react-icons/bi'
import { StorageInterface } from '../backend/entities'
import { useState } from "react"
import { addProductToStorage, deleteProductFromStorage } from '../backend/api'

export default function InventoryItem({ product_id: productId, product_name: productName, quantity, rerender }: StorageInterface) {

    // Chakra-UI modal
    const { isOpen: isOpenImport, onClose: onCloseImport, onOpen: onOpenImport } = useDisclosure()
    const { isOpen: isOpenExport, onClose: onCloseExport, onOpen: onOpenExport } = useDisclosure()

    // CHakra-UI toast
    const toast = useToast()

    const [error, setError] = useState<boolean>(false)
    const [amount, setAmount] = useState<number>(0)

    const handleImport = async () => {

        if (amount <= 0) {
            setError(true)
            return;
        }

        await addProductToStorage(productId, amount).then(() => {
            rerender?.()
            handleCloseImportModal()
        })

        toast({
            title: 'Import Success',
            description: `Amount of ${productName} has been updated!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    const handleExport = async () => {

        if (amount <= 0) {
            setError(true)
            return;
        }

        if (amount > quantity) {
            setError(true)
            return;
        }

        await deleteProductFromStorage(productId, amount).then(() => {
            rerender?.()
            handleCloseExportModal()
        })

        toast({
            title: 'Export success',
            description: `Amount of ${productName} has been updated!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    const handleCloseImportModal = () => {
        setError(false)
        setAmount(0)
        onCloseImport()
    }

    const handleCloseExportModal = () => {
        setError(false)
        setAmount(0)
        onCloseExport()
    }

    return (
        <>
            <Modal isOpen={isOpenImport} onClose={handleCloseImportModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add product to the storage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Product id: <b>{productId}</b></Text>
                        <Text mb={5}>Enter how many products you want to put in the storage</Text>
                        <FormControl isInvalid={error} isRequired mb={4}>
                            <FormLabel>Amount</FormLabel>
                            <NumberInput onChange={(e) => { setAmount(parseInt(e)); setError(false) }} step={1} defaultValue={0} min={0}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <ButtonGroup>
                            <Button onClick={handleImport}>Import</Button>
                            <Button onClick={onCloseImport} colorScheme={'linkedin'}>Cancel</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenExport} onClose={handleCloseExportModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove product from the storage</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Product id: <b>{productId}</b></Text>
                        <Text mb={5}>Enter how many products you want to remove from the storage</Text>
                        <FormControl isInvalid={error} isRequired mb={4}>
                            <FormLabel>Amount</FormLabel>
                            <NumberInput onChange={(e) => { setAmount(parseInt(e)); setError(false) }} step={1} defaultValue={0} min={0}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <ButtonGroup>
                            <Button onClick={handleExport}>Export</Button>
                            <Button onClick={onCloseExport} colorScheme={'linkedin'}>Cancel</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Tr>
                <Td textAlign={'center'}>{productId}</Td>
                <Td textAlign={'center'}>{productName}</Td>
                <Td textAlign={'center'}>{quantity}</Td>
                <Td textAlign={'center'}>
                    <ButtonGroup>
                        <IconButton aria-label='Import' onClick={onOpenImport} icon={<BiImport />} colorScheme={'green'} />
                        <IconButton aria-label='Export' onClick={onOpenExport} icon={<BiExport />} colorScheme={'red'} />
                    </ButtonGroup>
                </Td>
            </Tr>
        </>
    )
}
