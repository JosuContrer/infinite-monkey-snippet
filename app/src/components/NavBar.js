import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard,} from '@fortawesome/free-solid-svg-icons'

function NavBar() {
    // const [click, setClick] = useState(false);
    //
    // const toggleMenu = () => setClick(!click);
    // const goHome = () => {window.open("/", "_self");}

    // Responsive Navbar to scroll 
    //      -waits for document to be loaded
    //      -adds scroll event listener
    document.addEventListener('DOMContentLoaded', function(){

        window.addEventListener('scroll', responsiveNavBar);
        let navbar = document.getElementById('navBar');
        let logo = document.getElementById('mainLogo');

        function responsiveNavBar(){
            if(window.scrollY > 30){
                navbar.style.backgroundColor = "black";
                logo.style.color = "white";
            }else{
                navbar.style.backgroundColor = "#FCCD04";
                logo.style.color = "#A63A50";
            }
        }
    })

    return (
        <>
            <div id='navBar' className='navbar'>
                <div className='navbar-container'>
                    <a className='navbar-logo' id='mainLogo' href='/'>
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
            </div>  
        </>
    )
}

export default NavBar
