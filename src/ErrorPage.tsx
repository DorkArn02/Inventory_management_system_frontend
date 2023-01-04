import { Flex, Heading, Link, Text } from '@chakra-ui/react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error: any = useRouteError()

    return (
        <Flex flexDir={"column"} align={"center"} justify={"center"} mt={10}>
            <Heading size={"lg"}>Error</Heading>
            <Text>{error.toString()}</Text>
            <Link color={"blue.300"} href="/">Go back to the main page</Link>
        </Flex>
    )

}
