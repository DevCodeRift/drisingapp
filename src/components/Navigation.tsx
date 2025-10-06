'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginButton from './LoginButton';
import ThemeSelector from './ThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { colors } = useTheme();

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
    <nav
      className="border-b shadow-sm"
      style={{
        backgroundColor: colors.navigation.background,
        borderColor: colors.border.primary
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold transition-colors"
              style={{
                color: colors.navigation.text
              }}
            >
              Destiny Rising
            </Link>

            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                  style={{
                    color: isActive(link.href) ? '#ffffff' : colors.navigation.text,
                    backgroundColor: isActive(link.href) ? colors.navigation.active : 'transparent',
                    border: isActive(link.href) ? `1px solid ${colors.navigation.active}` : 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-md"
                  style={{
                    color: isActive('/admin') ? '#ffffff' : colors.navigation.text,
                    backgroundColor: isActive('/admin') ? colors.accent : 'transparent',
                    border: isActive('/admin') ? `1px solid ${colors.accent}` : 'none'
                  }}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden px-4 pb-3 space-y-2 border-t"
        style={{
          backgroundColor: colors.navigation.background,
          borderColor: colors.border.primary
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-3 text-base font-medium transition-colors rounded-lg min-h-[44px] flex items-center"
            style={{
              color: isActive(link.href) ? '#ffffff' : colors.navigation.text,
              backgroundColor: isActive(link.href) ? colors.navigation.active : 'transparent',
              border: isActive(link.href) ? `1px solid ${colors.navigation.active}` : 'none'
            }}
          >
            {link.label}
          </Link>
        ))}
        {session && (
          <Link
            href="/admin"
            className="block px-4 py-3 text-base font-medium transition-colors rounded-lg min-h-[44px] flex items-center"
            style={{
              color: isActive('/admin') ? '#ffffff' : colors.navigation.text,
              backgroundColor: isActive('/admin') ? colors.accent : 'transparent',
              border: isActive('/admin') ? `1px solid ${colors.accent}` : 'none'
            }}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
