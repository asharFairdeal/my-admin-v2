import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  options: Option[];
  onSelect: (option: Option) => void;
  defaultSelected?: Option | null;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label = "Select an option",
  options = [],
  onSelect,
  defaultSelected = null,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(defaultSelected);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block w-full md:w-auto ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-primary w-full md:w-auto flex items-center justify-between"
      >
        {selected ? selected.label : label}
        <svg
          className="w-4 h-4 ml-2 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 14a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L10 11.586l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 14z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full md:w-56 mt-2">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="hover:bg-primary hover:text-white cursor-pointer px-4 py-2"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
