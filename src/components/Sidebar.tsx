'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', color: 'violet' },
    { name: 'Communication', path: '/dashboard/communication', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'emerald' },
    { name: 'Personality', path: '/dashboard/personality', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
    { name: 'Career', path: '/dashboard/career', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'rose' },
    { name: 'Confidence', path: '/dashboard/confidence', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'pink' },
  ];

  return (
    <nav className="lg:w-72 lg:min-h-full p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-white/5">
      <div className="flex lg:flex-col items-center lg:items-stretch justify-between lg:justify-start gap-4 lg:gap-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-xl font-semibold text-white">Vocentra</h1>
            <p className="text-xs text-violet-300/60">Elevate Your Potential</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex lg:flex-col gap-1 lg:gap-2 lg:mt-8 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors 
                  ${isActive ? 'bg-' + item.color + '-500/30' : 'bg-' + item.color + '-500/20 group-hover:bg-' + item.color + '-500/30'}`}>
                  <svg className={`w-5 h-5 text-${item.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <span className={`hidden lg:block text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-white/70 group-hover:text-white'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav >
  );
}
