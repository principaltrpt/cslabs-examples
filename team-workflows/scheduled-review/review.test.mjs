import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewSnapshot } from './review.mjs';

const now = new Date('2026-01-15T15:00:00Z');
const base = { sourceUpdatedAt: '2026-01-15T14:30:00Z', priorityAccountIds: ['a1'], alertedOrderIds: [], orders: [] };

test('records a fresh zero-match run as healthy', () => {
  const result = reviewSnapshot(base, now);
  assert.equal(result.result, 'healthy');
  assert.equal(result.possibleCount, 0);
  assert.deepEqual(result.newAlerts, []);
});

test('refuses to trust a stale zero-match run', () => {
  const result = reviewSnapshot({ ...base, sourceUpdatedAt: '2026-01-15T07:00:00Z' }, now);
  assert.equal(result.result, 'incomplete');
  assert.equal(result.possibleCount, null);
});

test('dedupes both repeated input rows and prior alerts', () => {
  const result = reviewSnapshot({ ...base, alertedOrderIds: ['o1'], orders: [
    { orderId: 'o1', accountId: 'a1' }, { orderId: 'o1', accountId: 'a1' },
    { orderId: 'o2', accountId: 'a1' }, { orderId: 'o3', accountId: 'a2' }
  ] }, now);
  assert.equal(result.possibleCount, 2);
  assert.deepEqual(result.newAlerts, [{ orderId: 'o2', accountId: 'a1', status: 'possible_match_needs_human_review' }]);
});
