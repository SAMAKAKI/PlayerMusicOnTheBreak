import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Menu: React.FC = () => {
  const location = useLocation()
  return (
    <div className="w-full flex justify-around items-center mb-5">
      <Link to={'/'} className={`text-2xl font-semibold text-white w-2/5 text-center py-2 rounded-2xl ${location.pathname.substring(1) === '' ? 'bg-slate-600' : 'hover:bg-slate-600 transition-colors duration-75 ease-in'}`}>Home</Link>
      <Link to={'/proposals'} className={`text-2xl font-semibold text-white w-2/5 text-center py-2 rounded-2xl ${location.pathname.substring(1) === 'proposals' ? 'bg-slate-600' : 'hover:bg-slate-600 transition-colors duration-75 ease-in'}`}>Proposals</Link>
    </div>
  )
}
