import { Button, ButtonGroup, Checkbox, FormControl, FormLabel, IconButton, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Td, Text, Tooltip, Tr, useDisclosure, useToast, Wrap } from '@chakra-ui/react'
import { CategoryInterface, ProductInterface } from '../backend/entities'
import { FaTrash, FaPen } from "react-icons/fa"
import { addCategoryToProduct, deleteProduct, getCategories, getProductById, removeCategoryFromProduct, updateProduct, uploadImage } from '../backend/api';
import FilePicker from 'chakra-ui-file-picker';
import { useState, useEffect } from 'react'

export default function ProductItem({ id, name, description, price, thumbnail, rerender, productCategories }: ProductInterface) {

    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

    const toast = useToast()

    // Modal Inputs
    const [productImage, setProductImage] = useState<FormData>()
    const [productName, setProductName] = useState<string>(name)
    const [productDesc, setProductDesc] = useState<string>(description)
    const [productPrice, setProductPrice] = useState<number>(price)
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

    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
    });

    const handleDelete = async () => {
        await deleteProduct(id as number).then(() => {
            toast({
                title: 'Success',
                description: `Product, ${name} has been deleted!`,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            rerender?.()
            onCloseDelete()
        })

    }

    const openEditModal = async () => {
        const selected = [] as Array<number>
        const { data } = await getProductById(id!)
        const prodCat = data as any as ProductInterface
        categories?.forEach(i => {
            if (prodCat.productCategories?.some(item => item.id === i.id)) {
                //setSelectedCategories([...(selectedCategories || []), i.id!])
                selected.push(i.id!)
            }
        })
        setSelectedCategories(selected)
        setProductName(name)
        setProductDesc(description)
        setProductPrice(price)
        onOpenEdit()
    }

    const closeModal = () => {
        setProductName("")
        setProductPrice(0)
        setProductDesc("")
        setProductImage(undefined)
        setSelectedCategories(undefined)
        setNameErr(false)
        setDescErr(false)
        setPriceErr(false)
        onCloseEdit()
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

    const saveModification = async () => {
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

        await updateProduct(id!, {
            name: productName,
            description: productDesc,
            price: productPrice
        }).then((resp) => {
            const product = resp.data as any as ProductInterface
            if (productImage !== undefined && productImage !== null) {
                uploadImage(product.id!, productImage)
            }
            if (selectedCategories?.length === 0) {
                categories?.forEach(item => {
                    if (productCategories?.find(i => i.id === item.id)) {
                        removeCategoryFromProduct(product.id!, item.id!)
                    }
                })
            }
            if (selectedCategories !== undefined && selectedCategories !== null && selectedCategories.length !== 0) {
                categories?.forEach(item => {
                    if (selectedCategories.find(i => i === item.id!) && !productCategories?.find(i => i.id! === item.id!)) {
                        addCategoryToProduct(product.id!, item.id!)
                    }
                    else if (!selectedCategories.find(i => i === item.id!) && productCategories?.find(i => i.id! === item.id!)) {
                        removeCategoryFromProduct(product.id!, item.id!)
                    }
                })
            }

            toast({
                title: 'Success',
                description: `Product, ${product.name} has been updated!`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        }).then(() => {

        })
        rerender?.()
        closeModal()
    }

    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpenEdit} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit product details</ModalHeader>
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
                            <Input defaultValue={productName} onChange={(e) => { setProductName(e.target.value); setNameErr(false) }} placeholder={'ex. Samsung TV 2022'} type={'text'} />
                        </FormControl>
                        <FormControl isInvalid={descErr} mb={2} isRequired>
                            <FormLabel>Description</FormLabel>
                            <Input defaultValue={productDesc} onChange={(e) => { setProductDesc(e.target.value); setDescErr(false) }} placeholder={'ex. 4k resolution and A+ energy'} type={'text'} />
                        </FormControl>
                        <FormControl isInvalid={priceErr} mb={2} isRequired>
                            <FormLabel>Price</FormLabel>
                            <NumberInput defaultValue={productPrice} onChange={(e) => { setProductPrice(parseInt(e)); setPriceErr(false) }} step={1000} min={0}>
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
                                    return <Checkbox defaultChecked={selectedCategories?.some(item => item === i.id)} onChange={() => handleCheckboxChange(i.id as number)} key={key} value={i.name}>{i.name}</Checkbox>
                                })}
                            </Wrap>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={saveModification}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal blockScrollOnMount={false} isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Product id: <b>{id}</b> and product name: <b>{name}</b></Text>
                        <Text mb={5}>Are you sure?</Text>
                        <ButtonGroup>
                            <Button onClick={() => handleDelete()}>Yes</Button>
                            <Button colorScheme={'linkedin'} onClick={onCloseDelete}>No</Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Tr>
                <Td>
                    {
                        thumbnail !== "default.png" ?
                            <Link target="_blank" href={`http://localhost:8080/api/products/thumbnail/${id}`}><Image maxW={'75px'} src={`http://localhost:8080/api/products/thumbnail/${id}`} alt={thumbnail} /></Link>
                            : <Image src={"https://via.placeholder.com/75"} />
                    }
                </Td>
                <Td textAlign={"center"}>{id}</Td>
                <Td>{name}</Td>
                <Tooltip label={description}><Td textOverflow={'ellipsis'} overflow={'hidden'} maxWidth={'300px'}>{description}</Td></Tooltip>
                <Td paddingInlineStart={0} paddingInlineEnd={0} isNumeric>{formatter.format(price)}</Td>
                <Td>
                    <ButtonGroup>
                        <IconButton aria-label={'Törlés'} colorScheme={'red'} onClick={onOpenDelete} icon={<FaTrash />} />
                        <IconButton aria-label={'Módosítás'} colorScheme={'linkedin'} onClick={openEditModal} icon={<FaPen />} />
                    </ButtonGroup>
                </Td>
            </Tr>
        </>
    )
}
