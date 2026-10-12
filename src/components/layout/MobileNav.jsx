import React from 'react';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Grid,
  Menu
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';

/**
 * MobileNav Component
 * Floating frosted glass bottom navigation bar for mobile devices.
 * Gives 1-tap instant access to core Analytics Views without opening a drawer.
 */
export function MobileNav({
  activeTab,
  onSelectTab,
  onToggleSidebar
}) {
  const { anomalies } = useTelemetry();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'building-drilldown', label: 'Buildings', icon: Building2 },
    {
      id: 'anomalies',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: anomalies.length > 0 ? anomalies.length : null
    },
    { id: 'spatial', label: 'Heatmap', icon: Grid }
  ];

  return (
    <nav
      className="no-print lg:hidden fixed bottom-3 inset-x-3 z-50 transition"
      aria-label="Mobile navigation"
    >
      <div className="glass-nav mx-auto max-w-md px-2 py-1.5 flex items-center justify-around rounded-2xl shadow-lg border border-campus-border/70 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'text-campus-bronze font-bold bg-campus-bronze-light/70 shadow-xs'
                  : 'text-campus-muted hover:text-campus-text hover:bg-campus-container/40'
              }`}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-amber text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-campus-muted hover:text-campus-text hover:bg-campus-container/40 transition cursor-pointer"
          title="All Tools & Scenarios"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} strokeWidth={2} />
          <span className="text-[10px] mt-0.5 tracking-tight leading-none">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}

export default MobileNav;
