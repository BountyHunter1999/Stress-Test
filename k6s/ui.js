import { browser } from "k6/browser";
import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  scenarios: {
    browser_actions: {
      // one virtual user per iteration
      executor: "per-vu-iterations",
      exec: "loginAction",
      // 'vus' specifies the number of virtual users to simulate.
      vus: 5,
      // 'iterations' defines how many times each virtual user will execute the function.
      iterations: 3,
      // 'startTime' sets when the scenario should start relative to the test start.
      startTime: "0s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
    reachable: {
      executor: "constant-vus",
      exec: "siteReachable",
      vus: 10,
      duration: "10s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
};

export async function loginAction() {
  const page = await browser.newPage();
  await page.goto("https://demo.filamentphp.com/login");
  //   await page.locator('input[id="data.email"]').clear();
  await page.locator('input[id="data.email"]').fill("admin@filamentphp.com");
  //   await page.locator('input[id="data.password"]').clear();
  await page.locator('input[id="data.password"]').fill("password");
  await page.locator('//*[@id="form"]/div[2]/div/button').click();
  await page.waitForNavigation();
  await page.screenshot({ path: "dashboard.png" });

  // Customers page
  await page
    .locator("/html/body/div[1]/aside/nav/ul/li[2]/ul/li[3]/a/span")
    .click();
  await page.waitForNavigation();
  await page.screenshot({ path: "customers.png" });

  // wait for 5 seconds to be friendly to the server
  await sleep(5);
  await page.close();
}

export function siteReachable() {
  const res = http.get("https://demo.filamentphp.com/login");
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
