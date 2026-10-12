import React, { useState } from 'react';
import { Globe, RefreshCw, Server, KeyRound } from 'lucide-react';
import { DOMAIN_CONFIG } from '../config/domain.config.js';
import DomainService from '../api/domainService.js';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Input from '../components/common/Input.jsx';

export function CustomDomainPage() {
  const { addToast } = useTelemetry();
  const [domainConfig, setDomainConfig] = useState(DomainService.getSavedDomainConfig());
  const [customDomainInput, setCustomDomainInput] = useState(domainConfig.domain);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyDomain = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const updated = await DomainService.verifyDomain(customDomainInput);
      setDomainConfig(updated);
      addToast(`Domain ${updated.domain} verified and connected successfully`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Configuration & DNS Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Domain Connection Form */}
        <Card
          title="Domain Settings"
          subtitle="Configure institutional hostname routing and SSL verification"
        >
          <form onSubmit={handleVerifyDomain} className="space-y-4">
            <div className="p-3 rounded bg-campus-container border border-campus-border text-xs flex items-center justify-between">
              <div>
                <span className="text-campus-muted block text-[10px] uppercase font-bold">Active Domain:</span>
                <span className="font-semibold text-campus-text text-sm">{domainConfig.domain}</span>
              </div>
              <Badge variant="emerald">{domainConfig.status}</Badge>
            </div>

            <Input
              label="Domain Hostname"
              type="text"
              required
              value={customDomainInput}
              onChange={(e) => setCustomDomainInput(e.target.value)}
              placeholder="pulse.university.edu"
              helperText="Institutional hostname (e.g., pulse.university.edu)."
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isVerifying}
              icon={RefreshCw}
              className="w-full"
            >
              {isVerifying ? 'Validating DNS...' : 'Verify & Connect Domain'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-campus-border text-xs text-campus-muted space-y-2">
            <div className="flex justify-between">
              <span>SSL Encryption:</span>
              <span className="font-semibold text-emerald">{domainConfig.sslStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Certificate:</span>
              <span className="font-semibold text-campus-text">{DOMAIN_CONFIG.CERTIFICATE_AUTHORITY}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Verified:</span>
              <span className="text-campus-text">
                {new Date(domainConfig.lastVerifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Right: DNS Records Instructions */}
        <div className="lg:col-span-2">
          <Card
            title="DNS Records"
            subtitle="Add the following DNS records to your institutional domain registrar"
          >

            <div className="table-container mb-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Host / Name</th>
                    <th>Value / Target</th>
                    <th>TTL</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {DOMAIN_CONFIG.DNS_INSTRUCTIONS.map((rec, i) => (
                    <tr key={i}>
                      <td><Badge variant="bronze">{rec.type}</Badge></td>
                      <td className="font-mono font-semibold">{rec.host}</td>
                      <td className="font-mono text-campus-text select-all">{rec.value}</td>
                      <td>{rec.ttl}</td>
                      <td className="text-campus-muted">{rec.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded bg-campus-container border border-campus-border text-xs text-campus-muted space-y-2">
              <div className="flex items-center gap-2 font-semibold text-campus-text">
                <KeyRound size={14} className="text-campus-bronze" />
                <span>Automatic TLS Certificate Provisioning</span>
              </div>
              <p className="leading-relaxed">
                Once DNS records are propagated, the ingress proxy automatically negotiates a dedicated TLS 1.3 certificate with HTTP Strict Transport Security (HSTS).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CustomDomainPage;
