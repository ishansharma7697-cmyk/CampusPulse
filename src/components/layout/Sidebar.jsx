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
  PanelLeftClose,
  FileText,
  Shield,
  Activity
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onSelectTab
}) {
  const { anomalies, rawDataset } = useTelemetry();

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItemClass = (tabId) => {
    const isActive = activeTab === tabId;
    return `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
      isActive
        ? 'bg-campus-bronze-light text-campus-bronze font-bold shadow-xs border border-campus-bronze/30'
        : 'text-campus-muted hover:bg-campus-container/60 hover:text-campus-text'
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay with Frosted Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-md transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Glassmorphic Sidebar Container */}
      <aside
        className={`sidebar-wrapper no-print glass-sidebar ${
          isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="w-64 h-full flex flex-col justify-between">
          
          {/* STATIC TOP SECTION: Analytics Views (Pinned & Never Scrolls Away) */}
          <div className="static-analytics-views p-4 pb-3 border-b border-campus-border/60 bg-campus-card/40 backdrop-blur-lg">
            {/* Collapse Button Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-campus-border/50">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-campus-bronze" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-campus-text">
                  Telemetry Engine
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-campus-muted hover:text-campus-text hover:bg-campus-container/60 transition cursor-pointer"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            {/* Analytics Views Section Title */}
            <div className="px-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider text-campus-bronze uppercase">
                Analytics Views
              </span>
            </div>

            {/* Primary Analytics Views Navigation (Always Visible & Static) */}
            <nav className="space-y-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
                title="Executive Overview Dashboard"
              >
                <LayoutDashboard size={15} />
                <span>Executive Overview</span>
              </button>
              <button
                onClick={() => handleNavClick('building-drilldown')}
                className={navItemClass('building-drilldown')}
                title="Building Facility Drilldown"
              >
                <Building2 size={15} />
                <span>Building Drilldown</span>
              </button>
              <button
                onClick={() => handleNavClick('anomalies')}
                className={`${navItemClass('anomalies')} justify-between`}
                title="Telemetry Anomaly Ledger"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={15} />
                  <span>Anomaly Alerts</span>
                </div>
                {anomalies.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-light text-amber border border-amber/40 shadow-xs">
                    {anomalies.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('spatial')}
                className={navItemClass('spatial')}
                title="24x7 Spatial Matrix"
              >
                <Grid size={15} />
                <span>24x7 Spatial Matrix</span>
              </button>
            </nav>
          </div>

          {/* SECONDARY SCROLLABLE SECTION: Tools, Scenarios & Governance */}
          <div className="flex-1 overflow-y-auto p-4 pt-3 space-y-5 custom-glass-scrollbar">
            {/* Section 2: Tools & Data */}
            <div>
              <div className="text-[10px] font-bold tracking-wider text-campus-muted uppercase px-2 mb-1.5">
                Financials &amp; Data
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
                  <span>Data Ingestion</span>
                </button>
                <button
                  onClick={() => handleNavClick('esg-report')}
                  className={navItemClass('esg-report')}
                >
                  <FileCheck2 size={15} />
                  <span>ESG Impact Audit</span>
                </button>
                <button
                  onClick={() => handleNavClick('custom-domain')}
                  className={navItemClass('custom-domain')}
                >
                  <Globe size={15} />
                  <span>Custom Domain</span>
                </button>
              </nav>
            </div>

            {/* Section 3: Institutional Governance */}
            <div>
              <div className="text-[10px] font-bold tracking-wider text-campus-muted uppercase px-2 mb-1.5">
                Governance &amp; Terms
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('privacy-policy')}
                  className={navItemClass('privacy-policy')}
                >
                  <Shield size={15} />
                  <span>Privacy Policy</span>
                </button>
                <button
                  onClick={() => handleNavClick('terms-of-service')}
                  className={navItemClass('terms-of-service')}
                >
                  <FileText size={15} />
                  <span>Terms of Service</span>
                </button>
              </nav>
            </div>
          </div>

          {/* STATIC FOOTER STATUS INFO */}
          <div className="p-3 border-t border-campus-border/60 bg-campus-card/30 backdrop-blur-md text-[11px] text-campus-muted">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald inline-block shadow-xs"></span>
                <span>Telemetry Status</span>
              </span>
              <span className="font-mono text-[10px] text-campus-bronze font-bold">
                {rawDataset.length} pts
              </span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;
