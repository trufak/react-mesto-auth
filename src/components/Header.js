import logo from "../images/logo.svg";

function Header() {
  return (
    <header className="header">
      <img className="logo logo_header" src={logo} alt="Логотип" />
    </header>
  );
}

export default Header;
