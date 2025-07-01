import { browser } from "k6/browser";
// import { check, sleep } from "k6";
import { sleep } from "k6";
import { SharedArray } from "k6/data";
import http from "k6/http";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import ws from "k6/ws";

// To avoid loading file for each VU as it cna cause performance issues.
// Using shared array to load the file once and share it with all VUs.
const userCreds = new SharedArray("userCreds", function () {
  return JSON.parse(open("./creds.json")).users;
});

// console.log(userCreds);

const routes = new SharedArray("routes", function () {
  return JSON.parse(open("./routes.json"));
});

const commonConfig = JSON.parse(open("./common-config.json"));

export const options = {
  // stages: [
  //   {
  //     duration: "20s",
  //     //  2 users
  //     target: 2,
  //   },
  //   {
  //     duration: "1m",
  //     target: 5,
  //   },
  //   {
  //     duration: "40s",
  //     target: 2,
  //   },
  // ],
  // can't use simulataneosly with stages
  scenarios: {
    browser_actions: {
      // one virtual user per iteration
      executor: "per-vu-iterations",
      exec: "loginAction",
      // 'vus' specifies the number of virtual users to simulate.
      vus: 3,
      // 'iterations' defines how many times each virtual user will execute the function.
      iterations: 1,
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
    websocket: {
      executor: "constant-vus",
      exec: "webSocketWorking",
      vus: 10,
      duration: "10s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  // consider it fail
  thresholds: {
    http_req_duration: ["p(90)<2000", "p(95)<1500"],
    // request with tag "page:login"
    // "http_req_duration{page:login}": [
    //   {
    //     thresholds: "p(95)<300",
    //     abortOnFail: true,
    //     delayAbortEval: "10s",
    //   },
    // ],
  },
};

export default function () {
  loginAction();
  siteReachable();
}

export async function loginAction() {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const randomUser = randomItem(userCreds);
  const randomRoute = randomItem(routes);

  console.log(randomUser.username, randomRoute.name, date);

  const page = await browser.newPage();

  try {
    await page.goto(`${__ENV.HOST}/login`);
    //   await page.locator('input[id="data.email"]').clear();
    await page.locator('input[id="data.email"]').fill(randomUser.username);
    //   await page.locator('input[id="data.password"]').clear();
    await page.locator('input[id="data.password"]').fill(randomUser.password);

    // if (commonConfig.REMEMBER_ME.toggle) {
    //   console.log("Remember me is enabled");
    //   const rememberMe = await page.locator(commonConfig.REMEMBER_ME.locator);
    //   await Promise.all([page.waitForNavigation(), rememberMe.click()]);
    //   console.log("Clicked remember me");
    // }

    await page.screenshot({
      path: `output/screenshots/remember-me-${date}.png`,
    });
    const loginButton = await page.locator(
      `xpath=${commonConfig.LOGIN_BUTTON.locator}`
    );
    await Promise.all([page.waitForNavigation(), loginButton.click()]);
    // await page.waitForNavigation();
    await page.screenshot({
      path: `output/screenshots/home-${date}.png`,
    });

    const targetButton = await page.locator(`xpath=${randomRoute.locator}`);
    await Promise.all([page.waitForNavigation(), targetButton.click()]);

    await page.waitForLoadState("load");
    // await page.waitForNavigation();
    await page.screenshot({
      path: `output/screenshots/${randomRoute.name}-${date}.png`,
    });

    await check(page.locator("h1"), {
      "Target Page Loaded": async (h1) =>
        (await h1.textContent()) === randomRoute.content,
    });

    // wait for 5 seconds to be friendly to the server
    await sleep(5);
  } finally {
    await page.close();
  }
}

export function siteReachable() {
  const res = http.get(`${__ENV.HOST}/login`, {
    tags: {
      page: "login",
    },
  });
  check(res, {
    "status is 200": (r) => r.status === 200,
    // 2000 ms = 2s
    "duration was <= 2s": (r) => r.timings.duration <= 2000,
  });
}

export function webSocketWorking() {
  const url = "wss://echo.websocket.org";
  const params = {
    tags: {
      page: "websocket",
    },
  };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", () => console.log("Connected to websocket"));
    socket.on("message", (data) => console.log("Received message:", data));
    socket.on("close", () => console.log("Disconnected"));

    socket.on("ping", () => console.log("PING!"));
    socket.on("error", (e) => {
      if (e.error() != "websocket: close sent") {
        console.log("An unexpected error occurred: ", e.error());
      }
    });

    socket.setTimeout(function () {
      console.log("Closing the socket, 2 seconds passed");
      socket.close();
    }, 2000);
  });

  // console.log(res);
  check(res, {
    "status is 101": (r) => r && r.status === 101,
  });
}
