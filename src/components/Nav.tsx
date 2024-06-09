import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import React from "react";

interface propsType {
  active: string;
}

const Nav: React.FC<propsType> = ({ active }) => {
  return (
    <>
      <div className={styles.container}>
        <div>
          <p className={styles.title}>Poster Builder</p>
        </div>
        <div className={styles.navLinks}>
          <Link className={styles.link} to="/">
            <p className={active !== "home" ? styles.navlink : styles.active}>
              Home
            </p>
          </Link>
          <Link className={styles.link} to="/editor">
            <p className={active !== "editor" ? styles.navlink : styles.active}>
              Editor
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nav;
