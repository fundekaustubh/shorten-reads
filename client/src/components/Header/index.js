import React from "react";
import './styles.css';
import logo from '../../logo/png/logo-no-background.png';
const Header = () => {
    return (
        <div class="Header">
            <img src={logo} alt="Shortened Reads logo." class="MainLogo" />
            <button class="HoverAnimation">Categories</button>
        </div>
    );
}

export default Header;