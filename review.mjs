const MAX_SOURCE_AGE_MS = 6 * 60 * 60 * 1000;

export function reviewSnapshot(input, now = new Date()) {
  if (!input || typeof input !== 'object') throw new TypeError('Input must be an object');
  const { sourceUpdatedAt, priorityAccountIds, alertedOrderIds, orders } = input;
  if (!Array.isArray(priorityAccountIds) || !Array.isArray(alertedOrderIds) || !Array.isArray(orders)) {
    throw new TypeError('Expected priorityAccountIds, alertedOrderIds, and orders arrays');
  }
  const updated = new Date(sourceUpdatedAt);
  if (Number.isNaN(updated.getTime()) || Number.isNaN(now.getTime())) {
    throw new TypeError('Invalid timestamp');
  }
  const ageMs = now.getTime() - updated.getTime();
  if (ageMs < 0 || ageMs > MAX_SOURCE_AGE_MS) {
    return { result: 'incomplete', reason: 'source_stale_or_future', sourceUpdatedAt,
      reviewedAt: now.toISOString(), possibleCount: null, newAlerts: [] };
  }

  const priority = new Set(priorityAccountIds);
  const alerted = new Set(alertedOrderIds);
  const seen = new Set();
  const candidates = [];
  for (const order of orders) {
    if (!order || typeof order.orderId !== 'string' || typeof order.accountId !== 'string') {
      throw new TypeError('Each order needs string orderId and accountId');
    }
    if (!priority.has(order.accountId) || seen.has(order.orderId)) continue;
    seen.add(order.orderId);
    candidates.push({ orderId: order.orderId, accountId: order.accountId,
      status: 'possible_match_needs_human_review' });
  }
  return { result: 'healthy', reviewedAt: now.toISOString(), sourceUpdatedAt,
    possibleCount: candidates.length, newAlerts: candidates.filter(c => !alerted.has(c.orderId)) };
}
