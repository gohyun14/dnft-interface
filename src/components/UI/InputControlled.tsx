import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

type InputControlledProps = {
  label: string;
  description?: string;
  value: string;
  setValue: (arg: any) => void;
  error?: boolean;
  errorMessage?: string;
  isNumber?: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const InputControlled = ({
  label,
  description,
  value,
  setValue,
  error,
  errorMessage,
  isNumber,
}: InputControlledProps) => {
  return (
    <div>
      <label
        htmlFor="input"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          name="input"
          id="input"
          className={classNames(
            'block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm',
            error
              ? 'border-red-600  focus:border-red-600'
              : 'border-gray-300  focus:border-indigo-500'
          )}
          value={value}
          onChange={(e) => {
            if (isNumber) {
              const re = /^\d*\.?\d*$/;
              if (e.target.value === '' || re.test(e.target.value)) {
                setValue(e.target.value);
              }
            } else {
              setValue(e.target.value);
            }
          }}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {description && (
        <p
          className={classNames(
            'mt-2 text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}
          id="input-description"
        >
          {error && errorMessage ? errorMessage : description}
        </p>
      )}
    </div>
  );
};

export default InputControlled;
