import React from 'react';
import ERC20Select from './ERC20Select';
import InputControlled from '../UI/InputControlled';

const SendTab = () => {
  return (
    <div className="flex flex-col gap-y-7">
      <InputControlled
        label="Recipient"
        description="Address of the recipient"
      />
      <ERC20Select />
      <InputControlled label="Amount" description="Amount you want to send" />
    </div>
  );
};

export default SendTab;
