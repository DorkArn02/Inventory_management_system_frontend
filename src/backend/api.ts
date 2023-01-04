import axios, { AxiosHeaders } from "axios"
import { CategoryInterface, ProductInterface } from "./entities";

axios.defaults.baseURL = "http://localhost:8080/api/";

// API products

export const getProducts = async () => {
    return await axios.get<Response>('products/')
}

export const getProductById = async (id: number) => {
    return await axios.get<Response>(`products/${id}`)
}

export const postProduct = async (p: ProductInterface) => {
    return await axios.post<Response>(`products/`, {
        name: p.name,
        description: p.description,
        price: p.price
    })
}

export const deleteProduct = async (id: number) => {
    return axios.delete<Response>(`products/${id}`)
}

export const updateProduct = async (id: number, p: ProductInterface) => {
    return axios.put<Response>(`products/${id}`, {
        name: p.name,
        description: p.description,
        price: p.price
    })
}

export const uploadImage = (id: number, data: FormData) => {
    return axios.post<Response>(`products/thumbnail/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const addCategoryToProduct = async (productId: number, categoryId: number) => {
    return await axios.put<Response>(`products/${productId}/${categoryId}`)
}

export const removeCategoryFromProduct = async (productId: number, categoryId: number) => {
    return await axios.delete<Response>(`products/${productId}/${categoryId}`)
}


// API categories

export const postCategory = async (c: CategoryInterface) => {
    return await axios.post<Response>('category/', { name: c.name })
}

export const getCategoryById = async (id: number) => {
    return await axios.get<Response>(`category/${id}`)
}

export const getCategories = async () => {
    return await axios.get<Response>('category/')
}

export const deleteCategoryById = async (id: number) => {
    return await axios.delete<Response>(`category/${id}`)
}

export const updateCategoryById = async (c: CategoryInterface, id: number) => {
    return await axios.put<Response>(`category/${id}`, { name: c.name })
}

// API orders

export const getOrders = async () => {
    return await axios.get<Response>("orders/")
}

export const deleteOrderById = async (id: number) => {
    return await axios.delete<Response>(`orders/${id}`)
}

export const createOrder = async (expDelivery: string) => {
    return await axios.post<Response>(`orders/`, { expectedDelivery: expDelivery })
}

export const addItemToOrder = async (orderId: number, itemId: number, quantity: number) => {
    return await axios.put<Response>(`orders/${orderId}/${itemId}`, quantity.toString(),
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
}

export const changeOrderStatus = async (orderId: number) => {
    return await axios.put<Response>(`orders/${orderId}`)
}

// API storage

export const getStorage = async () => {
    return await axios.get<Response>(`storage/`)
}

export const addProductToStorage = async (prodId: number, quantity: number) => {
    return await axios.post<Response>(`storage/${prodId}`, quantity.toString(),
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
}

export const deleteProductFromStorage = async (prodId: number, quantity: number) => {
    return await fetch(`http://localhost:8080/api/storage/${prodId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quantity)
    })
}

//  API Transaction

export const getTransactions = async () => {
    return await axios.get<Response>("/transaction/")
}