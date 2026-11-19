/**
 * SnapSec Authentication Script Template
 * 
 * This script is executed in a sandboxed Playwright environment to authenticate
 * your application before a scan begins.
 */
async function authenticate({ page, target_url, scope }) {
    console.log(`[+] Starting authentication for: ${target_url}`);

    // 1️⃣ Navigate to your application
    // This establishes the domain context required for setting cookies or localStorage
    await page.goto(target_url, { waitUntil: 'networkidle' });

    /**
     * OPTION A: UI-BASED LOGIN (Recommended for most apps)
     * Fill in the login form just like a user would.
     */
    /*
    console.log("[+] Performing UI-based login...");
    await page.fill('input[name="email"]', 'your-email@example.com');
    await page.fill('input[name="password"]', 'your-password');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or a specific element that indicates successful login
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    */

    /**
     * OPTION B: API-BASED LOGIN
     * If your app uses a separate API for login, you can execute a fetch request
     * directly inside the browser context.
     */

    console.log("[+] Performing API-based login...");
    const LOGIN_API_URL = `${target_url}/api/auth/login`; // Update this to your login endpoint

    const authData = await page.evaluate(async (url) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'user@example.com',
                password: 'password123'
            })
        });
        return await response.json();
    }, LOGIN_API_URL);

    // 2️⃣ Persist Authentication State
    // Depending on how your app works, you might need to set LocalStorage or Cookies.

    if (authData && authData.token) {
        await page.evaluate((token) => {
            // Example: Setting a JWT in LocalStorage
            localStorage.setItem('auth_token', token);

            // Example: Setting user info
            localStorage.setItem('user_session', JSON.stringify({ loggedIn: true }));
        }, authData.token);

        console.log("[+] Auth token persisted to LocalStorage");
    }

    // 3️⃣ Finalize
    // Reload the page to ensure the application recognizes the new auth state
    await page.reload({ waitUntil: 'networkidle' });

    console.log("[+] Authentication complete. Ready for scanning.");

    // return this object to tell scanner if auth succeeded or failed
    // on success
    return { success: true, message: "Authentication successful" };

    // on failure
    // return { success: false, message: "Authentication failed: Invalid username & password" };
}

/**
 * Export the authenticate function
 */
module.exports = { authenticate };
