import React from "react";

export default function Input({ label, type, value, onChange, ...rest }) {
  return (
    <label className="grid">
      <span className="text-lg font-bold">{label}</span>
      <input
        required
        value={value}
        onChange={onChange}
        className="p-2 border rounded-lg border-slate-6 bg-transparent"
        {...rest}
      />
    </label>
  );
}
