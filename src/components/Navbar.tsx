import { Flex, Button, HStack, Text, Stack, IconButton, useColorMode } from "@chakra-ui/react";
import { BsBox } from "react-icons/bs"
import { FaMoon, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";

const navItems = [
    { title: "About", link: "/" },
    { title: "Products", link: "/products" },
    { title: "Categories", link: "/categories" },
    { title: "Orders", link: "/orders" },
    { title: "Storage", link: "/inventory" },
    { title: "Transactions", link: "/transactions" }
]

function Navbar() {

    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex mb={3} boxShadow={'xl'} flexDir={{ base: 'column', sm: 'column', md: 'row' }} bgColor={'#333'} align={'center'} justify={'space-between'} p={3} w={'100%'}>
            <HStack color={'#fff'}>
                <BsBox size={'35px'} color={'brown'} />
                <Text fontSize={'xl'} letterSpacing={2.5} fontWeight={'medium'}>IMS</Text>
            </HStack>
            <Stack align={'center'} direction={{ base: 'column', sm: 'row', md: 'row' }} gap={'10px'}>
                {navItems.map((item, key) => {
                    return <Link key={key} to={item.link}><Button color={'#fff'} fontSize={'sm'} variant={'link'}>{item.title}</Button></Link>
                })}
                <IconButton onClick={toggleColorMode} size="sm" aria-label="Change theme" icon={colorMode === "light" ? <FaSun /> : <FaMoon />} />
            </Stack>
        </Flex>
    )
}

export default Navbar;