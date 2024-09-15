import { ButtonDef } from '../../types/types';
import './ButtonGroup.css';

interface ButtonGroupProps {
  options: ButtonDef[];
  handleClick: (name:string) => void;
}

function ButtonGroup({options, handleClick}: ButtonGroupProps) {
  return (
    <div className="button-group" role="group">
      {options.map(option => <button key={option.name} onClick={() => handleClick(option.name)}>{option.display}</button>)}
    </div>
  );
}

export default ButtonGroup;