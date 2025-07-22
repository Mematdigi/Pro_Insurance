import React from 'react';

const Input = ({ label, type = 'text', value, onChange, name, required = true }) => (
  <div className={styles.inputGroup}>
    {label && <label>{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={`Enter your ${label?.toLowerCase()}`}
    />
  </div>
);

export default Input;
