'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  href,
  children
}: {
  href: string;
  // Accepted for caller symmetry with other nav components; href already
  // carries the language prefix, so it isn't needed inside NavLink itself.
  lang?: string;
  children: React.ReactNode
}) {
  const pathname = usePathname();
  // Ensure the active detection handles the language prefix properly
  // For example, if href is "/zh/services" and pathname is "/zh/services"
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}
