# CampusPulse Enterprise: Campus Sustainability & Resource Telemetry Platform

An enterprise institutional analytics platform for real-time campus energy telemetry, water consumption auditing, statistical anomaly detection, spatial heatmaps, financial ROI modeling, and ESG compliance reporting.

---

## 1. Project Organization & Folder Structure

The codebase is organized into modular layers separating presentation, state management, business calculation engines, configuration, and API transport:

```
src/
├── api/                       # Scalable API transport & client services
│   ├── client.js              # Centralized HTTP client (timeout, normalized ApiError, mock handlers)
│   ├── telemetryService.js    # Telemetry queries & scenario presets
│   ├── anomalyService.js      # Anomaly resolution & CSV export
│   ├── authService.js         # Enterprise authentication
│   ├── ingestionService.js    # Dataset ingestion & verification
│   └── domainService.js       # Custom domain DNS & SSL verification
├── assets/                    # Static platform assets
├── components/
│   ├── auth/
│   │   └── AuthModal.jsx      # Enterprise modal (Sign in, Sign up, Password recovery)
│   ├── charts/                # Chart.js visual telemetry components
│   │   ├── TrendLineChart.jsx         # Time series vs baseline model
│   │   ├── BuildingBarChart.jsx       # Energy intensity comparison
│   │   ├── SeverityDoughnutChart.jsx  # Risk severity breakdown
│   │   ├── HourlyProfileChart.jsx     # 24-hour diurnal profile
│   │   └── RoiProjectionChart.jsx     # 5-year cumulative savings projection
│   ├── common/                # Reusable design system components
│   │   ├── Badge.jsx          # Color-coded status badges (no emoji)
│   │   ├── Button.jsx         # Crisp rectangular buttons (no pill buttons)
│   │   ├── Card.jsx           # Surface card with header/action slots
│   │   ├── EmptyState.jsx     # Structured zero-data fallbacks
│   │   ├── ErrorBoundary.jsx  # React exception interceptor & recovery UI
│   │   ├── Input.jsx          # Controlled form text/number input
│   │   ├── Modal.jsx          # Accessible dialog overlay
│   │   ├── Select.jsx         # Controlled select dropdown
│   │   └── ToastContainer.jsx # Toast notification stack
│   └── layout/
│       ├── Header.jsx         # Live telemetry toggle, audit print, auth status
│       ├── Sidebar.jsx        # Navigation drawers & simulated scenarios
│       ├── GlobalFilterBar.jsx# Synced 5-axis telemetry filter engine
│       └── Footer.jsx         # Domain status & legal compliance links
├── config/                    # Externalized configuration modules
│   ├── env.config.js          # Typed environment readers and fallback constants
│   ├── domain.config.js       # Custom domain, CNAME targets & DNS challenge records
│   └── tariffs.config.js      # Tariff rates, inflation benchmarks & anomaly thresholds
├── context/                   # Centralized React state management
│   ├── AuthContext.jsx        # Authentication session & modal state
│   └── TelemetryContext.jsx   # Telemetry records, filters, anomalies & notifications
├── hooks/                     # Custom application hooks
│   ├── useAuth.js             # Hook for authentication context
│   ├── useTelemetry.js        # Hook for telemetry state & dispatchers
│   ├── useLiveSimulation.js   # Hook for streaming meter simulation
│   └── useAnomalies.js        # Hook for anomaly filters & CSV export
├── pages/                     # Dedicated view modules
│   ├── DashboardPage.jsx      # Executive KPIs, trend comparisons & diagnostics
│   ├── BuildingDrilldownPage.jsx # Facility diurnal load profile & health index
│   ├── AnomaliesPage.jsx      # Anomaly ledger, real-time search & resolution
│   ├── SpatialMatrixPage.jsx  # 24x7 facility load intensity matrix
│   ├── RoiCalculatorPage.jsx  # Interactive tariff settings & 5-year projections
│   ├── DataImportPage.jsx     # CSV/XLSX drag-and-drop ingestion portal
│   ├── EsgReportPage.jsx      # Institutional GHG Scope 2 carbon mitigation audit
│   ├── CustomDomainPage.jsx   # Custom domain DNS records, CNAME & TLS verification
│   ├── PrivacyPolicyPage.jsx  # Institutional GDPR/FERPA telemetry compliance
│   └── TermsOfServicePage.jsx # Master telemetry license & service agreements
├── services/                  # Pure calculation & data parsing engines
│   ├── anomalyEngine.js       # Statistical variance thresholds & diagnostics
│   ├── dataGenerator.js       # Deterministic telemetry generator & live simulator
│   ├── esgEngine.js           # Carbon factor & tree equivalent formulas
│   ├── fileParser.js          # CSV/XLSX parser with m³-to-L normalization
│   └── financialEngine.js     # Tariff formulas, annualization & ROI models
├── types/
│   └── telemetry.d.ts         # TypeScript interface definitions
├── utils/
│   ├── formatters.js          # Standard currency, energy unit & date formatting
│   └── validators.js          # Email, password & domain syntax validators
├── App.css                    # Grid & layout utilities
├── index.css                  # Enterprise design tokens & Vanilla CSS system
├── App.jsx                    # Root application shell
└── main.jsx                   # React 19 entry point
```

