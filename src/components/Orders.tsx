import { Button, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useLoaderData } from 'react-router-dom'
import { addItemToOrder, createOrder, getOrders, getProducts } from '../backend/api'
import { OrderInterface, ProductInterface } from '../backend/entities'
import OrderItem from './OrderItem'

export default function Orders() {

    // React Router Loader
    const [orders, setOrders] = useState<OrderInterface[]>(
        (useLoaderData() as OrderInterface[])
    )
    // Modal chakra-ui
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [expDelivery, setExpDelivery] = useState<string>('')
    const [selectedProduct, setSelectedProduct] = useState<number>()
    const [productQuantity, setProductQuantity] = useState<number>(0)
    const [productList, setProductList] = useState<Map<number, { name: string, quantity: number, price: number }>>()

    // Modal errors
    const [itemError, setItemError] = useState<boolean>(false)
    const [expError, setExpError] = useState<boolean>(false)

    // Products
    const [products, setProducts] = useState<ProductInterface[]>()

    // Load the products
    const loadProducts = async () => {
        const { data } = await getProducts()
        setProducts(data as any as ProductInterface[])
    }

    useEffect(() => {
        loadProducts()
    }, [])

    // Add product to list in modal
    const addProductToList = () => {
        if (productQuantity <= 0 || isNaN(productQuantity)) {
            setItemError(true)
            return
        }

        if (selectedProduct === undefined) {
            setItemError(true)
            return
        }

        const productName = products!.find(i => i.id === selectedProduct)!.name
        const productPrice = products!.find(i => i.id === selectedProduct)!.price

        //setProductList([...(productList || []), { id: selectedProduct!, quantity: productQuantity }])
        setProductList(new Map(productList || []).set(selectedProduct, { name: productName, quantity: productQuantity, price: productPrice }))
        setProductQuantity(0)
        setSelectedProduct(-1)
    }

    // Handle modal closing
    const closeModal = () => {
        setProductList(undefined)
        setProductQuantity(0)
        setSelectedProduct(-1)
        setExpDelivery('')
        setExpError(false)
        setItemError(false)
        onClose()
    }
    // Refresh order list
    const handleRerender = async () => {
        const { data } = await getOrders()
        setOrders(data as any as OrderInterface[])
    }

    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
    });

    const sumValues = (m: Map<number, { name: string, quantity: number, price: number }>) => {
        let sum = 0
        m.forEach(item => {
            sum += item.price * item.quantity
        })
        return sum
    }

    const deleteItemFromList = (id: number) => {
        const newList = Array.from(productList!.entries()).filter(([key, value]) => key !== id)

        setProductList(new Map(newList || []))
    }

    const handleNewOrder = async () => {
        if (!moment(expDelivery.toString()).isValid()) {
            setExpError(true)
            return
        }
        if (moment(expDelivery.toString()).isBefore(moment().toISOString())) {
            setExpError(true)
            return
        }
        if (productList === null || productList === undefined) {
            setItemError(true)
            return
        }
        await createOrder(expDelivery).then((resp) => {
            const order = resp.data as any as OrderInterface
            Array.from(productList).forEach(([key, value]) => {
                addItemToOrder(order.id!, key, value.quantity)
            })
        })
        handleRerender()
        closeModal()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent maxW={"850px"}>
                    <ModalHeader>Add new order</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={2} isInvalid={expError} isRequired>
                            <FormLabel>Expected delivery</FormLabel>
                            <Input onChange={(e) => { setExpDelivery(e.target.value); setExpError(false) }} required type="datetime-local" />
                        </FormControl>
                        <FormControl mb={5} isInvalid={itemError} isRequired>
                            <FormLabel>Select products</FormLabel>
                            <HStack>
                                <Select value={selectedProduct} defaultValue={'-1'} onChange={(e) => { setSelectedProduct(parseInt(e.target.value)); setItemError(false); }}>
                                    <option value={'-1'} disabled>Please select a product from here</option>
                                    {products && products.map((item, key) => {
                                        return <option value={item.id} key={key}>{item.name}</option>
                                    })}
                                </Select>
                                <NumberInput value={productQuantity} onChange={(e) => { setProductQuantity(parseInt(e)); setItemError(false) }} step={1} defaultValue={0} min={0}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <IconButton onClick={addProductToList} aria-label={'Add'} colorScheme={'green'} icon={<FaPlus />} />
                            </HStack>
                        </FormControl>
                        <TableContainer>
                            <Table size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th>Product name</Th>
                                        <Th>Amount</Th>
                                        <Th>Price</Th>
                                        <Th>Methods</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {productList && Array.from(productList).map(([key, value]) => {
                                        return <Tr key={key}>
                                            <Td>{value.name}</Td>
                                            <Td>{value.quantity + " db"}</Td>
                                            <Td>{formatter.format(value.quantity * value.price)}</Td>
                                            <Td><IconButton onClick={() => deleteItemFromList(key)} colorScheme={'red'} aria-label='Delete' icon={<FaTrash />} /></Td>
                                        </Tr>
                                    })}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Td colSpan={4} textAlign={"right"}>Total price: <b>{productList ? formatter.format(sumValues(productList)) : "0,00 Ft"} </b></Td>
                                    </Tr>
                                </Tfoot>

                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleNewOrder} colorScheme='blue' >Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex gap={5} align={'center'} flexDir={'column'} justify={'center'}>
                <Heading size={'sm'}>Manage orders</Heading>
                <Button onClick={onOpen} colorScheme={'green'} size={'sm'}>Add new order</Button>
                <TableContainer>
                    <Table size={"sm"} variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>Created </Th>
                                <Th>Expected delivery</Th>
                                <Th>Completed</Th>
                                <Th>Methods</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {orders && orders.map((item, key) => {
                                return <OrderItem rerender={handleRerender} {...item} key={key} />
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </>
    )
}
