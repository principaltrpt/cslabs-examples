# Team context for the sample review

**Owner:** Example Operations team

**Decision:** Flag new orders from priority accounts for a person to verify.

**Inputs:** An approved order snapshot, a source update time, a priority account ID list, and previously alerted order IDs.

**Outputs:** A run record and possible matches. A possible match is never a confirmed identity.

**Healthy run:** Source age is at most six hours. All inputs parse. Every candidate is checked against prior alerts. A zero-match run is still recorded.

**Incomplete run:** Source is stale or input is invalid. Preserve the last trusted result and ask the owner to investigate. Do not treat zero alerts as evidence that nothing happened.

**Change process:** Edit the rules in a pull request, update the sample input if the contract changes, and run `node --test review.test.mjs` before merging. A teammate owns the meaning of the priority list and reviews false positives.

**Privacy:** Sample IDs are fictional. Do not paste customer data, contact information, or company system URLs into this public example.
