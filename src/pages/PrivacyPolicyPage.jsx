import React from 'react';
import { ShieldCheck, Lock, Database, UserCheck, FileText } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';

export function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card
        title="CampusPulse Institutional Privacy Policy"
        subtitle="Last revised: October 2026 | Enterprise Telemetry Governance Framework"
        action={<Badge variant="emerald">Compliant FERPA / GDPR</Badge>}
      >
        <div className="space-y-6 text-xs text-campus-muted leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="font-serif font-bold text-base text-campus-text flex items-center gap-2">
              <Database size={16} className="text-campus-bronze" />
              <span>1. Telemetry Scope and Sensor Data Collection</span>
            </h4>
            <p>
              CampusPulse operates exclusively as an institutional resource and building management telemetry system. Data collected by the platform comprises physical energy meter readings (kilowatt-hours), acoustic water flow volumes (liters), sub-meter identifier hashes, facility occupancy schedules, and thermal HVAC log indices.
            </p>
            <p>
              CampusPulse does not collect, record, process, or correlate personal student records, biometric identities, personal mobile device mac addresses, academic transcripts, or sensitive personal data defined under Article 9 of the EU GDPR or the United States Family Educational Rights and Privacy Act (FERPA).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h4 className="font-serif font-bold text-base text-campus-text flex items-center gap-2">
              <UserCheck size={16} className="text-campus-bronze" />
              <span>2. Administrator and Operator Credentials</span>
            </h4>
            <p>
              Access to the platform is restricted to authorized campus facility engineers, sustainability auditors, and administrative operators. We collect institutional email addresses, hashed authentication credentials, and access timestamps strictly for platform security auditing and audit-trail logging.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h4 className="font-serif font-bold text-base text-campus-text flex items-center gap-2">
              <Lock size={16} className="text-campus-bronze" />
              <span>3. Data Storage, Encryption, and Retention</span>
            </h4>
            <p>
              All telemetry transmissions occur over encrypted TLS 1.3 tunnels. At rest, database records and historical time-series logs are protected with AES-256 encryption. Institutional sensor logs are retained in accordance with university document retention schedules, typically up to 7 years for environmental compliance and ESG certification verification.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="font-serif font-bold text-base text-campus-text flex items-center gap-2">
              <ShieldCheck size={16} className="text-campus-bronze" />
              <span>4. Data Disclosure and Third-Party Dissemination</span>
            </h4>
            <p>
              CampusPulse does not sell, license, or monetize institutional utility data. Telemetry logs are shared exclusively with authorized institutional representatives and approved state or environmental verification bodies conducting accredited carbon emission audits.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h4 className="font-serif font-bold text-base text-campus-text flex items-center gap-2">
              <FileText size={16} className="text-campus-bronze" />
              <span>5. Inquiries and Compliance Contact</span>
            </h4>
            <p>
              Inquiries regarding institutional telemetry auditing or data privacy inquiries should be addressed to the University Sustainability Directorate or the designated Campus Data Protection Officer at <code>privacy@campuspulse.internal</code>.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}

export default PrivacyPolicyPage;
