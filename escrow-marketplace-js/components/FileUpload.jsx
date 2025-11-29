"use client";

export default function FileUpload({ label, onChange }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleChange}
        className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      <p className="text-xs text-gray-500">
        Frontend-only. File is not uploaded to any server.
      </p>
    </div>
  );
}
