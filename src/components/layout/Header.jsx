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
    <header className="no-print glass-header sticky top-0 z-40 px-3.5 sm:px-6 py-2.5 flex items-center justify-between border-b border-campus-border/60 transition">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="text-campus-muted hover:text-campus-text p-2 rounded-lg hover:bg-campus-container/60 transition cursor-pointer flex items-center justify-center border border-campus-border/60 glass-panel"
          title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          aria-label="Toggle navigation sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
        </button>

        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-campus-bronze-light/70 border border-campus-bronze/30 flex items-center justify-center text-campus-bronze shadow-xs glass-panel">
            <Activity size={18} />
          </div>
          <div>
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-campus-text leading-none block">
              CampusPulse
            </span>
            <span className="text-[10px] sm:text-[11px] text-campus-muted hidden sm:block mt-0.5">
              Institutional Resource Telemetry
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-campus-border/60 bg-campus-bg/60 text-campus-text hover:border-campus-bronze/60 hover:text-campus-bronze transition cursor-pointer flex items-center justify-center glass-panel"
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
          className="glass-btn hidden xs:inline-flex sm:inline-flex"
        >
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Print</span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
