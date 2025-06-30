# K6s

## Understand Output

```bash
1 VUs  00m48.7s/10m0s  0/1 shared iters
```

- `1 VUs`:
  Only 1 Virtual User (VU) is being used in this test.

- `00m48.7s/10m0s`:
  The test has run for 48.7 seconds, and the maximum duration is 10 minutes (--max-duration=10m).

- `0/1 shared iters`:
  So far, 0 out of 1 total shared iteration has been completed.

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
