import React from 'react';

interface SwitchProps {
  checked: boolean;
  disabled: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, disabled }) => {
  return (
    <label className={`flex items-center`}>
      <input
        type="checkbox"
        className={`toggle toggle-sm ${disabled ? 'bg-blue-100' : 'bg-blue-500 hover:bg-blue-500'}`}
        defaultChecked={checked}
        disabled={disabled}
      />
    </label>
  );
};

export default Switch;
