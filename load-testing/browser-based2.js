import { browser } from "k6/experimental/browser";
import { check } from "k6";

export const options = {
  ext: {
    loadimpact: {
      projectID: 3671375,
      name: "Browser based test for umbra",
    },
  },
  scenarios: {
    ui: {
      executor: "constant-vus",
      vus: 60, // 4 users * 10 rooms
      duration: "60s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

const rooms = Array.from({ length: 20 }, (_, i) => `LoadTesting${i + 1}`); // ['LoadTesting1', 'LoadTesting2', ..., 'LoadTesting10']

export default async function () {
  const roomIndex = __VU % rooms.length; // Calculate room index based on VU id
  const room = rooms[roomIndex]; // Select room for this VU

  const page = browser.newPage();

  try {
    await page.goto(`https://www.umbra-collab.com/?room=${room}`);
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
