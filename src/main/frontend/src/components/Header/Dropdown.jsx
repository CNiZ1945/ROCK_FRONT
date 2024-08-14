import { Link } from 'react-router-dom';
import './Dropdown.css';
import MenuItems from "./MenuItems";
import Navbar from "./Navbar";



const Dropdown = ({ submenus }) => {
    return (
        <ul className="dropdown">
            {submenus.map((submenu, index) => (
                <li key={index} className="menu-items">
                    <Link to={submenu.url}>{submenu.title}</Link>
                </li>
            ))}
        </ul>
    );
};
export default Dropdown;