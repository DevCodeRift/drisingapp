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
    <nav className="bg-destiny-dark border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-destiny-orange">
              Destiny Rising
            </Link>

            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive(link.href)
                      ? 'bg-destiny-orange text-white'
                      : 'text-gray-300 hover:bg-destiny-darker hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/admin')
                      ? 'bg-destiny-purple text-white'
                      : 'text-gray-400 hover:bg-destiny-darker hover:text-white'
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
      <div className="md:hidden px-4 pb-3 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-base font-medium transition ${
              isActive(link.href)
                ? 'bg-destiny-orange text-white'
                : 'text-gray-300 hover:bg-destiny-darker hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {session && (
          <Link
            href="/admin"
            className={`block px-3 py-2 rounded-md text-base font-medium transition ${
              isActive('/admin')
                ? 'bg-destiny-purple text-white'
                : 'text-gray-400 hover:bg-destiny-darker hover:text-white'
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
