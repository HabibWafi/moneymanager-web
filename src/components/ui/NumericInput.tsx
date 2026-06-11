"use client";
import { useRef, useEffect } from "react";

interface NumericInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function formatWithDots(raw: string): string {
  const num = raw.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("id-ID");
}

export default function NumericInput({ value, onChange, placeholder = "0", className = "", disabled }: NumericInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number | null>(null);

  useEffect(() => {
    if (ref.current && cursorRef.current !== null) {
      const el = ref.current;
      const formatted = formatWithDots(value);
      const rawDigitsBefore = value.replace(/\D/g, "").slice(0, cursorRef.current).length;
      let pos = 0;
      let digits = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digits++;
          if (digits >= rawDigitsBefore) {
            pos = i + 1;
            break;
          }
        }
      }
      if (digits < rawDigitsBefore) pos = formatted.length;
      el.setSelectionRange(pos, pos);
      cursorRef.current = null;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursor = input.selectionStart || 0;
    const prev = formatWithDots(value);
    const rawInput = input.value;
    const dotsBeforeCursor = rawInput.slice(0, cursor).replace(/[^.]/g, "").length;
    cursorRef.current = cursor - dotsBeforeCursor;
    const raw = rawInput.replace(/\./g, "").replace(/\D/g, "");
    onChange(raw);
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={formatWithDots(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
}
