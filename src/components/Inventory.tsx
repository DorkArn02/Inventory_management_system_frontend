import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, Flex, Heading, Table, Table as TableContainer, Tbody, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import { StorageInterface } from '../backend/entities'
import { useState } from "react"
import { useLoaderData } from 'react-router-dom'
import InventoryItem from './InventoryItem'
import { getStorage } from '../backend/api'

export default function Inventory() {

    // React Router Loader
    const [storage, setStorage] = useState<StorageInterface[]>(
        (useLoaderData() as StorageInterface[])
    )

    const {
        isOpen: isOpenInfo,
        onClose: onCloseInfo,
        onOpen: onOpenInfo,
    } = useDisclosure({ defaultIsOpen: true })

    const handleRerender = async () => {
        const { data } = await getStorage()
        setStorage(data as any as StorageInterface[])
    }

    return (
        <Flex ml="25%" mr="25%" gap={5} align={'center'} flexDir={'column'} justify={'center'}>
            <Heading size={'sm'}>Manage storage</Heading>
            {isOpenInfo ?
                <Alert status='info'>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Instructions</AlertTitle>
                        <AlertDescription>
                            If the ordered products arrive, the dispatcher can add the new products to the storage.
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-1}
                        top={-1}
                        onClick={onCloseInfo}
                    />
                </Alert>
                : ""}
            {storage && storage.length === 0 ? <Alert width={"50%"} flexDir={"column"} status='warning'>
                <AlertIcon />
                <AlertTitle>The storage is empty!</AlertTitle>
                <AlertDescription>Click on the products to create new products.</AlertDescription>
            </Alert>
                :
                <TableContainer>
                    <Table size={"sm"} variant={'striped'}>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'}>Product id</Th>
                                <Th textAlign={'center'}>Product name</Th>
                                <Th textAlign={'center'}>Amount</Th>
                                <Th textAlign={'center'}>Methods</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {storage && storage.map((item, key) => {
                                return <InventoryItem rerender={handleRerender} {...item} key={key} />
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>}
        </Flex>
    )
}
