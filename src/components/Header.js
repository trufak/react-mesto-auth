import logo from "../images/logo.svg";
import { Link, Route, Switch } from 'react-router-dom';

function Header({email}) {

  return (
    <header className="header">
      <img className="logo logo_header" src={logo} alt="Логотип" />
      <div className="header__auth-container">
        <span className="header__email"> {email} </span>
        <Switch>
          <Route path='/sign-in'>
            <Link to='/sign-up' className='header__link-auth'>
                Регистрация
            </Link>
          </Route>
          <Route path='/sign-up'>
            <Link to='/sign-in' className='header__link-auth'>
                Войти
            </Link>
          </Route>
          <Route path='/'>
            <Link to='/sign-in' className='header__link-auth'>
                Выйти
            </Link>
          </Route>
        </Switch>
      </div>
    </header>
  );
}

export default Header;
