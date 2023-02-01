import React from "react";
import './styles.css';
import logo from '../../logo/png/logo-no-background.png';
const Header = () => {
    return (
        <div className="Header">
            <img src={logo} alt="Shortened Reads logo." className="MainLogo" />
            <button className="HoverAnimation">Categories</button>
        </div>
    );
}

export default Header;