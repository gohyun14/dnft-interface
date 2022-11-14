import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { Fragment, Dispatch, SetStateAction } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { tokenOption } from '../send-swap/SendTab';

type SelectInputControlledProps = {
  label: string;
  description?: string;
  value: string;
  setValue: (arg: any) => void;
  error?: boolean;
  errorMessage?: string;
  isNumber?: boolean;
  secondaryLabel?: string;
  tokens: tokenOption[];
  selectedToken: tokenOption | undefined;
  onChange: (arg: tokenOption) => void;
};
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SelectInputControlled = ({
  label,
  description,
  value,
  setValue,
  error,
  errorMessage,
  isNumber,
  secondaryLabel,
  tokens,
  selectedToken,
  onChange,
}: SelectInputControlledProps) => {
  return (
    <div>
      <label
        htmlFor="input"
        className="flex flex-row justify-between text-sm font-medium text-gray-700"
      >
        {label}
        {secondaryLabel !== undefined && (
          <span className="font-normal text-gray-500">{secondaryLabel}</span>
        )}
      </label>
      <div className="relative mt-1 flex rounded-md shadow-sm">
        <Listbox value={selectedToken} onChange={onChange}>
          {({ open }) => (
            <div className=" basis-4/12">
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-r-[1px] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                  <span className="block truncate">
                    {selectedToken?.symbol}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-28 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {tokens.map((token) => (
                      <Listbox.Option
                        key={token.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={token}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate'
                              )}
                            >
                              {token.symbol}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </div>
          )}
        </Listbox>
        <input
          type="text"
          name="input"
          id="input"
          className={classNames(
            'block w-full rounded-r-md border px-3 py-2 shadow-sm sm:text-sm',
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

export default SelectInputControlled;
