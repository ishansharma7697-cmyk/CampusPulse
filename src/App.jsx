import React, { useState, useEffect, useRef } from 'react';
import { TelemetryProvider } from './context/TelemetryContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import GlobalFilterBar from './components/layout/GlobalFilterBar.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import Footer from './components/layout/Footer.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';

// Pages
import DashboardPage from './pages/DashboardPage.jsx';
import BuildingDrilldownPage from './pages/BuildingDrilldownPage.jsx';
import AnomaliesPage from './pages/AnomaliesPage.jsx';
import SpatialMatrixPage from './pages/SpatialMatrixPage.jsx';
import RoiCalculatorPage from './pages/RoiCalculatorPage.jsx';
import DataImportPage from './pages/DataImportPage.jsx';
import EsgReportPage from './pages/EsgReportPage.jsx';
import CustomDomainPage from './pages/CustomDomainPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';

import './App.css';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const mainContentRef = useRef(null);
  
  // Initialize sidebar open state based on screen width
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  // Handle window resizing gracefully
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Scroll to top when active tab changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const showGlobalFilter = [
    'dashboard',
    'building-drilldown',
    'anomalies',
    'spatial',
    'calculator',
    'esg-report'
  ].includes(activeTab);

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Navigation Bar (Frosted Glass & Static) */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content Workspace Layout */}
      <div className="main-layout">
        {/* Navigation Sidebar (Collapsible & Non-overlapping, Static Analytics Views) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Content Workarea (Smooth Internal Scroll Container) */}
        <main ref={mainContentRef} className="content-workarea">
          {/* Synchronized Global Filter Bar */}
          {showGlobalFilter && <GlobalFilterBar />}

          {/* Active Tab View */}
          <div className="tab-pane-container">
            {activeTab === 'dashboard' && <DashboardPage onSelectTab={setActiveTab} />}
            {activeTab === 'building-drilldown' && <BuildingDrilldownPage />}
            {activeTab === 'anomalies' && <AnomaliesPage />}
            {activeTab === 'spatial' && <SpatialMatrixPage />}
            {activeTab === 'calculator' && <RoiCalculatorPage />}
            {activeTab === 'data-import' && <DataImportPage onSelectTab={setActiveTab} />}
            {activeTab === 'esg-report' && <EsgReportPage />}
            {activeTab === 'custom-domain' && <CustomDomainPage />}
            {activeTab === 'privacy-policy' && <PrivacyPolicyPage />}
            {activeTab === 'terms-of-service' && <TermsOfServicePage />}
          </div>

          {/* Compliance Footer inside scrollable workarea for clean mobile scrolling */}
          <div className="mt-8 mb-6 lg:mb-2">
            <Footer onSelectTab={setActiveTab} />
          </div>
        </main>
      </div>

      {/* Mobile Glassmorphic Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TelemetryProvider>
          <AppContent />
        </TelemetryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
