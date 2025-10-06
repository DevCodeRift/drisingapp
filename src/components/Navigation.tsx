'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: '/weapons', label: 'Weapons' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/builds', label: 'Builds' },
    { href: '/news', label: 'News' },
    { href: '/lfg', label: 'LFG' },
    { href: '/clans', label: 'Clans' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Destiny Rising
            </Link>

            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive(link.href)
                      ? 'text-blue-600 bg-blue-50 border border-blue-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive('/admin')
                      ? 'text-purple-600 bg-purple-50 border border-purple-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
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
      <div className="md:hidden px-4 pb-3 space-y-2 bg-white border-t border-gray-200">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg min-h-[44px] flex items-center ${
              isActive(link.href)
                ? 'text-blue-600 bg-blue-50 border border-blue-200'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
        {session && (
          <Link
            href="/admin"
            className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg min-h-[44px] flex items-center ${
              isActive('/admin')
                ? 'text-purple-600 bg-purple-50 border border-purple-200'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
