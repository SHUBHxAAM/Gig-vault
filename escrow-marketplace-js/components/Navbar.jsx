"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/utils/storage";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
            EM
          </span>
          <span className="font-semibold text-lg">Escrow Marketplace</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {!user && (
            <>
              <Link
                href="/client/login"
                className="px-3 py-1 text-gray-700 hover:text-primary-600"
              >
                Client Login
              </Link>
              <Link
                href="/worker/login"
                className="px-3 py-1 text-gray-700 hover:text-primary-600"
              >
                Worker Login
              </Link>
              <Link
                href="/admin/login"
                className="px-3 py-1 text-gray-700 hover:text-primary-600"
              >
                Admin
              </Link>
            </>
          )}
          {user && (
            <>
              <span className="text-xs sm:text-sm text-gray-600">
                {user.role.toUpperCase()} &middot; {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
