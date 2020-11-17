import React, {useState} from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './LangDropDown.css';

const LangDropDown = (props) => {
    
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    // Languages can be added to list (GUI dropdown will dynamically adjust)
    //  -> credits: ACE examples
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

    languages.forEach(lang => {
        require(`ace-builds/src-noconflict/mode-${lang}`);
        require(`ace-builds/src-noconflict/snippets/${lang}`);
     });

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                Language
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Supported</DropdownItem>
                {languages.map((languages, index)=>{
                    return <DropdownItem className="languageDropdown" onClick={props.func}>{languages}</DropdownItem>
                })}
            </DropdownMenu>
        </Dropdown>
    )
}

export default LangDropDown;