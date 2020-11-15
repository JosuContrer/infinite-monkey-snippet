import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard, faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import "./NavBar.css";

function NavBar() {
    const [click, setClick] = useState(false);

    const toggleMenu = () => setClick(!click);
    const goHome = () => {window.open("/", "_self");}

    return (
        <>
            <nav class='navbar'>
                <div class='navbar-container'>
                    <a class='navbar-logo' href='https://www.youtube.com/watch?v=TmKh7lAwnBI&ab_channel=BadBunny'>
                       <FontAwesomeIcon icon={faKeyboard}/> Infinite Monkey Snippet 
                    </a>
                    {/* <div class='menu-icon' onClick={toggleMenu}>
                        <FontAwesomeIcon icon={click ? faTimes : faBars} />
                    </div>
                    <ul class={click ? 'nav-menu active' : 'nav-menu'}>
                        <li class='nav-item'>
                            <h4 class='homepage' onClick={goHome}>Home</h4>
                        </li>
                    </ul>*/}
                </div>
            </nav>  
        </>
    )
}

export default NavBar
