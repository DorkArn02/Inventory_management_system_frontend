import { Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure, useToast, Wrap } from '@chakra-ui/react'
import FilePicker from 'chakra-ui-file-picker';
import { useEffect, useState } from 'react'
import { useLoaderData } from "react-router-dom"
import { addCategoryToProduct, getCategories, getProducts, postProduct, uploadImage } from '../backend/api';
import { CategoryInterface, ProductInterface } from '../backend/entities';
import ProductItem from './ProductItem';

export default function Products() {

    // React Router Loader
    const [products, setProducts] = useState<ProductInterface[]>(
        (useLoaderData() as ProductInterface[])
    )
    // Chakra UI Modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Chakra UI toast message
    const toast = useToast()

    // Modal Inputs
    const [productImage, setProductImage] = useState<FormData>()
    const [productName, setProductName] = useState<string>('')
    const [productDesc, setProductDesc] = useState<string>('')
    const [productPrice, setProductPrice] = useState<number>(0)
    const [selectedCategories, setSelectedCategories] = useState<Array<number>>()

    // Modal errors
    const [nameErr, setNameErr] = useState<boolean>(false)
    const [descErr, setDescErr] = useState<boolean>(false)
    const [priceErr, setPriceErr] = useState<boolean>(false)

    // Categories
    const [categories, setCategories] = useState<CategoryInterface[]>()

    // Fetch categories for new product method
    const getCategoriesDb = async () => {
        const { data } = await getCategories()
        setCategories(data as any as CategoryInterface[])
    }

    useEffect(() => {
        getCategoriesDb()
    }, [])

    // Close modal
    const closeModal = () => {
        setProductName('')
        setProductPrice(0)
        setProductDesc('')
        setProductImage(undefined)
        setNameErr(false)
        setDescErr(false)
        setPriceErr(false)
        setSelectedCategories(undefined)
        onClose()
    }

    // Save product to database
    const saveProduct = async () => {

        if (productName.trim().length === 0) {
            setNameErr(true)
        }
        if (productDesc.trim().length === 0) {
            setDescErr(true)
        }
        if (productPrice === 0 || isNaN(productPrice)) {
            setPriceErr(true)
        }

        if (priceErr || nameErr || descErr) {
            return;
        }

        await postProduct({
            name: productName,
            description: productDesc,
            price: productPrice
        }).then((resp) => {
            const product = resp.data as any as ProductInterface
            if (productImage !== undefined && productImage !== null) {
                uploadImage(product.id!, productImage)
            }

            if (selectedCategories !== undefined && selectedCategories !== null && selectedCategories.length !== 0) {
                for (let n in selectedCategories) {
                    addCategoryToProduct(product.id!, parseInt(n))
                }
            }

            toast({
                title: 'Success.',
                description: `Product, ${product.name} has been saved successfully!`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        })

        handleRerender()
        closeModal()
    }
    // Reload product list 
    const handleRerender = async () => {
        const { data } = await getProducts()
        setProducts(data as any as ProductInterface[])
    }

    // Handle image upload client side
    const handleImageUpload = (file: File[]) => {
        const formData = new FormData()
        formData.append('file', file[0])
        setProductImage(formData)
    }

    // Handle category checkbox
    const handleCheckboxChange = (id: number) => {
        if (!selectedCategories?.includes(id)) {
            setSelectedCategories([...(selectedCategories || []), id])
        } else {
            setSelectedCategories(selectedCategories.filter(i => i !== id))
        }
    }

    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add new product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={2}>
                            <FormLabel>Thumbnail</FormLabel>
                            <FilePicker
                                inputProps={{ cursor: 'pointer', width: '100%', border: '1px solid #ddd', borderRadius: '10px', p: '10px' }}
                                onFileChange={(file) => handleImageUpload(file)}
                                placeholder="Click here to select image"
                                clearButtonLabel="Törlés"
                                multipleFiles={false}
                                accept="image/png,image/jpeg, image/gif"
                                hideClearButton={true}
                            />
                        </FormControl>
                        <FormControl isInvalid={nameErr} mb={2} isRequired>
                            <FormLabel>Product name</FormLabel>
                            <Input onChange={(e) => { setProductName(e.target.value); setNameErr(false) }} placeholder={'ex. Samsung TV 2022'} type={'text'} />
                        </FormControl>
                        <FormControl isInvalid={descErr} mb={2} isRequired>
                            <FormLabel>Description</FormLabel>
                            <Input onChange={(e) => { setProductDesc(e.target.value); setDescErr(false) }} placeholder={'ex. 4k resolution and A+ energy'} type={'text'} />
                        </FormControl>
                        <FormControl isInvalid={priceErr} mb={2} isRequired>
                            <FormLabel>Price</FormLabel>
                            <NumberInput onChange={(e) => { setProductPrice(parseInt(e)); setPriceErr(false) }} step={1000} defaultValue={0} min={0}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Select categories (optional)</FormLabel>
                            <Wrap spacingX={3}>
                                {categories && categories.map((i, key) => {
                                    return <Checkbox onChange={() => handleCheckboxChange(i.id as number)} key={key} value={i.name}>{i.name}</Checkbox>
                                })}
                            </Wrap>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={saveProduct} colorScheme='blue' >Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex gap={5} align={'center'} flexDir={'column'} justify={'center'}>
                <Heading size={'sm'}>Manage products</Heading>
                <Button colorScheme={'green'} size={'sm'} onClick={onOpen}>Add new product</Button>
                <TableContainer>
                    <Table size={"sm"} variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th>Thumbnail</Th>
                                <Th>Id</Th>
                                <Th>Name</Th>
                                <Th>Description</Th>
                                <Th isNumeric>Price</Th>
                                <Th>Methods</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {products && products.map((p, key) => {
                                return <ProductItem key={key} {...p} rerender={handleRerender} />
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </>
    )
}
