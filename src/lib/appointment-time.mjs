// GHL appointment times, written the one way GHL reads them right.
//
// 2026-11-06: a customer booked Nov 9 11:00 AM on /assessment and GHL's
// confirmation said 7:45 PM. We sent startTime with a Pacific offset
// ("…T11:00:00-08:00") but endTime as UTC ("…T19:45:00.000Z", from
// toISOString). 19:45 is the 11:45 end time in UTC; GHL treated it as
// Pacific wall time, so the event ran 11:00 AM to 7:45 PM and the invite
// showed 7:45 PM. Both times now go out as Pacific wall time + Pacific offset.

const TZ = "America/Los_Angeles";

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hourCycle: "h23", timeZoneName: "longOffset",
});

/** An instant as "YYYY-MM-DDTHH:MM:SS-08:00" (or -07:00 in summer), Pacific. */
export function pacificISO(ms) {
  const p = Object.fromEntries(parts.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const off = p.timeZoneName === "GMT" ? "+00:00" : p.timeZoneName.replace("GMT", "");
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${off}`;
}

/** Start/end for a GHL appointment: both Pacific, same format. Null if the slot is unreadable. */
export function appointmentWindow(startISO, minutes) {
  const start = new Date(startISO).getTime();
  if (Number.isNaN(start)) return null;
  return { startTime: pacificISO(start), endTime: pacificISO(start + minutes * 60000) };
}
