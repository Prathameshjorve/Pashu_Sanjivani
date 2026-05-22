"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Stethoscope, User, LogOut, Brain, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Predict Disease",
    href: "/predict",
    icon: Brain,
  },
  {
    label: "My Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Find Vets",
    href: "/vets",
    icon: Stethoscope,
  },
  {
    label: "Vet Dashboard",
    href: "/vet/dashboard",
    icon: ShieldCheck,
  },
  {
    label: "Admin",
    href: "/admin/dashboard",
    icon: User,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredNavItems = navItems.filter((item) => {
    if (role === 'vet') return item.href.startsWith('/vet');
    if (role === 'admin') return item.href.startsWith('/admin');
    if (role === 'farmer') return !item.href.startsWith('/vet') && !item.href.startsWith('/admin');
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="hidden lg:flex w-72 bg-white border-r shadow-sm flex-col fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-black text-green-700">
            Pashu Sanjivani
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Livestock Health AI
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = mounted && pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {navItems.find((item) => item.href === pathname)?.label ||
                "Pashu Sanjivani"}
            </h2>
            <p className="text-sm text-gray-500">
              AI-assisted livestock disease care
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold"
          >
            Logout
          </button>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}