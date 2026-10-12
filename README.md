# A scheduled review that knows when to stop

This is a synthetic example for operators moving from one-off AI answers to repeatable team workflows. It uses fictional account and order IDs and reads local JSON only. It makes no network calls.

Run it with Node 20 or later:

```sh
node cli.mjs data/fresh.json
node cli.mjs data/stale.json
node --test review.test.mjs
```

The review checks the source timestamp before trusting a zero-result run. It identifies orders for a small set of priority accounts, labels each as requiring human review, and suppresses alerts already recorded by order ID. The CLI prints a run record even when there are no new alerts.

In a real team workflow, replace the local input adapter with approved data access and connect the output to an approved destination. Keep the decision rules and tests independent of those integrations. See [TEAM_CONTEXT.md](TEAM_CONTEXT.md) for the handoff contract.

The accompanying article explains why the checks matter. This folder shows the implementation.

The sample [GitHub Actions workflow](.github/workflows/scheduled-review.yml) runs tests on pushes and runs the fictional review daily. Its input contains a fixed sample time so the result is reproducible. GitHub Actions cron uses UTC. For a real workflow, define the local-time behavior, replace the input adapter, and give a team owner responsibility for checking run failures.
