import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container d-flex align-items-center justify-content-between gap-2">
        {/* Left side: Brand only */}
        <div id="header-brand-id" className="d-flex align-items-center" style={{ flex: '1 1 auto', minWidth: '0' }}>
          <Link to="/" className="navbar-brand fw-bold" style={{ fontSize: 'clamp(12px, 5vw, 40px)', color: '#ff8800', lineHeight: 1, display: 'inline-block' }}>
            SocMed
          </Link>
        </div>
        {/* Right side: User Dropdown or Login/Register Links */}
        <div id="header-dropdown-id" className="d-flex align-items-center" style={{ flex: '0 1 auto', minWidth: '0' }}>
        <ul className="navbar-nav">
        {user ? (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-nowrap" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: 'clamp(10px, 4vw, 30px)' }}>
                {user.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-nowrap" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: 'clamp(10px, 4vw, 30px)' }}>
                Login/Register
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                <li>
                  <NavLink to="/login" className="dropdown-item">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="dropdown-item">Register</NavLink>
                </li>
              </ul>
            </li>
          )}
        </ul>
        </div>
      </div>
    </nav>
  );
}
