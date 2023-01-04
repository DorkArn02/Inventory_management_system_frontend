import { getCategories, getOrders, getProducts, getStorage, getTransactions } from "./api"
import { CategoryInterface, OrderInterface, ProductInterface, StorageInterface, TransactionInterface } from "./entities"

export const productsLoader = async () => {
    let result = await getProducts()
    let array = [] as ProductInterface[]

    (result.data as any as ProductInterface[]).map(
        item => {
            array.push(item)
        }
    )
    return array
}

export const categoryLoader = async () => {
    let result = await getCategories()
    let array = [] as CategoryInterface[]

    (result.data as any as CategoryInterface[]).map(
        item => {
            array.push(item)
        }
    )
    return array
}

export const orderLoader = async () => {
    let result = await getOrders()
    let array = [] as OrderInterface[]

    (result.data as any as OrderInterface[]).map(
        item => {
            array.push(item)
        }
    )
    return array
}

export const storageLoader = async () => {
    let result = await getStorage()
    let array = [] as StorageInterface[]

    (result.data as any as StorageInterface[]).map(
        item => {
            array.push(item)
        }
    )
    return array
}

export const transactionLoader = async () => {
    let result = await getTransactions()
    let array = [] as TransactionInterface[]

    (result.data as any as TransactionInterface[]).map(
        item => {
            array.push(item)
        }
    )
    return array
}