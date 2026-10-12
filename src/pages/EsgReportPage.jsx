import React from 'react';
import { CloudRain, Droplet, Trees, Printer, ShieldCheck } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import { formatNumber } from '../utils/formatters.js';

export function EsgReportPage() {
  const { esg } = useTelemetry();

  return (
    <div className="space-y-6">
      <div className="card p-6 md:p-8 print-page">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-campus-border pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="emerald">Audit Standard ESG-2026</Badge>
              <span className="text-xs text-campus-muted">GHG Protocol Scope 2 Aligned</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-campus-text">
              Institutional ESG Report
            </h2>
            <p className="text-xs text-campus-muted mt-1">
              Environmental, Social, and Governance Resource Conservation Summary
            </p>
          </div>

          <div className="text-left sm:text-right flex flex-col sm:items-end">
            <div className="text-xs font-bold text-campus-bronze">CampusPulse Sustainability Records</div>
            <div className="text-xs text-campus-muted mt-0.5">{esg.reportDate}</div>
            <div className="mt-2 no-print">
              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print Report
              </Button>
            </div>
          </div>

        </div>

        {/* Sustainability Equivalents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded bg-emerald-light border border-emerald-border text-center space-y-2">
            <div className="w-12 h-12 rounded bg-white text-emerald flex items-center justify-center mx-auto shadow-xs">
              <CloudRain size={24} />
            </div>
            <div className="text-3xl font-bold font-serif text-emerald-dark">
              {formatNumber(esg.co2AvoidedKg)} kg
            </div>
            <div className="text-xs font-semibold text-emerald uppercase tracking-wider">
              Carbon Emissions Mitigated (CO2e)
            </div>
            <div className="text-[11px] text-campus-muted pt-1 border-t border-emerald-border/40">
              Standard grid factor: 0.82 kg CO2e / kWh
            </div>
          </div>

          <div className="p-5 rounded bg-blue-light border border-blue-border text-center space-y-2">
            <div className="w-12 h-12 rounded bg-white text-blue flex items-center justify-center mx-auto shadow-xs">
              <Droplet size={24} />
            </div>
            <div className="text-3xl font-bold font-serif text-blue-dark">
              {formatNumber(esg.waterSavedLiters)} L
            </div>
            <div className="text-xs font-semibold text-blue uppercase tracking-wider">
              Potable Water Conserved
            </div>
            <div className="text-[11px] text-campus-muted pt-1 border-t border-blue-border/40">
              Acoustic night leak prevention ledger
            </div>
          </div>

          <div className="p-5 rounded bg-amber-light border border-amber-border text-center space-y-2">
            <div className="w-12 h-12 rounded bg-white text-amber flex items-center justify-center mx-auto shadow-xs">
              <Trees size={24} />
            </div>
            <div className="text-3xl font-bold font-serif text-amber-dark">
              {formatNumber(esg.treesEquivalent)} Trees
            </div>
            <div className="text-xs font-semibold text-amber uppercase tracking-wider">
              Tree Planting Equivalent
            </div>
            <div className="text-[11px] text-campus-muted pt-1 border-t border-amber-border/40">
              1 mature tree absorbs ~21.8 kg CO2 / year
            </div>
          </div>
        </div>

        {/* Narrative Audit Note */}
        <div className="border-t border-campus-border pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald" />
            <h4 className="font-serif font-bold text-lg text-campus-text">
              Environmental Summary
            </h4>
          </div>

          <p className="text-xs text-campus-muted leading-relaxed">
            {esg.executiveSummary}
          </p>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-campus-muted">
            <div className="p-3 bg-campus-container rounded">
              <span className="font-semibold text-campus-text block mb-1">Methodology Standards:</span>
              Telemetry logs comply with ISO 50001 energy management frameworks and GHG Scope 2 location-based accounting rules.
            </div>
            <div className="p-3 bg-campus-container rounded">
              <span className="font-semibold text-campus-text block mb-1">Auditing Integrity:</span>
              Meters report continuously with cryptographically verified sensor hashes. Independent facility audits may inspect raw telemetry tables.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EsgReportPage;
