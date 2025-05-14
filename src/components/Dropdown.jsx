const Dropdown = ({ label, options, value, onChange, placeholder = 'Select...' }) => {
  const normalizedOptions = Array.isArray(options)
    ? options.map((opt) =>
        typeof opt === 'string' ? { _id: opt, name: opt } : opt
      )
    : [];

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-700 font-medium">{label}</label>
      <select
        className="px-4 py-2 border rounded-md"
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {normalizedOptions.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
