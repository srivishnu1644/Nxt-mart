import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history, match} = props
  const {path} = match

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789457794/Logo_2.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>

      <ul className="nav-menu">
        <li className="nav-item">
          <Link
            to="/"
            className={`nav-link ${path === '/' ? 'active-nav-link' : ''}`}
          >
            <img
              src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841786/Iconhome.svg"
              alt="home"
              className="mobile-nav-icon"
            />
            <span className="nav-text">Home</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/cart"
            className={`nav-link ${path === '/cart' ? 'active-nav-link' : ''}`}
          >
            <img
              src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841786/Iconshopping_cart.svg"
              alt="cart"
              className="mobile-nav-icon"
            />
            <span className="nav-text">Cart</span>
          </Link>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            <img
              src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789639117/logout.png"
              alt="logout"
              className="img"
            />
            <span className="span nav-text">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
