import React from 'react';
import {
  Activity,
  Printer,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from '../common/Button.jsx';

export function Header({
  isSidebarOpen,
  onToggleSidebar
}) {
  const { isDark, toggleTheme } = useTheme();

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="no-print bg-white border-b border-campus-border sticky top-0 z-40 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-xs transition">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="text-campus-muted hover:text-campus-text p-2 rounded hover:bg-campus-container transition cursor-pointer flex items-center justify-center border border-campus-border"
          title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          aria-label="Toggle navigation sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-campus-container border border-campus-border flex items-center justify-center text-campus-bronze">
            <Activity size={18} />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-campus-text leading-none block">
              CampusPulse
            </span>
            <span className="text-[11px] text-campus-muted hidden sm:block mt-0.5">
              Sustainability & Energy Management
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded border border-campus-border bg-campus-bg text-campus-text hover:border-campus-bronze hover:text-campus-bronze transition cursor-pointer flex items-center justify-center"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={16} className="text-amber" />
          ) : (
            <Moon size={16} className="text-campus-muted" />
          )}
        </button>

        {/* Export / Print Audit Report */}
        <Button
          variant="secondary"
          size="sm"
          icon={Printer}
          onClick={handlePrint}
        >
          Export Report
        </Button>
      </div>
    </header>
  );
}

export default Header;

