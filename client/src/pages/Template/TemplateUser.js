import React from 'react'
import { Outlet } from "react-router-dom"
import NavbarUser from '../../commponent/Navbar/NavbarUser'
import '../../styles/style.css'

function TemplateUser() {
  return (
    <div>
            <NavbarUser /> 
            <div className='content'>
                <Outlet />
            </div>
    </div>
  )
}

export default TemplateUser