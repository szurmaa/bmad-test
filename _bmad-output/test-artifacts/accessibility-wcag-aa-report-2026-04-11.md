# Accessibility Audit and WCAG AA Report

Date: 2026-04-11
Epic: 14
Story: 14.3

## Scope

Automated accessibility scan on containerized web endpoint using axe-core CLI.

## Reproducible Command

```bash
cd /Users/aszurma/Desktop/bmad
npx -y @axe-core/cli http://127.0.0.1:8080 --save _bmad-output/test-artifacts/axe-mobile-web.json
```

Raw artifacts:
- `_bmad-output/test-artifacts/axe-mobile-web.json`
- `_bmad-output/test-artifacts/axe-summary.json`

## Automated Findings

Detected violations: 5

1. `document-title` (serious)
- Selector context: `html`

2. `html-has-lang` (serious)
- Selector context: `html`

3. `landmark-one-main` (moderate)
- Selector context: `html`

4. `page-has-heading-one` (moderate)
- Selector context: `html`

5. `region` (moderate)
- Selector context: `pre`

## WCAG AA Status

- Current status: Not compliant in audited endpoint response.
- Note: Endpoint currently returns an upstream error page (`502`), so findings are valid for the served response but are not representative of intended product UI semantics.

## Remediation Recommendations

1. P0
- Resolve web render-path blocker so audit targets intended UI (not error response content).

2. P1
- Ensure HTML document includes:
  - non-empty `<title>`
  - `lang` attribute
  - one `<main>` landmark
  - one visible `<h1>`

3. P1
- Ensure content is wrapped in landmark regions to satisfy structure requirements.

## Manual Validation Checklist (pending after P0)

- Keyboard-only journey through onboarding and settings.
- Screen-reader labels/roles for all interactive controls.
- Contrast verification for text and action controls (WCAG AA 4.5:1 where applicable).
- Touch target checks (44x44 minimum equivalent on mobile layouts).

## Residual Risk

- High until endpoint serves real product UI for audit and manual checks.
