import React from 'react';
import { ENV } from '../../config/env.config.js';

export function Footer({ onSelectTab }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="no-print bg-white border-t border-campus-border py-3.5 px-4 lg:px-6 mt-auto text-xs text-campus-muted">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-campus-text">{ENV.APP_NAME}</span>
          <span>&copy; {currentYear} Institutional Sustainability Operations</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => onSelectTab('privacy-policy')}
            className="text-campus-muted hover:text-campus-text transition cursor-pointer"
          >
            Privacy Policy
          </button>

          <span className="text-campus-border">|</span>

          <button
            onClick={() => onSelectTab('terms-of-service')}
            className="text-campus-muted hover:text-campus-text transition cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

