import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaBox, FaList, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, handleLogout, handleSearch, cartItemCount }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div className="container">
      <Link className="navbar-brand" to="/">Mama Mboga Delivery</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/"><FaHome size={20} /></Link></li>
          <li className="nav-item"><Link className="nav-link" to="/products"><FaBox size={20} /></Link></li>
          <li className="nav-item"><Link className="nav-link" to="/orders"><FaList size={20} /></Link></li>
          <li className="nav-item">
            <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <input className="form-control me-2" type="search" placeholder="Search" onChange={handleSearch} />
              <button className="btn btn-outline-success" type="submit"><FaSearch size={18} /></button>
            </form>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && <span className="badge bg-danger">{cartItemCount}</span>}
            </Link>
          </li>
          {!isLoggedIn ? (
            <li className="nav-item">
              <Link className="nav-link" to="/login"><FaSignInAlt size={20} /></Link>
            </li>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/profile"><FaUserCircle size={20} /></Link></li>
              <li className="nav-item">
                <button className="btn nav-link text-danger" onClick={handleLogout}><FaSignOutAlt size={20} /></button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
