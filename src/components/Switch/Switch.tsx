import React from 'react';

interface SwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, disabled , onChange}) => {

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked); 
      console.log("in seitch",event.target.checked)
    }
  };

  return (
    <label className={`flex items-center`}>
      <input
        type="checkbox"
        className={`toggle toggle-sm ${disabled ? 'bg-blue-100' : 'bg-blue-500 hover:bg-blue-500'}`}
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
      />
    </label>
  );
};

export default Switch;
