import React from 'react';


const RoleToggle = ({ role, setRole }) => (
  <div className={styles.toggleWrapper}>
    <button
      className={role === 'Customer' ? styles.active : ''}
      onClick={() => setRole('Customer')}
      type="button"
    >
      Customer
    </button>
    <button
      className={role === 'Agent' ? styles.active : ''}
      onClick={() => setRole('Agent')}
      type="button"
    >
      Agent
    </button>
  </div>
);

export default RoleToggle;
