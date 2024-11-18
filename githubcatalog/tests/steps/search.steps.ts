import { Before, After, Given, When, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { expect } from '@playwright/test';

// Global variables for browser and page
let browser: Browser;
let page: Page;

// Before hook to launch the browser and create a new page
Before(async () => {
  browser = await chromium.launch({ headless: true }); // Launch browser in headless mode
  page = await browser.newPage(); // Create a new browser page
});

// After hook to close the browser and clean up resources
After(async () => {
  await page.close();  // Close the page
  await browser.close();  // Close the browser
});

// Step definitions for the tests

/**
 * The user is on the main page.
 */
Given('the user is on the main page', async () => {
  await page.goto('http://localhost:3000');  // Navigate to the main page
});

/**
 * The user searches for a username.
 * @param query - The username to search for.
 */
When('the user searches for {string}', async (query: string) => {
  await page.fill('input[name="usernameSearch"]', query);
});

/**
 * The user filters repositories by a given text.
 * @param query - The text to filter repositories by.
 */
When('the user filters repositories by {string} text', async (query: string) => {
  await page.fill('input[name="searchByRepositoryName"]', query);
});

/**
 * The user search results should be displayed in the options of the autocomplete.
 */
Then('the user search results should be displayed in the options of the autocomplete', async () => {
  // Wait for the listbox to appear
  await page.waitForSelector('[role="listbox"]', { state: 'visible' });

  // Locate the options within the listbox
  const options = await page.locator('[role="listbox"] li[role="option"]');

  // Ensure there are options available
  const optionCount = await options.count();
  expect(optionCount).toBeGreaterThan(0);

  // Get the search input value
  const inputValue = await page.inputValue('input[name="usernameSearch"]');

  // Verify at least one option matches the input value
  let isMatched = false;

  for (let i = 0; i < optionCount; i++) {
    const optionText = await options.nth(i).innerText();
    if (optionText.toLowerCase().includes(inputValue.toLowerCase())) {
      isMatched = true;
      break;
    }
  }

  expect(isMatched).toBe(true);
});

/**
 * The user selects a username from the autocomplete.
 * @param username - The username to select.
 */
When('the user selects {string} from the autocomplete', async (username: string) => {
  await page.click(`li[role="option"]:has-text("${username}")`);
});

/**
 * The repository table for the selected user should be displayed.
 */
Then('the repository table for the selected user should be displayed', async () => {
  // Wait for the repository table to be visible
  await page.waitForSelector('.repository-table', { state: 'visible' });

  // Verify that the repository table is displayed
  const isTableVisible = await page.isVisible('.repository-table');
  expect(isTableVisible).toBe(true);
});

/**
 * The repository table should display a given message.
 * @param message - The message to display.
 */
Then('the repository table should display {string} message', async (message: string) => {
  await page.waitForSelector(`text="${message}"`);
});

/**
 * The repository table should contain a given message.
 * @param message - The message to contain.
 */
Then('the repository table should contain {string} message', async (message: string) => {
  await page.waitForSelector('.repository-table', { timeout: 60000 });
  const descriptionCell = await page.locator('.MuiDataGrid-row [data-field="description"]');
  const descriptionText = await descriptionCell.innerText();
  expect(descriptionText).toContain(message);
});

/**
 * The user filters repositories by a given programming language.
 * @param query - The programming language to filter by.
 */
When('the user filters repositories by {string} programming language', async (query: string) => {
  // Click on the language filter input to open the dropdown
  await page.click('input[name="searchByProgrammingLanguage"]');

  // Select the language from the dropdown
  await page.click(`li[role="option"]:has-text("${query}")`);
});

/**
 * The user removes search filter.
 */
When('the user removes search filter', async () => {
  await page.fill('input[name="searchByRepositoryName"]', '');
});

/**
 * The repository table should contain only a given programming language.
 * @param query - The programming language to contain.
 */
Then('the repository table should contain only {string} programming language', async (query: string) => {
  await page.waitForSelector('.repository-table', { timeout: 60000 });
  const languageCells = await page.locator('.MuiDataGrid-row [data-field="primaryLanguage"] .MuiChip-label');
  const languageCount = await languageCells.count();

  for (let i = 0; i < languageCount; i++) {
    const languageText = await languageCells.nth(i).innerText();
    expect(languageText).toBe(query);
  }
});

/**
 * The user presses a switch button.
 * @param query - The switch button to press.
 */
When('the user presses {string} switch button', async (query: string) => {
  await page.click(`.MuiSwitch-switchBase[aria-label="${query}"]`);
});

/**
 * The {string} column is shown in repository table.
 * @param query - The column to show.
 */
Then('the {string} column is shown in repository table', async (query: string) => {
  await page.waitForSelector('.repository-table [data-field="isFork"]', { state: 'visible' });
});