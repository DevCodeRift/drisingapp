'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: '/tasks', label: 'Tasks' },
    { href: '/builds', label: 'Builds' },
    { href: '/news', label: 'News' },
    { href: '/lfg', label: 'LFG' },
    { href: '/clans', label: 'Clans' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-text-primary">
              Destiny Rising
            </Link>

            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-destiny-orange border-b-2 border-destiny-orange'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-destiny-purple border-b-2 border-destiny-purple'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden px-4 pb-3 space-y-1 bg-white border-t border-gray-100">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 text-base font-medium transition-colors ${
              isActive(link.href)
                ? 'text-destiny-orange bg-orange-50'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {session && (
          <Link
            href="/admin"
            className={`block px-3 py-2 text-base font-medium transition-colors ${
              isActive('/admin')
                ? 'text-destiny-purple bg-purple-50'
                : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