---

## 2. Business Logic vs. Presentation Layer Separation

All complex algorithms are isolated from UI components in testable, pure functions:

| Engine / Service | File Path | Responsibility |
|---|---|---|
| **Anomaly Detection Engine** | `src/services/anomalyEngine.js` | Evaluates readings against baseline models using percentage variance thresholds. Tags severity (Critical, High, Medium, Low) and generates diagnostic findings. |
| **Financial & ROI Engine** | `src/services/financialEngine.js` | Calculates current monetary loss from excess kilowatt-hours and water leakage, annualizes targets, and compounds 5-year inflation adjustments. |
| **ESG & Carbon Footprint Engine** | `src/services/esgEngine.js` | Converts excess electricity into avoided metric tons of CO2e using regional grid factors (0.82 kg/kWh) and computes mature tree absorption equivalents (21.8 kg/year). |
| **Ingestion File Parser** | `src/services/fileParser.js` | Normalizes CSV and XLSX file columns, handles header discrepancies, and executes automated metric conversions ($m^3 \rightarrow L$). |
| **Synthetic Telemetry Generator** | `src/services/dataGenerator.js` | Produces deterministic diurnal profiles, occupied vs. unoccupied schedules, and simulates known equipment fault scenarios. |

---

## 3. Strict Institutional Design Standards

In accordance with strict enterprise governance rules:
- **No Purple Gradients**: Visual tokens utilize a tailored institutional palette: Warm Paper (`#f9f8f6`), Container Grey (`#f2efe9`), Bronze Accent (`#8c672b`), Emerald (`#059669`), and Deep Slate (`#1c1a17`).
- **No Pill-Shaped Buttons**: All buttons use crisp rectangular geometry with subtle 6px corner radii (`--radius-md: 6px`).
- **No Fake Reviews or Counter Metrics**: Removed vanity copy. Metrics reflect computed physical telemetry.
- **No Vague Marketing Text**: Clean, precise institutional terminology suitable for campus facility managers and board presentations.
- **No Emoji Glyphs**: Crisp, standardized SVG icons via `lucide-react`.
- **No Em Dashes**: Standardized hyphens (`-`), colons (`:`), or parentheses.
- **No Made with AI Tags**: Codebase and interfaces contain zero AI watermarks or slop copy.

---

## 4. Launch Readiness Requirements

The platform includes all mandatory deployment artifacts:
1. **Connected Custom Domain**: Managed under `CustomDomainPage.jsx` (`pulse.university.edu`) with active DNS configuration guidelines for CNAME and TXT challenge verification.
2. **Platform Favicon**: Custom SVG monogram placed at `/public/favicon.svg` and linked in `index.html`.
3. **Institutional Privacy Policy**: Dedicated page (`PrivacyPolicyPage.jsx`) covering sensor telemetry, data retention, and FERPA/GDPR compliance.
4. **Terms of Service**: Dedicated page (`TermsOfServicePage.jsx`) detailing data licensing, service level availability (99.9%), and diagnostic advisory limits.

---

## 5. Environment Configuration

Copy `.env.example` to `.env` to configure deployment targets:

```bash
# Environment Configuration
VITE_APP_NAME="CampusPulse Enterprise"
VITE_APP_VERSION="v3.2.0"
VITE_API_BASE_URL="https://api.campuspulse.internal/v1"
VITE_DEFAULT_CUSTOM_DOMAIN="pulse.university.edu"
VITE_CNAME_TARGET="ingress.campuspulse.network"

# Utility Tariffs
VITE_DEFAULT_ELEC_TARIFF=8.50
VITE_DEFAULT_WATER_TARIFF=0.12
VITE_GRID_CO2_FACTOR=0.82
VITE_TREE_OFFSET_ANNUAL_KG=21.8
```

---

## 6. Development & Build Instructions

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Validate build correctness
npm run build
```
