# LeafTaps CRM Lead Creation Test Plan

## Application Overview

Verify the end-to-end CRM/SFA workflow on https://leaftaps.com/opentaps/control/main: authenticate as the supplied demo CSR user, open CRM/SFA, navigate to Create Lead, submit a lead with required details, and confirm the application created it. Preconditions: the test environment is reachable; the supplied account (username democsr2) is active and authorized for CRM/SFA; no preexisting lead uses the unique company/name values chosen for this run; credentials are supplied at runtime through LEAFTAPS_USERNAME and LEAFTAPS_PASSWORD (do not hardcode or commit the password); the browser starts with a fresh context. Suggested selectors use accessible roles/names and labels where available, with CSS/name-attribute fallbacks to confirm against the live DOM. The planner browser could not be launched in this session, so exact labels, required fields, and success message remain to be verified against the application before implementation.

## Test Scenarios

### 1. CRM/SFA Lead Creation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Create a lead successfully

**File:** `tests/leads/create-lead.spec.ts`

**Steps:**
  1. Start with a fresh browser context. Navigate to https://leaftaps.com/opentaps/control/main. Suggested assertion: expect(page).toHaveURL(/opentaps\/control\/main/); verify the login form is visible.
    - expect: The LeafTaps login page loads without a browser or network error.
    - expect: Username and password inputs and a Login submit control are visible. Suggested locators: getByLabel(/username/i) and getByLabel(/password/i), or getByRole('textbox', { name: /username/i }) and input[type=password] if labels are absent.
  2. Enter username democsr2 and the password from LEAFTAPS_PASSWORD, then submit Login. Suggested username locator: getByLabel(/username/i); password locator: getByLabel(/password/i); submit locator: getByRole('button', { name: /login/i }) or getByRole('link', { name: /login/i }) depending on the rendered control. Set the username through LEAFTAPS_USERNAME and avoid embedding credentials in test source.
    - expect: Authentication succeeds and the authenticated landing page is shown.
    - expect: No invalid-credentials or login-error message is visible.
    - expect: An authenticated navigation item or page content is visible. Suggested assertion: expect(page.getByRole('link', { name: /crm\/sfa/i })).toBeVisible(), adjusting to the actual accessible name if needed.
  3. Open CRM/SFA from the authenticated navigation. Suggested locator: getByRole('link', { name: /crm\/sfa/i }); if the navigation uses a button, use getByRole('button', { name: /crm\/sfa/i }).
    - expect: The CRM/SFA area loads.
    - expect: CRM/SFA navigation or its landing-page content is visible, and the page does not show an access-denied or application-error message.
  4. Navigate to Create Lead. Suggested locator: getByRole('link', { name: /^create lead$/i }); if the action is exposed as a button, use getByRole('button', { name: /^create lead$/i }).
    - expect: The Create Lead form is displayed.
    - expect: The form exposes required lead identity fields. Suggested locators: getByLabel(/company name/i) and getByLabel(/last name/i), or locator('[name="companyName"]') and locator('[name="lastName"]') if labels are not programmatically associated.
  5. Fill the required lead data with a unique value for this run; provide a first name and any other fields the live form marks required. Example values: company `PW Lead <run-id>`, first name `QA`, last name `Lead <run-id>`. Suggested locators: getByLabel(/company name/i), getByLabel(/first name/i), and getByLabel(/last name/i); use locator('[name="emailAddress"]') only if email is useful or required. Avoid reusing a fixed company/name combination across repeated runs.
    - expect: All required fields are populated with valid values.
    - expect: The form shows no required-field validation errors before submission.
    - expect: Input values remain visible in their corresponding fields.
  6. Submit the Create Lead form. Suggested locator: getByRole('button', { name: /^create lead$/i }); distinguish the form-submit control from the navigation link by scoping to the form when needed, e.g. page.locator('form').getByRole('button', { name: /create lead/i }).
    - expect: The application accepts the submission and displays a lead detail page or an explicit successful-creation confirmation.
    - expect: No form validation error, duplicate-lead error, or server error is displayed.
    - expect: If the UI navigates to a detail page, assert a heading or displayed company/name matches the unique values entered. If it stays on the form, assert the success confirmation is visible.
  7. Verify the created lead from the resulting page. Prefer checking the displayed company and last name; if there is a stable detail heading, assert it identifies the new lead. If the application provides a unique lead ID, verify that it is displayed and non-empty.
    - expect: The created lead's company name and last name match the submitted unique values.
    - expect: A positive success condition is met: either an explicit success message is visible or the lead detail view identifies the submitted record.
    - expect: The page has no visible submission failure or validation error.
