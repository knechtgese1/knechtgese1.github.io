import './Header.css';

function Header() {

  return (
    <header>
      <h1>FastNote v1.0</h1>
      <nav>
        <button className="edit">
          NEW NOTE
        </button>
        <button className="define">
          EDIT DEFS
        </button>
      </nav>
    </header>
  )
}

export default Header;