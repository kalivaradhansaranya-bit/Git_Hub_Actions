import { test, expect } from '@playwright/test';

const baseURL = 'https://leaftaps.com/opentaps/control/main';
const username = process.env.LEAFTAPS_USERNAME ?? 'democsr2';
const password = process.env.LEAFTAPS_PASSWORD ?? 'crmsfa';

test.describe('CRM/SFA Lead Creation', () => {
  test('Create a lead successfully', async ({ page }) => {
    // 1. Open the login URL and verify the login screen and username/password fields are visible.
    await page.goto(baseURL);
    await expect(page).toHaveURL(/opentaps\/control\/main/);

    const usernameInput = page.getByLabel(/username/i).or(page.locator('input[name="USERNAME"]'));
    const passwordInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 2. Enter credentials from environment variables, submit Login, and verify authenticated content.
    await usernameInput.fill(username);
    await passwordInput.fill(password);

    const loginControl = page.getByRole('button', { name: /login/i }).or(page.getByRole('link', { name: /login/i }));
    await loginControl.first().click();

    const crmSfaLink = page.getByRole('link', { name: /crm\/sfa/i });
    await expect(crmSfaLink).toBeVisible();
    await expect(page.getByText(/invalid.*credentials|login.*error/i)).toHaveCount(0);

    // 3. Open CRM/SFA and verify its area loads.
    await crmSfaLink.click();
    const createLeadLink = page.getByRole('link', { name: /^create lead$/i });
    await expect(createLeadLink).toBeVisible();

    // 4. Open Create Lead and verify required fields are available.
    await createLeadLink.click();

    const companyInput = page.locator('#createLeadForm_companyName');
    const firstNameInput = page.locator('#createLeadForm_firstName');
    const lastNameInput = page.locator('#createLeadForm_lastName');
    await expect(companyInput).toBeVisible();
    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();

    // 5. Fill unique lead values and verify the entered data.
    const runId = `${Date.now()}`;
    const companyName = `PW Lead ${runId}`;
    const firstName = 'QA';
    const lastName = `Lead ${runId}`;

    await companyInput.fill(companyName);
    await firstNameInput.fill(firstName);
    await lastNameInput.fill(lastName);
    await expect(companyInput).toHaveValue(companyName);
    await expect(firstNameInput).toHaveValue(firstName);
    await expect(lastNameInput).toHaveValue(lastName);

    // 6. Submit the Create Lead form and verify that the application accepts it.
    const submitButton = page.locator('form button').filter({ hasText: /create lead/i });
    const submitInput = page.locator('form input[type="submit"][value="Create Lead"]');
    await submitButton.or(submitInput).first().click();

    // 7. Verify the created lead matches the submitted values and no submission error is shown.
    await expect(page.getByText(/created successfully|lead.*created/i).or(page.locator('#viewLead_companyName_sp'))).toBeVisible();
    await expect(page.locator('#viewLead_companyName_sp')).toContainText(companyName);
    await expect(page.locator('#viewLead_lastName_sp')).toHaveText(lastName);
    await expect(page.getByRole('alert').filter({ hasText: /required field|duplicate lead|server error|unable to create/i })).toHaveCount(0);
  });
});
