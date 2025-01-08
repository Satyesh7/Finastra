import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, className }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium mb-2">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded"
    />
  </div>
);
