export interface ProductInterface {
    id?: number,
    name: string,
    description: string,
    price: number,
    thumbnail?: string,
    rerender?: () => void,
    productCategories?: CategoryInterface[]
}

export interface CategoryInterface {
    id?: number,
    name: string,
    rerender?: () => void
}

export interface OrderedItemInterface {
    product_id: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    total_price: number,
    thumbnail: string
}

export interface OrderInterface {
    id?: number,
    created: Date,
    expectedDelivery: Date,
    completed?: boolean
    orderedItemsList?: OrderedItemInterface[],
    rerender?: () => void
}

export interface StorageInterface {
    product_id: number,
    product_name: string,
    quantity: number,
    rerender?: () => void
}

export interface TransactionInterface {
    id: number,
    timeOfTransaction: Date,
    product_id: number,
    quantity: number,
    isImport: boolean
}