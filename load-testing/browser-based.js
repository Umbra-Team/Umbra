import { browser } from "k6/experimental/browser";
import { check } from "k6";

export const options = {
  scenarios: {
    ui: {
      executor: "constant-vus",
      vus: 4,
      duration: "30s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export default async function () {
  const page = browser.newPage();

  try {
    await page.goto("https://www.umbra-collab.com/?room=LoadTesting");
    // Generate random number between 1 and 100
    for (let i = 0; i < 100; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      // Find the div with class 'cm-content' and type 'console.log("Hello World!");'
      const textbox = page.locator("div[data-language]");
      textbox.focus();
      textbox.press("PageUp");
      textbox.press("Home");
      textbox.press("Enter");
      const textToType = `console.log("Hello World ${randomNumber}!");`;
      for (let char of textToType) {
        await textbox.press(char);
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(1000);
    }
  } finally {
    page.close();
  }
}
