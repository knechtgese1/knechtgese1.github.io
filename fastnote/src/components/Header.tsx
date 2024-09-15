import { AppMode } from '../types/types';
import './Header.css';

interface HeaderProps {
  handleModeChange: (mode: AppMode) => void;
};

function Header({handleModeChange}: HeaderProps) {

  return (
    <header>
      <h1>FastNote v1.0</h1>
      <nav>
        <button className="edit" onClick={() => handleModeChange('edit')}>
          NEW NOTE
        </button>
        <button className="define" onClick={() => handleModeChange('define')}>
          EDIT DEFS
        </button>
      </nav>
    </header>
  )
}

export default Header;