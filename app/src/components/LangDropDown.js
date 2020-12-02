import React, {useState, Component} from 'react'
import Select from 'react-select'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const LangDropDown = (props) => {

    const [dropdownVal, setDropdownVal] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    // Languages can be added to list (GUI dropdown will dynamically adjust)
    //  -> credits: ACE examples
    const languages = [
        {value:"abap", label: "abap" },
        {value: "abc", label: "abc" },
        {value: "actionscript", label: "actionscript" },
        {value: "ada", label: "ada" },
        {value: "alda", label: "alda" },
        {value: "apache_conf", label: "apache_conf" },
        {value: "apex", label: "apex" },
        {value: "applescript", label: "applescript" },
        {value: "aql", label: "aql" },
        {value: "asciidoc", label: "asciidoc" },
        {value: "asl", label: "asl" },
        {value: "assembly_x86", label: "assembly_x86" },
        {value: "autohotkey", label: "autohotkey" },
        {value: "batchfile", label: "batchfile" },
        {value: "c9search", label: "c9search" },
        {value: "cirru", label: "cirru" },
        {value: "clojure", label: "clojure" },
        {value: "cobol", label: "cobol" },
        {value: "coffee", label: "coffee" },
        {value: "coldfusion", label: "coldfusion" },
        {value: "crystal", label: "crystal" },
        {value: "csharp", label: "csharp" },
        {value: "csp", label: "csp" },
        {value: "css", label: "css" },
        {value: "curly", label: "curly" },
        {value: "c_cpp", label: "c_cpp" },
        {value: "dart", label: "dart" },
        {value: "diff", label: "diff" },
        {value: "dockerfile", label: "dockerfile" },
        {value: "dot", label: "dot" },
        {value: "drools", label: "drools" },
        {value: "d", label: "d" },
        {value: "edifact", label: "edifact" },
        {value: "eiffel", label: "eiffel" },
        {value: "elixir", label: "elixir" },
        {value: "elm", label: "elm" },
        {value: "erlang", label: "erlang" },
        {value: "forth", label: "forth" },
        {value: "fortran", label: "fortran" },
        {value: "fsharp", label: "fsharp" },
        {value: "fsl", label: "fsl" },
        {value: "ftl", label: "ftl" },
        {value: "gcode", label: "gcode" },
        {value: "gherkin", label: "gherkin" },
        {value: "gitignore", label: "gitignore" },
        {value: "glsl", label: "glsl" },
        {value: "gobstones", label: "gobstones" },
        {value: "golang", label: "golang" },
        {value: "graphqlschema", label: "graphqlschema" },
        {value: "groovy", label: "groovy" },
        {value: "haml", label: "haml" },
        {value: "handlebars", label: "handlebars" },
        {value: "haskell_cabal", label: "haskell_cabal" },
        {value: "haskell", label: "haskell" },
        {value: "haxe", label: "haxe" },
        {value: "hjson", label: "hjson" },
        {value: "html_elixir", label: "html_elixir" },
        {value: "html", label: "html" },
        {value: "html_ruby", label: "html_ruby" },
        {value: "ini", label: "ini" },
        {value: "io", label: "io" },
        {value: "jack", label: "jack" },
        {value: "jade", label: "jade" },
        {value: "javascript", label: "javascript" },
        {value: "java", label: "java" },
        {value: "json5", label: "json5" },
        {value: "json", label: "json" },
        {value: "jsp", label: "jsp" },
        {value: "jssm", label: "jssm" },
        {value: "jsx", label: "jsx" },
        {value: "julia", label: "julia" },
        {value: "kotlin", label: "kotlin" },
        {value: "latex", label: "latex" },
        {value: "less", label: "less" },
        {value: "liquid", label: "liquid" },
        {value: "lisp", label: "lisp" },
        {value: "logiql", label: "logiql" },
        {value: "logtalk", label: "logtalk" },
        {value: "lsl", label: "lsl" },
        {value: "luapage", label: "luapage" },
        {value: "lua", label: "lua" },
        {value: "lucene", label: "lucene" },
        {value: "makefile", label: "makefile" },
        {value: "markdown", label: "markdown" },
        {value: "mask", label: "mask" },
        {value: "matlab", label: "matlab" },
        {value: "maze", label: "maze" },
        {value: "mediawiki", label: "mediawiki" },
        {value: "mel", label: "mel" },
        {value: "mixal", label: "mixal" },
        {value: "mushcode", label: "mushcode" },
        {value: "mysql", label: "mysql" },
        {value: "nginx", label: "nginx" },
        {value: "nim", label: "nim" },
        {value: "nix", label: "nix" },
        {value: "nsis", label: "nsis" },
        {value: "nunjucks", label: "nunjucks" },
        {value: "objectivec", label: "objectivec" },
        {value: "ocaml", label: "ocaml" },
        {value: "pascal", label: "pascal" },
        {value: "perl6", label: "perl6" },
        {value: "perl", label: "perl" },
        {value: "pgsql", label: "pgsql" },
        {value: "php", label: "php" },
        {value: "php_laravel_blade", label: "php_laravel_blade" },
        {value: "pig", label: "pig" },
        {value: "powershell", label: "powershell" },
        {value: "praat", label: "praat" },
        {value: "prisma", label: "prisma" },
        {value: "prolog", label: "prolog" },
        {value: "properties", label: "properties" },
        {value: "protobuf", label: "protobuf" },
        {value: "puppet", label: "puppet" },
        {value: "python", label: "python" },
        {value: "qml", label: "qml" },
        {value: "razor", label: "razor" },
        {value: "rdoc", label: "rdoc" },
        {value: "redshift", label: "redshift" },
        {value: "red", label: "red" },
        {value: "rhtml", label: "rhtml" },
        {value: "rst", label: "rst" },
        {value: "ruby", label: "ruby" },
        {value: "rust", label: "rust" },
        {value: "r", label: "r" },
        {value: "sass", label: "sass" },
        {value: "scad", label: "scad" },
        {value: "scala", label: "scala" },
        {value: "scheme", label: "scheme" },
        {value: "scss", label: "scss" },
        {value: "sh", label: "sh" },
        {value: "sjs", label: "sjs" },
        {value: "slim", label: "slim" },
        {value: "smarty", label: "smarty" },
        {value: "soy_template", label: "soy_template" },
        {value: "space", label: "space" },
        {value: "sparql", label: "sparql" },
        {value: "sqlserver", label: "sqlserver" },
        {value: "sql", label: "sql" },
        {value: "stylus", label: "stylus" },
        {value: "svg", label: "svg" },
        {value: "swift", label: "swift" },
        {value: "tcl", label: "tcl" },
        {value: "terraform", label: "terraform" },
        {value: "textile", label: "textile" },
        {value: "text", label: "text" },
        {value: "tex", label: "tex" },
        {value: "toml", label: "toml" },
        {value: "turtle", label: "turtle" },
        {value: "twig", label: "twig" },
        {value: "typescript", label: "typescript" },
        {value: "vala", label: "vala" },
        {value: "vbscript", label: "vbscript" },
        {value: "velocity", label: "velocity" },
        {value: "verilog", label: "verilog" },
        {value: "vhdl", label: "vhdl" },
        {value: "visualforce", label: "visualforce" },
        {value: "wollok", label: "wollok" },
        {value: "xml", label: "xml" },
        {value: "yaml", label: "yaml" },
        {value: "zeek", label: "zee" },
    ]

    languages.forEach(lang => {
        require(`ace-builds/src-noconflict/mode-${lang["value"]}`);
        require(`ace-builds/src-noconflict/snippets/${lang["value"]}`);
     });

    return (
        // <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        //     <DropdownToggle caret>
        //         Language
        //     </DropdownToggle>
        //     <DropdownMenu>
        //         <DropdownItem header>Supported</DropdownItem>
        //         {languages.map((languages, index)=>{
        //             return <DropdownItem className="languageDropdown" onClick={props.func}>{languages}</DropdownItem>
        //         })}
        //     </DropdownMenu>
        // </Dropdown>

        <Select options={languages} onChange={props.func} />
    )
}

export default LangDropDown;