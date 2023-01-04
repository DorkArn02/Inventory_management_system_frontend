import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton, Flex, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import moment from 'moment'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { TransactionInterface } from '../backend/entities'

export default function Transactions() {

    // React Router Loader
    const [transactions, setTransactions] = useState<TransactionInterface[]>(
        (useLoaderData() as TransactionInterface[])
    )

    const {
        isOpen: isOpenInfo,
        onClose: onCloseInfo,
        onOpen: onOpenInfo,
    } = useDisclosure({ defaultIsOpen: true })

    return (
        <Flex ml="25%" mr="25%" gap={5} align={'center'} flexDir={'column'} justify={'center'}>
            <Heading size={'sm'}>Transactions</Heading>
            {isOpenInfo ?
                <Alert w={"80%"} mb={2} status='info'>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                            Log entries related to inventory operations are displayed here
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
            <TableContainer>
                <Table size={"sm"} variant={'striped'}>
                    <Thead>
                        <Tr>
                            <Th>Transaction id</Th>
                            <Th>Transaction time</Th>
                            <Th>Product id</Th>
                            <Th>Amount</Th>
                            <Th>Method</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions && transactions.map((item, key) => {
                            return <Tr>
                                <Td>{item.id}</Td>
                                <Td>{moment(item.timeOfTransaction).format('yyyy/MM/d HH:mm:ss')}</Td>
                                <Td>{item.product_id}</Td>
                                <Td color={item.isImport ? 'green.300' : 'red'}>{item.isImport ? '+' + item.quantity : '-' + item.quantity}</Td>
                                <Td>{item.isImport ? "Import" : "Export"}</Td>
                            </Tr>
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
}
