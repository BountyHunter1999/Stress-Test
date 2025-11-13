import http from "k6/http";
import { sleep, check } from "k6";

const TARGET_URL = __ENV.TARGET_URL || "https://test.k6.io";

export let options = {
    vus: __ENV.VUS || 1000, // number of virtual users
    duration: __ENV.DURATION || "1m", // total test duration
    rps: 0, // 0 = unlimited requests per second
    thresholds: {
        http_req_failed: ["rate<0.01"], // fail if more than 1% requests fail
        http_req_duration: ["p(95)<500"], // 95% of requests below 500ms
    },
};

export default function () {
    const res = http.head(TARGET_URL);

    check(res, {
        "status is 200": (r) => r.status === 200,
    });

    sleep(1); // wait for 1 second between iterations
}
