import { Flex, Heading, Link, Text } from '@chakra-ui/react'


export default function Dashboard() {
    return (
        <>
            <Flex ml="25%" mr="25%" gap={5} align={'center'} flexDir={'column'} justify={'center'}>
                <Heading size="sm">About the frontend</Heading>
                <Text textAlign={"justify"}>Instructions: You can navigate into the corresponding topics by the navbar. After you installed the backend correctly, you should create categories for items. In the orders page you can create orders. You can import or export items to/from inventory, this frontend application is using this backend: <Link color={'red'} textDecor={'underline'} href='https://github.com/DorkArn02/Inventory_management_system'>Inventory Management system backend</Link> and it is calling the REST endpoints and you don't need to use Postman. </Text>
            </Flex>
        </>
    )
}
