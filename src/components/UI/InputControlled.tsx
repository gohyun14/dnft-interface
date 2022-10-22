import React from 'react';

type InputControlledProps = {
  label: string;
  description?: string;
  value: string;
  setValue: (arg: string) => void;
};

const InputControlled = ({
  label,
  description,
  value,
  setValue,
}: InputControlledProps) => {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="email"
          id="email"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {description}
        </p>
      )}
    </div>
  );
};

export default InputControlled;
