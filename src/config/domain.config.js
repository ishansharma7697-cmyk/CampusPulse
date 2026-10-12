import { ENV } from './env.config.js';

/**
 * Custom Domain Verification & Networking Configuration
 * Used by domain management service and setup UI.
 */
export const DOMAIN_CONFIG = Object.freeze({
  DEFAULT_DOMAIN: ENV.DOMAIN.DEFAULT_CUSTOM_DOMAIN,
  TARGET_CNAME: ENV.DOMAIN.CNAME_TARGET,
  VERIFICATION_TXT_PREFIX: '_campuspulse-challenge',
  DNS_INSTRUCTIONS: [
    {
      type: 'CNAME',
      host: 'pulse',
      value: ENV.DOMAIN.CNAME_TARGET,
      ttl: '3600',
      description: 'Routes campus subdomain traffic to the telemetry ingestion endpoint.'
    },
    {
      type: 'TXT',
      host: '_campuspulse-challenge.pulse',
      value: 'campuspulse-site-verification=cp_inst_9b8acb94_token',
      ttl: '3600',
      description: 'Cryptographically verifies institutional ownership of the domain.'
    }
  ],
  CERTIFICATE_AUTHORITY: 'Let\'s Encrypt / Institutional Intermediate CA',
  MIN_TLS_VERSION: 'TLS 1.3'
});
