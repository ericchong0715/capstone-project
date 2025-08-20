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
      <div className="container d-flex align-items-center justify-content-between">
        {/* Left side: Brand only */}
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand fw-bold" style={{ fontSize: '40px', color: '#ff8800', lineHeight: 1, display: 'inline-block' }}>
            SocMed
          </Link>
        </div>
        {/* Right side: Collapsible menu with user/login/register */}
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto"> 
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
              </>
            )}

            {user && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
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
