import React from 'react';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Grid,
  Calculator,
  UploadCloud,
  FileCheck2,
  Globe,
  PanelLeftClose
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onSelectTab
}) {
  const { anomalies } = useTelemetry();

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItemClass = (tabId) => {
    const isActive = activeTab === tabId;
    return `w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition cursor-pointer text-left ${
      isActive
        ? 'bg-campus-bronze-light text-campus-bronze font-semibold'
        : 'text-campus-muted hover:bg-campus-container hover:text-campus-text'
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-wrapper no-print ${
          isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="w-64 h-full flex flex-col justify-between overflow-y-auto p-4 space-y-6">
          <div className="space-y-5">
            {/* Collapse Button Header */}
            <div className="flex items-center justify-between pb-2 border-b border-campus-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-campus-muted">
                Navigation
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded text-campus-muted hover:text-campus-text hover:bg-campus-container transition"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            {/* Section 1: Analytics */}
            <div>
              <div className="text-[10px] font-bold tracking-wider text-campus-muted uppercase px-3 mb-1.5">
                Analytics
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={navItemClass('dashboard')}
                >
                  <LayoutDashboard size={15} />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => handleNavClick('building-drilldown')}
                  className={navItemClass('building-drilldown')}
                >
                  <Building2 size={15} />
                  <span>Buildings</span>
                </button>
                <button
                  onClick={() => handleNavClick('anomalies')}
                  className={`${navItemClass('anomalies')} justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={15} />
                    <span>Anomalies</span>
                  </div>
                  {anomalies.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-light text-amber border border-amber">
                      {anomalies.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('spatial')}
                  className={navItemClass('spatial')}
                >
                  <Grid size={15} />
                  <span>Hourly Heatmap</span>
                </button>
              </nav>
            </div>

            {/* Section 2: Tools & Data */}
            <div>
              <div className="text-[10px] font-bold tracking-wider text-campus-muted uppercase px-3 mb-1.5">
                Tools &amp; Data
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('calculator')}
                  className={navItemClass('calculator')}
                >
                  <Calculator size={15} />
                  <span>ROI Calculator</span>
                </button>
                <button
                  onClick={() => handleNavClick('data-import')}
                  className={navItemClass('data-import')}
                >
                  <UploadCloud size={15} />
                  <span>Data Import</span>
                </button>
                <button
                  onClick={() => handleNavClick('esg-report')}
                  className={navItemClass('esg-report')}
                >
                  <FileCheck2 size={15} />
                  <span>ESG Report</span>
                </button>
              </nav>
            </div>

            {/* Section 3: System */}
            <div>
              <div className="text-[10px] font-bold tracking-wider text-campus-muted uppercase px-3 mb-1.5">
                System
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('custom-domain')}
                  className={navItemClass('custom-domain')}
                >
                  <Globe size={15} />
                  <span>Domain Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

