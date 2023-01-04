import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Inventory from './components/Inventory'
import Categories from './components/Categories'
import theme from './theme'
import Orders from './components/Orders'
import { categoryLoader, orderLoader, productsLoader, storageLoader, transactionLoader } from './backend/loaders'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import ErrorPage from './ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Dashboard />, },
      { path: 'products', element: <Products />, loader: productsLoader },
      { path: 'inventory', element: <Inventory />, loader: storageLoader },
      { path: 'categories', element: <Categories />, loader: categoryLoader },
      { path: 'orders', element: <Orders />, loader: orderLoader },
      { path: 'transactions', element: <Transactions />, loader: transactionLoader }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)
