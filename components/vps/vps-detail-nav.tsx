"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type VpsDetailNavProps = {
  vpsId: string;
};

const navItems = (vpsId: string) => [
  { href: `/vps/${vpsId}`, label: "Métricas" },
  { href: `/vps/${vpsId}/backups`, label: "Backups" },
];

export default function VpsDetailNav({ vpsId }: VpsDetailNavProps) {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        Secciones
      </p>

      <nav className="mt-3 flex flex-col gap-2">
        {navItems(vpsId).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
