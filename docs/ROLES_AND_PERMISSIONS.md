# Roles & permissions (enforced server-side on every API route via requireUser)
| Role | Can | Cannot |
|---|---|---|
| SUPER_ADMIN | users, settings, audit, admin | sign/prescribe (no clinical authority by default) |
| CLINIC_ADMIN | admin, patients, reports, HR | sign clinical notes |
| DOCTOR | patients, encounter, prescribe, lab, referral | billing admin, user admin |
| NURSE | vitals/triage, patients, encounter read area | prescribe/sign |
| RECEPTIONIST | patients, appointments, queue, billing read | alter signed notes |
| PHARMACIST | pharmacy, inventory, prescriptions | diagnose |
| LAB_TECH | lab worklist, patients | verify beyond authority config |
| ACCOUNTANT | billing, financial reports | change diagnoses |
| RECORDS_OFFICER | patients, reports | clinical signing |
| INVENTORY_OFFICER | inventory, pharmacy read | dispense clinical decisions |
| HR_OFFICER | HR, users read/create via admin | clinical data |
| PATIENT | portal: own permitted data only | any other patient's data (403) |
Custom roles: extend map in `src/lib/rbac.ts`; never rely on frontend hiding.
