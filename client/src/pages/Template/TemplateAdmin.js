import React from 'react'
import { Outlet } from "react-router-dom"
import NavbarAdmin from '../../commponent/Navbar/NavbarAdmin'
import '../../styles/style.css'


export default function TemplateAdmin() {
  return (
    <div> 
        <NavbarAdmin />
            <div className='content'>
                <Outlet />
            </div>
    </div>
  )
}
