# K6s

## Key Terms:

1. VU: Virtual User
2. Iterations: The number of times the test will be executed by a VU
3. VU Iteration: A single execution of the test by a VU
4. Shared Iteration: A single execution of the test by all VUs

## Understand Output

### Basic Output

```bash
1 VUs  00m48.7s/10m0s  0/1 shared iters
```

- `1 VUs`:
  Only 1 Virtual User (VU) is being used in this test.

- `00m48.7s/10m0s`:
  The test has run for 48.7 seconds, and the maximum duration is 10 minutes (--max-duration=10m).

- `0/1 shared iters`:
  So far, 0 out of 1 total shared iteration has been completed.

### Detailed Output

- `checks_total`: Total number of checks executed.
- `checks_succeeded`: Percentage of checks that succeeded.
- `checks_failed`: Percentage of checks that failed.

- `HTTP`

  - `http_req_duration`: HTTP request duration statistics including average, min, median, max, and percentiles.

- `Execution`

  - `iteration_duration`: Duration statistics of each test iteration.
  - `iterations`: Number of iterations executed per second.
  - `vus`: Virtual Users (VUs) statistics, including min and max values.
  - `vus_max`: Maximum number of Virtual Users configured.

- `Network`

  - `data_received`: Total amount of data received.
  - `data_sent`: Total amount of data sent.

- `Browser`

  - `browser_data_received`: Data received by the browser during testing.
  - `browser_data_sent`: Data sent by the browser during testing.
  - `browser_http_req_duration`: HTTP request duration statistics from the browser's perspective.
  - `browser_http_req_failed`: Percentage of browser HTTP requests that failed.

- `Web Vitals`
  - `browser_web_vital_cls`: Cumulative Layout Shift (CLS) metric for web vitals.
    - Visual Stability how much things move around on the page unexpectedly
  - `browser_web_vital_fcp`: First Contentful Paint (FCP) metric for web vitals.
    - How soon something (like text or image) is drawn on the screen.
  - `browser_web_vital_fid`: First Input Delay (FID) metric for web vitals.
    - The time between the user's first interaction (like clicking a button) and the browser's response to it.
  - `browser_web_vital_inp`: Input Delay metric for web vitals.
    - The worst-case responsiveness of a page during real interactions, like typing, clicking, and dragging.
  - `browser_web_vital_lcp`: Largest Contentful Paint (LCP) metric for web vitals.
    - How long does it take for the main content (like hero image, headline) to finish loading?
  - `browser_web_vital_ttfb`: Time to First Byte (TTFB) metric for web vitals.
    - The time from the user's request until the first byte of the response is received.

| Metric   | Measures                           | Good Threshold | What it Tells You                     |
| -------- | ---------------------------------- | -------------- | ------------------------------------- |
| **CLS**  | Visual stability                   | < 0.1          | Are elements shifting around?         |
| **FCP**  | Time to first visible content      | < 1.8s         | Does the user see anything quickly?   |
| **FID**  | Delay to first user input response | < 100ms        | Does the page respond to clicks fast? |
| **INP**  | Overall input responsiveness       | < 200ms        | Are all interactions snappy?          |
| **LCP**  | Load time of biggest content       | < 2.5s         | When does main content fully appear?  |
| **TTFB** | Server response speed              | < 0.8s         | Is the backend fast to respond?       |

## Run

```bash
make stress
```

## Dashboard

## Executor

- `per-vu-iterations`:
  Each VU will run the test for the specified number of iterations.

- `constant-vus`:
  A constant number of VUs will run the test for the specified duration.

- `ramping-vus`:
  A number of VUs will start at the beginning and ramp up to the specified number of VUs over the specified duration.

## Websocket

- `cargo install websocat`
- `websocat wss://ws.k6.io`

### Start web socket server

- `websocat -s 1234` Start listening on `ws://127.0.0.1:1234` and dumping all incoming websocket messages to console.

## Installation

### On MAC

1. `brew install k6`
2. `brew install chromium --no-quarantine` Just doing this, we get damaged error
3. `xattr -cr /Applications/Chromium.app`

### On Linux

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

- Or just run `make see_browser`
