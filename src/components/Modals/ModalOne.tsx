// components/ReusableModal.tsx
import React, { ReactNode } from "react";

interface IAction {
  label: string;
  onClick: () => void;
  isCancel?: boolean;
}

interface IReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: IAction[];
}

const ReusableModal: React.FC<IReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`btn ${action.isCancel ? "btn-ghost" : "bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white transition"}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ReusableModal;

