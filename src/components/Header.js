import logoImg from '../images/logo.svg';

function Header() {
  return (
    <header className="header">
      <img src={logoImg} alt="Логотип сайта Место" className="header__logo" />
    </header>

  )
}
export default Header;