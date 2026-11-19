import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../../../playwright/.auth/user.json');
const appUrl = process.env.PLAYWRIGHT_APP_URL || 'http://127.0.0.1:5173';
const loginEndpoint =
  process.env.PLAYWRIGHT_LOGIN_ENDPOINT ||
  'https://staging.snapsec.co/auth/api/auth/__login__/UYGvu394Mj0V9Q869GAGS2PvHGVy9F';
const apiBaseUrl =
  process.env.PLAYWRIGHT_API_BASE_URL || 'https://staging.snapsec.co';
const loginEmail =
  process.env.PLAYWRIGHT_LOGIN_EMAIL || 'shoaib+staging@snapsec.co';
const loginPassword =
  process.env.PLAYWRIGHT_LOGIN_PASSWORD || 'shoaib+staging@snapsec.co';

async function writeAuthStateDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

test('authenticate via bypass login endpoint and select organization', async ({
  page,
  request,
}) => {
  const credentials = {
    email: loginEmail,
    password: loginPassword,
  };

  // 1. Call the captcha-free bypass login endpoint directly.
  const response = await request.post(loginEndpoint, {
    data: credentials,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok()) {
    console.error(
      'Login request failed with status:',
      response.status(),
      responseBody,
    );
  }
  expect(response.ok()).toBeTruthy();

  let userData =
    responseBody.data || responseBody.user || responseBody.profile || {};
  let token =
    userData.token ||
    userData.intermediaryToken ||
    userData.accessToken ||
    responseBody.token ||
    responseBody.intermediaryToken ||
    responseBody.accessToken ||
    responseBody.data?.token;

  if (!token) {
    console.error('No token found in login response:', responseBody);
  }
  expect(token).toBeTruthy();

  // 2. Perform direct API org login to get the organization-scoped token and access rights
  try {
    const orgsResponse = await request.get(
      `${apiBaseUrl}/auth/api/service-provider/orgs?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let targetOrgId = null;
    if (orgsResponse.ok()) {
      const orgsData = await orgsResponse.json();
      const orgsList = orgsData?.data || [];
      const matchedOrg =
        orgsList.find((o) => /Snapsec Staging Data update/i.test(o.name)) ||
        orgsList[0];
      // targetOrgId = matchedOrg?._id || matchedOrg?.orgId;
      targetOrgId = "69ddd9213154a30012f5512d"; // huge data org
      // targetOrgId = '6a8bf3d4fed1510012425b5c'; // Tamam org
    }

    if (targetOrgId) {
      const orgLoginResponse = await request.post(
        `${apiBaseUrl}/auth/api/service-provider/login-into-org`,
        {
          data: { orgId: targetOrgId },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (orgLoginResponse.ok()) {
        const orgLoginBody = await orgLoginResponse.json();
        if (orgLoginBody?.data) {
          userData = orgLoginBody.data;
          token = orgLoginBody.data.token || token;
        }
      }
    }
  } catch (err) {
    console.warn(
      'Direct API org login failed, will fall back to UI interaction:',
      err,
    );
  }

  await writeAuthStateDir(authFile);

  // 3. Seed localStorage in the browser context with the full organization payload.
  await page.goto(`${appUrl}/auth/signin`);
  await page.evaluate(
    ({ token, userData }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...userData, token }));
      if (userData?.orgId) {
        localStorage.setItem('orgId', String(userData.orgId));
      }
      if (userData?.account_type) {
        localStorage.setItem('accountType', userData.account_type);
      }
      if (userData?.refreshToken) {
        localStorage.setItem('refreshToken', userData.refreshToken);
      }
    },
    { token, userData },
  );

  // 4. Navigate to the app and confirm landing on the workspace launcher.
  await page.goto(`${appUrl}/`);
  await page.waitForLoadState('domcontentloaded');

  const organizationCard = page
    .locator('div')
    .filter({ hasText: /Snapsec Staging Data update/i });
  if ((await organizationCard.count()) > 0) {
    const loginButton = organizationCard
      .first()
      .getByRole('button')
      .filter({ hasText: /login/i });

    if ((await loginButton.count()) > 0) {
      await loginButton.first().click();
    } else {
      await organizationCard.first().getByRole('button').last().click();
    }

    await page
      .waitForURL(
        (url) =>
          !url.pathname.includes('service') && !url.pathname.includes('auth'),
        {
          timeout: 15000,
        },
      )
      .catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  // 5. Save the resulting authentication snapshot so all dependent Playwright specs reuse it.
  await page.context().storageState({ path: authFile });
  console.log('Authentication successful. Storage state saved to:', authFile);
});
