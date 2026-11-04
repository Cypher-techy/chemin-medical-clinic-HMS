# Integrations (none claimed live without credentials/testing)
- Safaricom Daraja M-Pesa: STK initiate endpoint returns 503 until MPESA_* set; callback verifies secret, amount & receipt idempotency before posting VERIFIED payment. Wire OAuth+STK in `src/app/api/billing` integration layer.
- SMS/Email/WhatsApp: queue honestly as QUEUED_NO_PROVIDER until approved provider keys set; templates must not contain sensitive clinical details.
- SHA / Digital Health Agency / AfyaConnect (FHIR): `InsuranceClaim` tracks PREPARED→… statuses only; do NOT submit or claim contracting until facility eligibility & credentials verified.
- Website intake: `POST /api/intake` with `x-api-key: WEBSITE_INTAKE_API_KEY` creates a reception request only.
- AI: `AI_ENABLED=false`; provider-agnostic, human-review-only, never diagnoses/prescribes/signs.
