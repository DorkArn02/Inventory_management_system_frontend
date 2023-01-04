import { Td, Tr } from '@chakra-ui/react'
import { OrderedItemInterface } from '../backend/entities'

export default function OrderedItem({ product_id, description, name, price, quantity, thumbnail, total_price }: OrderedItemInterface) {

    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
    });


    return (
        <Tr>
            <Td>{product_id}</Td>
            <Td>{name}</Td>
            <Td>{description}</Td>
            <Td>{formatter.format(price)}</Td>
            <Td>{quantity}</Td>
            <Td>{formatter.format(total_price)}</Td>
        </Tr>
    )
}
