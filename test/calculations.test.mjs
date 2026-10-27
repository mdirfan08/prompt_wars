import test from 'node:test';
import assert from 'node:assert/strict';

function calculatePay(
  totalHoursWorked,
  hourlyRate = 150,
  overtimeMultiplier = 1.5,
  standardDailyLimit = 8.0,
  deductionPercentage = 0.05
) {
  const safeTotalHours = Math.max(0, Number(totalHoursWorked) || 0);
  const safeRate = Math.max(0, Number(hourlyRate) || 0);
  const safeMultiplier = Math.max(1, Number(overtimeMultiplier) || 1.5);
  const safeDailyLimit = Math.max(1, Number(standardDailyLimit) || 8.0);

  const standardHours = Math.min(safeTotalHours, safeDailyLimit);
  const overtimeHours = Math.max(0, safeTotalHours - safeDailyLimit);

  const basePay = standardHours * safeRate;
  const overtimePay = overtimeHours * (safeRate * safeMultiplier);
  const grossPay = basePay + overtimePay;
  const statutoryDeductions = Number((grossPay * deductionPercentage).toFixed(2));
  const netEstimatedPay = Number((grossPay - statutoryDeductions).toFixed(2));

  return {
    standardHours: Number(standardHours.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),
    hourlyRate: safeRate,
    overtimeMultiplier: safeMultiplier,
    basePay: Number(basePay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    grossPay: Number(grossPay.toFixed(2)),
    statutoryDeductions,
    netEstimatedPay
  };
}

function formatDuration(decimalHours) {
  const safeHours = Math.max(0, decimalHours || 0);
  const wholeHours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - wholeHours) * 60);
  if (wholeHours === 0 && minutes === 0) return '0m';
  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
}

test('Test Case 1: Standard 8-Hour Shift @ ₹150/hr', () => {
  const res = calculatePay(8.0, 150, 1.5, 8.0);
  assert.equal(res.standardHours, 8.0);
  assert.equal(res.overtimeHours, 0);
  assert.equal(res.basePay, 1200);
  assert.equal(res.overtimePay, 0);
  assert.equal(res.grossPay, 1200);
  assert.equal(res.statutoryDeductions, 60);
  assert.equal(res.netEstimatedPay, 1140);
});

test('Test Case 2: Overtime Shift 10.5h @ ₹150/hr with 1.5x OT', () => {
  const res = calculatePay(10.5, 150, 1.5, 8.0);
  assert.equal(res.standardHours, 8.0);
  assert.equal(res.overtimeHours, 2.5);
  assert.equal(res.basePay, 1200);
  assert.equal(res.overtimePay, 562.5);
  assert.equal(res.grossPay, 1762.5);
  assert.equal(res.statutoryDeductions, 88.13);
  assert.equal(res.netEstimatedPay, 1674.37);
});

test('Test Case 3: Heavy Overtime 12.0h @ ₹200/hr with 2.0x OT', () => {
  const res = calculatePay(12.0, 200, 2.0, 8.0);
  assert.equal(res.standardHours, 8.0);
  assert.equal(res.overtimeHours, 4.0);
  assert.equal(res.basePay, 1600);
  assert.equal(res.overtimePay, 1600);
  assert.equal(res.grossPay, 3200);
});

test('Test Duration Formatting', () => {
  assert.equal(formatDuration(3.25), '3h 15m');
  assert.equal(formatDuration(0.5), '30m');
  assert.equal(formatDuration(8.0), '8h');
  assert.equal(formatDuration(0), '0m');
});
