import { ReactNode } from 'react';

interface UswdsInputProps {
  label: string;
  type?: 'text' | 'date' | 'email' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function UswdsInput({ label, type = 'text', value, onChange, placeholder }: UswdsInputProps) {
  return (
    <div>
      <label className="block text-base font-bold text-[#1b1b1b] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3 py-2 border border-[#565c65] bg-white text-[#1b1b1b] focus:outline-none focus:border-[#0050d8] focus:ring-2 focus:ring-[#0050d8]"
      />
    </div>
  );
}

interface UswdsTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function UswdsTextarea({ label, value, onChange, rows = 6, placeholder }: UswdsTextareaProps) {
  return (
    <div>
      <label className="block text-base font-bold text-[#1b1b1b] mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-[#565c65] bg-white text-[#1b1b1b] focus:outline-none focus:border-[#0050d8] focus:ring-2 focus:ring-[#0050d8]"
      />
    </div>
  );
}

interface UswdsSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function UswdsSelect({ label, value, onChange, options, placeholder }: UswdsSelectProps) {
  return (
    <div>
      <label className="block text-base font-bold text-[#1b1b1b] mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 py-2 border border-[#565c65] bg-white text-[#1b1b1b] focus:outline-none focus:border-[#0050d8] focus:ring-2 focus:ring-[#0050d8]"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
