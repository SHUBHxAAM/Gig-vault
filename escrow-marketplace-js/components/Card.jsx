export default function Card({ title, children, footer }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
      {title && (
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">
          {title}
        </h3>
      )}
      <div className="text-sm text-gray-700">{children}</div>
      {footer && <div className="pt-2 border-t text-xs">{footer}</div>}
    </div>
  );
}
