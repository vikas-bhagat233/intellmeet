export default function Input({ label, type = "text", value, onChange, required = false, placeholder = "" }) {
  return (
    <div className="field">
      {label && (
        <label className="field__label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="field__input"
      />
    </div>
  )
}