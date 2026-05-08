import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Logo = () => (
  <Link to="/" className={styles.logo}>
    <span className={styles.logoIcon}>▲</span>
    <span className={styles.logoText}>HN Digest</span>
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />

        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={() => setMenuOpen(false)}>
            Stories
          </NavLink>

          {user ? (
            <>
              <NavLink to="/bookmarks" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={() => setMenuOpen(false)}>
                Bookmarks
              </NavLink>
              <span className={styles.username}>@{user.username}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} onClick={() => setMenuOpen(false)}>
                Sign In
              </NavLink>
              <Link to="/register" className={styles.registerBtn} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
