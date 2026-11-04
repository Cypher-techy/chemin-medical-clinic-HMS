# Chemin Medical Clinic HMS
Production-oriented Hospital Management System for Chemin Medical Clinic, Nyamasibi, Nyaribari Masaba, Kisii County, Kenya. Independent from the public website (separate codebase, DB, auth, deployment; only an API-key intake endpoint can receive website appointment *requests*).

## Quick start (local / offline node)
```bash
cp .env.example .env   # set a strong JWT_SECRET
npm install
npx prisma db push     # creates local DB (SQLite zero-config; Postgres in production — see DEPLOYMENT.md)
npm run db:seed        # synthetic data only
npm run dev            # http://localhost:3000
npm test && npm run build
```
Seed staff (change immediately): `doctor@ / nurse@ / reception@ / pharmacy@ / lab@ / accounts@ / admin@ / super@cheminhealth.local`, password `Chemin@2026`.

## What works end-to-end today
Auth (bcrypt+JWT httpOnly sessions, server RBAC, suspension, break-glass with mandatory justification), audit log, patient registration with duplicate detection (409 + authorised override), reception queue, appointments, triage/BMI/warnings, EMR draft→sign→reasoned amendment, allergy-checked prescribing, lab order→specimen→result→verify (critical-result notification + acknowledgement), FEFO pharmacy with expired-stock blocking, billing with partial payments, idempotent M-Pesa callback (initiation never marks paid), inventory movements, beds/admissions (only admin-configured beds), referrals, incidents, HR/users, notifications (honest QUEUED_NO_PROVIDER), reports from real DB aggregates (+ audited CSV export, daily reconciliation/cash-closing view), controlled patient-record merging, TOTP MFA, SHA/insurance claim tracking (no simulated submission), equipment asset register, chronic-disease register, local checksummed backups (`Admin → Local backups`), automated API smoke journey (32 checks, `npm run test:smoke`), authorised refunds, appointment-reminder job, patient portal accounts (own-record-only), printable receipts, MCH register view, PWA offline app-shell, `/api/health`, login rate limiting, sync protocol with signed-record conflict protection, patient-portal permitted view.

## Honest outstanding items
See final report in docs/DEPLOYMENT.md §Outstanding: Daraja/SMS/WhatsApp/SHA/FHIR need real credentials & approvals; facility legal/licence/KEPH/MOH/SHA details are `verified=false` in seed and must be entered by clinic; Postgres migration, PDF report builder, and full offline local-server packaging are next phases. No integration is faked as live.
