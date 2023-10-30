import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

import { handleConfirm } from '../utils/aws-amplify-helpers';

const ConfirmationModal: React.FC = () => {
  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const onSubmit = async () => {
    const result = await handleConfirm(username, confirmationCode);
    if (result.success) {
      console.log(`Successfully confirmed user ${username}`);
      // TODO: redirect to login page?
      // Close modal
    } else {
      console.log(`Failed to confirm user ${username}`);
    }
  };


  return (
    <div className="confirmationModal">
      <h2>Confirm Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
      />
      <button onClick={onSubmit}>Confirm</button>
    </div>
  );
};

export default ConfirmationModal;




