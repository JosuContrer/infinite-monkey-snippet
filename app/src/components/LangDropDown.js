import React, {useState} from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './LangDropDown.css';

const LangDropDown = (props) => {
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    // Languages can be added to list (GUI dropdown will dynamically adjust)
    const languages = [
        "javascript",
        "java",
        "python",
        "xml",
        "ruby",
        "sass",
        "markdown",
        "mysql",
        "json",
        "html",
        "handlebars",
        "golang",
        "csharp",
        "elixir",
        "typescript",
        "css"
      ];

    return (
        <Dropdown class="buttonDrop" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret class="dropTitle">
                Language
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Supported</DropdownItem>
                {languages.map((languages, index)=>{
                    return <DropdownItem class="languageDropdown" onClick={props.func}>{languages}</DropdownItem>
                })}
            </DropdownMenu>
        </Dropdown>
    )
}

export default LangDropDown;