"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "列表視圖", href: "/list" },
  { label: "月曆視圖", href: "/calendar" },
];

export default function ViewTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-t-md border-b-2 transition-colors font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${active ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950" : "border-transparent text-gray-500 hover:text-blue-500"}`}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
