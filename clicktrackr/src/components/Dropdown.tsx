import React, { useState, useRef, useEffect } from 'react';
import "./Dropdown.css";

type DropdownProps = {
  options: string[];
  onChange: (value: number) => void;
};

const Dropdown = ({options, onChange}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("e");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string, value: number) => {
    setSelectedOption(option);
    setIsOpen(false);
    setFocusedIndex(-1);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleDropdown();
    } else if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + options.length) % options.length);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const optionsList = dropdownRef.current.children;
      if (optionsList[focusedIndex]) {
        (optionsList[focusedIndex] as HTMLElement).focus();
      }
    }
  }, [isOpen, focusedIndex]);

  return (
    <div className="custom-dropdown">
      <div
        className="dropdown-header"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption}
      </div>
      {isOpen && (
        <ul
          className="dropdown-options"
          role="listbox"
          ref={dropdownRef}
          tabIndex={-1}
          aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}
        >
          {options.map((option, i) => (
            <li
              key={i}
              id={`option-${i}`}
              onClick={() => handleOptionClick(option, Math.pow(2, i))}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleOptionClick(option, Math.pow(2, i));
                }
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;