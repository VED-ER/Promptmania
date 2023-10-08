import React, { ChangeEvent } from "react";

type InputProps = {
  type: string;
  id: string;
  name: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ type, id, name, required, onChange }: InputProps) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor={id} className="text-xs font-bold ms-2">
        {name}
      </label>
      <input
        onChange={onChange}
        required={required}
        type={type}
        id={id}
        placeholder=""
        className="border rounded-full px-3 py-1.5 text-sm"
      />
    </div>
  );
};

export default Input;
