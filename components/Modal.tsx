import React, { ReactNode } from "react";

const Modal = ({
  children,
  open,
  onClose,
}: {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50"
      ></div>
      <div className="fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-50 p-5 bg-white rounded-lg border border-gray-300">
        {children}
      </div>
    </>
  );
};

export default Modal;
