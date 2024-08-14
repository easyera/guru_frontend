/* eslint-disable no-unused-vars */
import { useState } from "react";
import styles from "./header.module.css";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const redirecttopath = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="logo image" />
        <h1>Gurunatha</h1>
      </div>
      <div className={styles.nav}>
        <a href="/" className={styles.nav_links}>home</a>
        <a href="#about" className={styles.nav_links}>about</a>
      </div>
      <div className={styles.loginandregister}>
        <button className={styles.secondary_btn} onClick={()=> redirecttopath("/login")}>login</button>
        <button className={styles.primary_btn} onClick={()=> redirecttopath("/register")}>register</button>
      </div>
      <div className={styles.navbar_toggler + " " +`${isOpen ? styles.active : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={styles.mobileview + " " + ` ${isOpen ? styles.is_active : ''}`}>
          <ul className={styles.mobile_nav_link}>
            <li className={styles.mob_link}><a href="/">home</a></li>
            <li className={styles.mob_link}><a href="#about">about</a></li>
            <li className={styles.mob_btn}>
              <button className={styles.secondary_btn} onClick={()=> redirecttopath("/login")}>login</button>
              <button className={styles.primary_btn} onClick={()=> redirecttopath("/register")}>register</button>
            </li>
          </ul>
        </div>
    </div>
  );
}

export default Header;
