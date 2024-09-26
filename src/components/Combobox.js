import { Icon } from "@iconify/react";
import React, { useState, useRef, useEffect } from "react";

export default function Combobox({
  label,
  options,
  activeOptions,
  placeholder,
  setMemberData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const comboboxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        console.log(event.target);
        // If the click is outside the combobox, close the dropdown
        setIsOpen(false);
        setInputValue("");
      }
    }

    // Add event listener to detect clicks outside
    if (isOpen) {
      document.addEventListener("click", handleClickOutside, true);
    }

    // Cleanup event listener when the component is unmounted or dropdown is closed
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <span className="text-lg font-bold">{label}</span>

      <div className="flex gap-1 flex-wrap mb-1">
        {activeOptions.map((option) => (
          <span
            key={option.id}
            className="bg-blue py-1 px-2 rounded-full flex items-center text-white gap-1"
          >
            {option}
            <button
              type="button"
              onClick={() => {
                setMemberData((prev) => ({
                  ...prev,
                  activities: prev.activities.filter(
                    (activity) => activity !== option
                  ),
                }));
              }}
            >
              <Icon icon="mdi:close" />
            </button>
          </span>
        ))}
      </div>
      <div ref={comboboxRef} className="relative">
        <input
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          className="p-2 border rounded-lg border-slate-6 w-full z-20 mb-1"
          placeholder={placeholder}
        />
        {isOpen && (
          <div className="grid absolute z-0 bg-[var(--color-base)] w-full rounded-lg justify-items-start max-h-30 overflow-scroll shadow-xl border border-slate-6 empty:hidden">
            {inputValue && (
              <button
                type="button"
                className="p-2 hover:bg-[light-dark(#f1f5f9,#475569)] w-full text-start"
                onClick={() => {
                  setMemberData((prev) => ({
                    ...prev,
                    activities: [...new Set([...prev.activities, inputValue])],
                  }));
                  setInputValue("");
                }}
              >
                + Add "{inputValue}"
              </button>
            )}
            {options
              .filter(
                (option) =>
                  option.toLowerCase().includes(inputValue) &&
                  !activeOptions.includes(option)
              )
              .map((option) => (
                <button
                  key={option}
                  type="button"
                  className="p-2 hover:bg-[light-dark(#f1f5f9,#475569)] w-full text-start"
                  onClick={() => {
                    setMemberData((prev) => ({
                      ...prev,
                      activities: [...prev.activities, option],
                    }));
                  }}
                >
                  {option}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
