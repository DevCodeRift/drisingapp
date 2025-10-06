'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/weapons', label: 'Weapons' },
    { href: '/admin/mods', label: 'Mods' },
    { href: '/admin/mod-attributes', label: 'Mod Attributes' },
    { href: '/admin/traits', label: 'Traits' },
    { href: '/admin/perks', label: 'Perks' },
    { href: '/admin/catalysts', label: 'Catalysts' },
    { href: '/admin/characters', label: 'Characters' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
