"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import React from "react";

const routes = [
  { path: "/buku", label: "Buku", title: "Manajemen Buku" },
  { path: "/member", label: "Member", title: "Manajemen Member" },
  { path: "/peminjaman", label: "Peminjaman", title: "Data Peminjaman" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const activeRoute = routes.find((route) => route.path === pathname) ?? routes[0];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-900 p-6 text-slate-200 lg:flex">
        <div className="mb-8">
          <h1 className="mt-2 text-2xl font-bold text-white">Sistem Perpustakaan</h1>
        </div>
        <nav className="space-y-2">
          {routes.map((route) => {
            const isActive = route.path === activeRoute.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`block rounded-lg px-3 py-2 transition hover:bg-slate-800 ${
                  isActive ? "bg-brand-500/20 font-medium text-brand-50" : "text-slate-300"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Senin, 13 April 2026</p>
                <h2 className="text-2xl font-bold text-slate-900">{activeRoute.title}</h2>
              </div>
            </div>
          </header>

          {children}

          <footer className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
            © 2026 Sistem Perpustakaan Dibuat untuk manajemen koleksi buku.
          </footer>
        </div>
      </main>
    </div>
  );
}
