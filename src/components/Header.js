import logo from "../images/logo.svg";
import { Link, NavLink } from 'react-router-dom';

function Header({email, link}) {

  return (
    <header className="header">
      <img className="logo logo_header" src={logo} alt="Логотип" />
      <div className="header__auth-container">
        <span className="header__email"> {email} </span>
        <Link
          to={link.path}
          className={`header__link-auth`}>
            {link.name}
        </Link>
      </div>
    </header>
  );
}

export default Header;
