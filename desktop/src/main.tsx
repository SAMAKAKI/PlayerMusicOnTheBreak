import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home, Proposals } from './pages'
import { MainLayout } from './layouts'
import { StoreProvider } from './providers/storeProvider'

const router = createBrowserRouter([
  {path: '/', element: <MainLayout />, children: [
    {path: '/', element: <Home />},
    {path: '/proposals', element: <Proposals />}
  ]}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
)
