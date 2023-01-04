import { Button, ButtonGroup, Flex, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { OrderedItemInterface, OrderInterface } from '../backend/entities'
import { FaTrash, FaPen, FaCheck } from "react-icons/fa"
import { AiOutlineUnorderedList } from "react-icons/ai"
import { ImCross } from "react-icons/im"
import moment from 'moment'
import OrderedItem from './OrderedItem'
import { changeOrderStatus, deleteOrderById } from '../backend/api'

export default function OrderItem({ id, created, expectedDelivery, completed, orderedItemsList, rerender }: OrderInterface) {

    // Chakra-UI modal
    const { isOpen: isOpenList, onOpen: onOpenList, onClose: onCloseList } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

    // Chakra-UI toast
    const toast = useToast()

    // Handle order delete
    const handleDelete = async (id: number) => {
        await deleteOrderById(id).then(() => {
            rerender?.()
            onCloseDelete()
        })

        toast({
            title: 'Success',
            description: `Order with id ${id} has been deleted!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    // Sum the prices
    const sumValues = (m: OrderedItemInterface[]) => {
        let sum = 0
        m.forEach(item => {
            sum += item.total_price
        })
        return sum
    }

    // Number formatter
    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
    });

    // Handle order status edit
    const handleEdit = async () => {
        await changeOrderStatus(id as number).then(() => {
            rerender?.()
            onCloseEdit()
        })
        toast({
            title: 'Success',
            description: `The status of the order with id ${id} has been changed!`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    return (
        <>
            <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm status change</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Order id: <b>{id}</b></Text>
                        <Text mb={5}>Are you sure?</Text>
                        <ButtonGroup>
                            <Button onClick={() => handleEdit()}>Yes</Button>
                            <Button colorScheme={'linkedin'} onClick={onCloseEdit}>No</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenList} onClose={onCloseList}>
                <ModalOverlay />
                <ModalContent maxW={"1000px"}>
                    <ModalHeader>Product list for '{id}' order</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <TableContainer>
                            <Table size={"sm"}>
                                <Thead>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Product name</Th>
                                        <Th>Description</Th>
                                        <Th isNumeric>Price</Th>
                                        <Th isNumeric>Amount</Th>
                                        <Th isNumeric>Total price</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orderedItemsList && orderedItemsList.map((item, k) => {
                                        return <OrderedItem {...item} key={k} />
                                    })}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Td colSpan={6} textAlign={'right'}><b>Total price: </b>{orderedItemsList ?
                                            formatter.format(sumValues(orderedItemsList)) : "0,00 Ft"}</Td>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Order id: <b>{id}</b></Text>
                        <Text mb={5}>Are you sure?</Text>
                        <ButtonGroup>
                            <Button onClick={() => handleDelete(id as number)}>Yes</Button>
                            <Button colorScheme={'linkedin'} onClick={onCloseDelete}>No</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Tr>
                <Td textAlign={'center'}>{id}</Td>
                <Td>{moment(created).format('yyyy/MM/d HH:mm:ss')}</Td>
                <Td>{moment(expectedDelivery).format('yyyy/MM/d HH:mm:ss')}</Td>
                <Td >{completed ? <Flex justify={"center"}><FaCheck display={"block"} color={'green'} /></Flex> : <Flex justify={"center"}><ImCross color={'darkred'} /></Flex>}</Td>
                <Td>
                    <ButtonGroup>
                        <IconButton aria-label={'Delete'} colorScheme={'red'} onClick={onOpenDelete} icon={<FaTrash />} />
                        <IconButton aria-label={'Edit'} colorScheme={'linkedin'} onClick={onOpenEdit} icon={<FaPen />} />
                        <IconButton aria-label={'Product list'} colorScheme={'green'} onClick={onOpenList} icon={<AiOutlineUnorderedList />} />
                    </ButtonGroup>
                </Td>
            </Tr>
        </>
    )
}
