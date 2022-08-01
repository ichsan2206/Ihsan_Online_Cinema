import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Icon.png'
import Profil from '../../assets/user.svg'
import MyFilm from '../../assets/film.svg'
import Chat from '../../assets/chat.svg'
import LogoutIcon from '../../assets/logout.svg'
import UserBlank from '../../assets/blank-profile.png'

export default function NavbarUser() {
    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()
  
    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
    }
  return (
    <div>
         <Navbar bg="black" variant="dark" expand="lg" className='navbg'>
        <Container>
            <Navbar.Brand as={Link} to="/user"><img src={Logo} style={{ maxWidth: '200px' }} alt="" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav style={{marginRight: '5%'}}>
            <NavDropdown
                            title={<div>
                                <img className="rounded-circle"
                                    src={UserBlank}
                                    alt="User"
                                    style={{ width: '40px', marginTop: '5px'}}
                                />
                            </div>}  style={{backgroundColor: 'black'}} id="nav-dropdown">
                            <NavDropdown.Item style={{backgroundColor: 'black', color: 'white'}} as={Link} to="/user/profile">
                                <img
                                    src={Profil}
                                    alt="icon"
                                    style={{ width: '25px', marginRight: '5px' }}
                                />Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item style={{backgroundColor: 'black', color: 'white'}} as={Link} to="/user/my-list-film">
                                <img
                                    src={MyFilm}
                                    alt="icon"
                                    style={{ width: '25px', marginRight: '5px' }}
                                />My List Film
                            </NavDropdown.Item>
                            <NavDropdown.Item style={{backgroundColor: 'black', color: 'white'}} as={Link} to="/user/complain-user">
                                <img
                                    src={Chat}
                                    alt="icon"
                                    style={{ width: '25px', marginRight: '5px' }}
                                />Complain
                            </NavDropdown.Item>
                            <NavDropdown.Divider style={{backgroundColor: 'grey', color: 'white'}}/>
                            <NavDropdown.Item 
                            onClick={logout}
                            style={{backgroundColor: 'black', color: 'white'}}>
                                <img
                                    src={LogoutIcon}
                                    alt="icon"
                                    style={{ width: '25px', marginRight: '5px' }}
                                    
                                />Logout
                            </NavDropdown.Item>
                        </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </div>
  )
}
