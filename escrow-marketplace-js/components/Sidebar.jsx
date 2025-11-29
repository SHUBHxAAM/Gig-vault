import Link from "next/link";

export default function Sidebar({ role }) {
  const links =
    role === "worker"
      ? [
          { href: "/worker/dashboard", label: "Dashboard" },
          { href: "/worker/progress", label: "Submit Progress" },
          { href: "/escrow/status", label: "Escrow Status" },
        ]
      : role === "client"
      ? [
          { href: "/client/dashboard", label: "Dashboard" },
          { href: "/client/payment", label: "Payments" },
          { href: "/escrow/status", label: "Escrow Status" },
        ]
      : [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/escrow/status", label: "Escrow Status" },
        ];

  return (
    <aside className="w-full md:w-64 bg-white border rounded-xl p-4 space-y-3 md:sticky md:top-4 h-fit">
      <h2 className="font-semibold capitalize">{role} Panel</h2>
      <nav className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
