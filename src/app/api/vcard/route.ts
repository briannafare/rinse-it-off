// A contact card for the number and address Rinse It Off actually texts and emails from.
// Adding a sender to the address book is the strongest "not spam" signal a phone or mailbox
// takes, and it is the one thing we can hand a homeowner as a single tap: on iOS and Android
// the .vcf opens the native contact sheet and they approve it there. (Same pattern as
// Social Revolution, see brain systems/inbox-placement-method.)
const CARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:;Rinse It Off;;;",
  "FN:Rinse It Off",
  "ORG:Rinse It Off",
  "TEL;TYPE=CELL,VOICE,PREF:+19716264146",
  "EMAIL;TYPE=INTERNET,PREF:hello@rinseitoff.com",
  "URL:https://rinseitoff.com",
  "ADR;TYPE=WORK:;;;Portland;OR;;USA",
  "NOTE:Texts and emails about your membership quote and visits.",
  "END:VCARD",
].join("\r\n");

export function GET() {
  return new Response(CARD, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Rinse It Off.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
