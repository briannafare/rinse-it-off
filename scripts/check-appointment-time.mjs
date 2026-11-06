// Prebuild guard: appointment start/end must share the Pacific offset (see src/lib/appointment-time.mjs).
import assert from "node:assert/strict";
import { appointmentWindow, pacificISO } from "../src/lib/appointment-time.mjs";

// The booking that broke: Nov 9 2026, 11:00 AM PST, 45-min slot.
assert.deepEqual(appointmentWindow("2026-11-09T11:00:00-08:00", 45), {
  startTime: "2026-11-09T11:00:00-08:00",
  endTime: "2026-11-09T11:45:00-08:00",
});
// A UTC-stamped start still comes out Pacific.
assert.deepEqual(appointmentWindow("2026-11-09T19:00:00Z", 45), {
  startTime: "2026-11-09T11:00:00-08:00",
  endTime: "2026-11-09T11:45:00-08:00",
});
// Summer (PDT).
assert.equal(pacificISO(Date.parse("2026-07-13T15:00:00Z")), "2026-07-13T08:00:00-07:00");
// End crosses the DST change cleanly (Nov 1 2026, 1:30 AM PDT + 45 min = 1:15 AM PST).
assert.equal(appointmentWindow("2026-11-01T01:30:00-07:00", 45).endTime, "2026-11-01T01:15:00-08:00");
assert.equal(appointmentWindow("not a date", 45), null);
console.log("appointment-time: ok");
