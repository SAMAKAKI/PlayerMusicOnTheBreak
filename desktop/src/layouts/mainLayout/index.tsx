import React from 'react'
import { Menu } from '../../components'
import { Outlet } from 'react-router-dom'

export const MainLayout: React.FC = () => {
  return (
    <div className='w-full h-screen overflow-y-auto bg-slate-800 py-2 px-4'>
      <Menu />
      <Outlet />
    </div>
  )
}
