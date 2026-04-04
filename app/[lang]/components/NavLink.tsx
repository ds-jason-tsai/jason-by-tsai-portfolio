'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ 
  href, 
  lang, 
  children 
}: { 
  href: string; 
  lang: string; 
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
