"use client";

/**
 * HalChat: the rinseitoff.com website chat. Our own bubble and panel; the conversation is GoHighLevel's.
 *
 * Bri, 2026-10-19: "Put Hal's face or something on the chat widget. The chat itself - it should be an actual
 * chat, not a contact form inside a chat like it is now."
 *
 * Transport (public, CORS *, no secrets; method in ~/brain/systems/ghl-live-chat-custom-widget.md):
 *   send     POST services.leadconnectorhq.com/conversations/providers/live-chat/messages
 *   replies  socket.io (Engine.IO v4) at /sockets-live-chat/socket.io, spoken directly over WebSocket so the
 *            site needs no socket.io-client dependency
 *   consent  POST /chat-widget/forms with chatType Live_Chat + conversationId + a2pPayload, the same call GHL's
 *            own widget makes when it collects a phone number inside a live chat
 * The bot ("Hal · Website chat", Conversation AI, Live_Chat only) is defined in
 * ~/tools/rinse-it-off-ghl/hal_chat_bot.py. Prompt, knowledge base and hand-off live there, not here.
 *
 * A2P: campaign CEQK4DS says the site's chat widget is the opt-in surface, with two separate, unticked consent
 * checkboxes (customer care, promotional) and that it is the only form on the page collecting a phone number.
 * The consent card below keeps both boxes and GHL's registered wording, and only opens when the visitor asks
 * for the team to follow up. Keep it the only phone field on any page this is mounted on.
 *
 * Any element can open the chat: window.dispatchEvent(new Event("rio:open-chat"))
 */

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type MutableRefObject } from "react";

const GHL = "https://services.leadconnectorhq.com";
const LOCATION_ID = "UiIMlTlrvkxfxHx5ErG2"; // Rinse It Off sub-account
const WIDGET_ID = "6a32ee4e81870ee2fd443c44"; // the A2P-registered chat widget; consent is recorded against it
const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "+19716264146";
const K_SESSION = "rio-hal-session-v1";
const K_MESSAGES = "rio-hal-messages-v1";
const SLOW_REPLY_MS = 30000;

const GREETING =
  "Hi, I'm Hal, Rinse It Off's hummingbird. I've seen a lot of Portland roofs, and I have opinions about the moss. What can I help you with?";
const QUICK_REPLIES = ["What do you clean?", "How much is the home plan?", "Do you do holiday lights?", "I manage a commercial property"];

// GHL's registered A2P opt-in wording for this widget (config a-two-p-compliance, read 2026-10-19). The text
// sent in a2pPayload must match what the visitor saw, so the same strings feed both.
const CONSENT_CARE =
  "By submitting, you authorize Fresh Rinse, LLC to text/call the number above for informational/transactional messages, possibly using automated means. Msg/data rates apply, msg frequency varies. Consent is not a condition of purchase. See terms and privacy policy. Text HELP for help and STOP to unsubscribe.";
const CONSENT_PROMO =
  "By submitting, you authorize Fresh Rinse, LLC to text/call the number above for promotional messages, possibly using automated means. Msg/data rates apply, msg frequency varies. Consent is not a condition of purchase. See terms and privacy policy. Text HELP for help and STOP to unsubscribe.";

type Msg = { id: string; from: "hal" | "you" | "note"; text: string };
type Session = { token: string; conversationId: string; visitorId: string; contactId?: string };

const uid = () => Math.random().toString(36).slice(2, 10);
const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = sessionStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    sessionStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

/** Minimal socket.io v4 client: open, connect the default namespace, answer pings, ack, reconnect. */
function connectSocket(s: Session, onEvent: (p: { event?: string; message?: string }) => void) {
  const path = "/sockets-live-chat/socket.io";
  const q = new URLSearchParams({
    authorization: `Bearer ${s.token}`, channel: "CHAT_WIDGET", source: "CHAT_WIDGET_VISITOR",
    authClassId: s.visitorId, visitorId: s.visitorId, locationId: LOCATION_ID, version: "2021-07-28", path,
    EIO: "4", transport: "websocket",
  });
  let ws: WebSocket | null = null;
  let closed = false;
  let tries = 0;
  const open = () => {
    ws = new WebSocket(`wss://services.leadconnectorhq.com${path}/?${q}`);
    ws.onmessage = (ev) => {
      const d = String(ev.data);
      if (d === "2") return ws?.send("3");
      if (d.startsWith("0")) return ws?.send("40");
      if (d.startsWith("40")) { tries = 0; return; }
      const m = d.match(/^42(\d*)(\[[\s\S]*\])$/);
      if (!m) return;
      try {
        const [name, payload] = JSON.parse(m[2]);
        if (m[1]) ws?.send(`43${m[1]}[{"ack":true}]`);
        if (name === "sendMessage" && payload) onEvent(payload);
      } catch {}
    };
    ws.onclose = () => {
      if (closed) return;
      setTimeout(open, Math.min(15000, 1000 * 2 ** tries++));
    };
  };
  open();
  return { close: () => { closed = true; ws?.close(); } };
}

/** GHL's widget decrypts the /open request token with this AES-GCM key. It ships in GHL's public widget JS. */
async function requestToken(): Promise<string> {
  const u = new URL(`${GHL}/chat-widget/public/open/${LOCATION_ID}`);
  u.searchParams.set("chatType", "liveChat");
  u.searchParams.set("widgetId", WIDGET_ID);
  const r = await fetch(u, { headers: { "Content-Type": "application/json", "location-id": LOCATION_ID } });
  if (!r.ok) return "";
  const enc = ((await r.json()) as { requestToken?: string }).requestToken || "";
  if (!enc || !globalThis.crypto?.subtle) return enc;
  try {
    const key = await crypto.subtle.importKey("raw",
      new Uint8Array("c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1".match(/../g)!.map((h) => parseInt(h, 16))),
      { name: "AES-GCM" }, false, ["decrypt"]);
    const raw = Uint8Array.from(atob(enc.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const body = new Uint8Array(raw.length - 12);
    body.set(raw.slice(28));
    body.set(raw.slice(12, 28), raw.length - 28);
    const out = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(0, 12), tagLength: 128 }, key, body);
    return btoa(String.fromCharCode(...new Uint8Array(out))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch {
    return "";
  }
}

const toE164 = (v: string) => {
  const d = v.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return "";
};
const prettyPhone = (e164: string) => e164.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
const WANTS_FOLLOWUP = /\b(call|text|ring) me\b|\bcall(ing)? ?back\b|\bcallback\b|\breach out\b|\bcontact me\b|\b(talk|speak) (to|with) (a |an )?(person|human|someone|somebody|bri|alstun|the team)\b|\bhave (someone|the team)\b/i;
const HAL_OFFERS_FORM = /form below|little form/i;
const LOOKS_LIKE_PHONE = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

/** Plain text in, safe nodes out: rinseitoff.com paths and the phone number become links. Dashes become commas. */
function RichText({ text }: { text: string }) {
  const clean = text.replace(/\s*[—–]\s*/g, ", ");
  const parts = clean.split(/((?:https?:\/\/)?(?:www\.)?rinseitoff\.com(?:\/[^\s,)]*)?|\(971\) 626-4146|971-626-4146)/gi);
  return (
    <>
      {parts.map((p, i) => {
        if (/rinseitoff\.com/i.test(p)) {
          const href = p.replace(/^(?:https?:\/\/)?(?:www\.)?rinseitoff\.com/i, "").replace(/[.?!]+$/, "") || "/";
          const trail = p.match(/[.?!]+$/)?.[0] ?? "";
          return (
            <span key={i}>
              <a href={href} className="hal-link">{p.slice(0, p.length - trail.length)}</a>
              {trail}
            </span>
          );
        }
        if (/626-4146/.test(p)) return <a key={i} href={`tel:${PHONE_TEL}`} className="hal-link">{p}</a>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export default function HalChat({ mobileBarOffset = 52 }: { mobileBarOffset?: number }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  const session = useRef<Session | null>(null);
  const socket = useRef<{ close: () => void } | null>(null);
  const slowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  openRef.current = open;

  // Restore this tab's conversation.
  useEffect(() => {
    session.current = read<Session | null>(K_SESSION, null);
    const saved = read<Msg[]>(K_MESSAGES, []);
    if (saved.length) setMessages(saved);
    return () => socket.current?.close();
  }, []);
  useEffect(() => { if (messages.length) write(K_MESSAGES, messages.slice(-80)); }, [messages]);

  const add = useCallback((from: Msg["from"], text: string) => {
    setMessages((m) => [...m, { id: uid(), from, text }]);
  }, []);

  const halSays = useCallback((text: string) => {
    if (slowTimer.current) clearTimeout(slowTimer.current);
    setTyping(false);
    add("hal", text);
    if (!openRef.current) setUnread(true);
    if (HAL_OFFERS_FORM.test(text)) setConsentOpen(true);
  }, [add]);

  const listen = useCallback(() => {
    if (socket.current || !session.current) return;
    socket.current = connectSocket(session.current, (e) => {
      if (e.event === "TYPING_ON") setTyping(true);
      else if (e.event === "TYPING_OFF") setTyping(false);
      // GHL logs a hand-off as an outbound "Employee action log created" line; it is not for the visitor.
      else if (e.event === "MESSAGE" && e.message?.trim() && !/^Employee action log created$/i.test(e.message.trim())) halSays(e.message.trim());
    });
  }, [halSays]);

  // Reconnect to an existing conversation when the page reloads mid-chat.
  useEffect(() => { if (open && session.current) listen(); }, [open, listen]);

  const post = useCallback(async (text: string, retried = false, waited = false): Promise<void> => {
    const s = session.current;
    const r = await fetch(`${GHL}/conversations/providers/live-chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(s && { Authorization: `Bearer ${s.token}` }) },
      body: JSON.stringify({ locationId: LOCATION_ID, message: text, type: "Live_Chat", chatWidgetId: WIDGET_ID, ...(s && { conversationId: s.conversationId }) }),
    });
    if (r.status === 401 && s && !retried) {
      // Expired visitor token: start a fresh conversation rather than failing.
      session.current = null;
      socket.current?.close();
      socket.current = null;
      return post(text, true);
    }
    if (r.status === 429 && !waited) {
      await new Promise((ok) => setTimeout(ok, 2500));
      return post(text, retried, true);
    }
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json();
    if (d.token && d.conversationId) {
      session.current = { token: d.token, conversationId: d.conversationId, visitorId: d.visitorId, contactId: d.contactId };
      write(K_SESSION, session.current);
    }
    listen();
  }, [listen]);

  const send = useCallback(async (raw: string, fromCard = false) => {
    const text = raw.trim();
    if (!text) return;
    add("you", text);
    if (!fromCard) setInput("");
    if (!fromCard && (WANTS_FOLLOWUP.test(text) || LOOKS_LIKE_PHONE.test(text))) setConsentOpen(true);
    setTyping(true);
    try {
      await post(text);
      if (slowTimer.current) clearTimeout(slowTimer.current);
      slowTimer.current = setTimeout(() => {
        setTyping(false);
        add("note", `Hal's taking longer than usual. Your message is with the team, and you can also call or text ${PHONE_DISPLAY}.`);
      }, SLOW_REPLY_MS);
    } catch {
      setTyping(false);
      add("note", `That didn't go through. Try again in a moment, or call or text ${PHONE_DISPLAY}.`);
    }
  }, [add, post]);

  const openChat = useCallback(() => {
    setOpen(true);
    setUnread(false);
    setMessages((m) => (m.length ? m : [{ id: uid(), from: "hal", text: GREETING }]));
  }, []);
  const closeChat = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // Let any element on the site open the chat.
  useEffect(() => {
    const h = () => openChat();
    window.addEventListener("rio:open-chat", h);
    return () => window.removeEventListener("rio:open-chat", h);
  }, [openChat]);

  // Open: focus the input, Esc closes, Tab stays inside, the page behind doesn't scroll on phones.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeChat(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const phone = window.matchMedia("(max-width: 639px)").matches;
    const prev = document.body.style.overflow;
    if (phone) document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, closeChat]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, typing, consentOpen, open]);

  const visitorSpoke = messages.some((m) => m.from === "you");

  return (
    <div className="hal-root" style={{ ["--hal-bar" as string]: `${mobileBarOffset}px` }}>
      <style>{CSS}</style>

      {open && (
        <div ref={panelRef} id={panelId} className="hal-panel" role="dialog" aria-modal="true" aria-labelledby={`${panelId}-title`}>
          <header className="hal-head">
            <span className="hal-avatar hal-avatar-lg" aria-hidden="true"><HalFace /></span>
            <div className="hal-head-text">
              <h2 id={`${panelId}-title`} className="hal-title">Hal</h2>
              <p className="hal-sub">Rinse It Off&rsquo;s hummingbird</p>
            </div>
            <button type="button" className="hal-icon-btn" onClick={closeChat} aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </header>

          <div ref={logRef} className="hal-log" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((m, i) => {
              if (m.from === "note") return <p key={m.id} className="hal-note">{m.text}</p>;
              const hal = m.from === "hal";
              const showFace = hal && messages[i - 1]?.from !== "hal";
              return (
                <div key={m.id} className={`hal-row ${hal ? "hal-row-hal" : "hal-row-you"}`}>
                  {hal && <span className={`hal-avatar hal-avatar-sm ${showFace ? "" : "hal-avatar-ghost"}`} aria-hidden="true">{showFace && <HalFace />}</span>}
                  <p className={`hal-bubble ${hal ? "hal-bubble-hal" : "hal-bubble-you"}`}>
                    <span className="hal-sr">{hal ? "Hal: " : "You: "}</span>
                    <RichText text={m.text} />
                  </p>
                </div>
              );
            })}
            {typing && (
              <div className="hal-row hal-row-hal">
                <span className="hal-avatar hal-avatar-sm hal-avatar-ghost" aria-hidden="true" />
                <span className="hal-bubble hal-bubble-hal hal-typing" role="status" aria-label="Hal is typing"><i /><i /><i /></span>
              </div>
            )}
            {!visitorSpoke && !typing && (
              <div className="hal-quick">
                {QUICK_REPLIES.map((q) => (
                  <button key={q} type="button" className="hal-chip" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}
            {consentOpen && (
              <ConsentCard
                session={session}
                ensureSession={() => (session.current ? Promise.resolve() : post("I'd like the team to text me."))}
                onDone={(name, phone, promo, recorded) => {
                  setConsentOpen(false);
                  if (recorded) {
                    // GHL posts "Contact Information: Name … Phone …" into this conversation itself; that is
                    // what Hal hands to the team, so nothing else is sent.
                    add("note", `Sent to the team: ${name}, ${prettyPhone(phone)}.`);
                    setTyping(true);
                  } else {
                    // The form call failed: put the request, the number and the boxes ticked in the conversation.
                    send(`Please have the team text me. Name: ${name}. Mobile: ${prettyPhone(phone)}. I ticked the box for customer care texts${promo ? " and the box for promotional texts" : ""}.`, true);
                  }
                }}
                onClose={() => setConsentOpen(false)}
              />
            )}
          </div>

          <form className="hal-compose" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <label htmlFor={`${panelId}-input`} className="hal-sr">Message Hal</label>
            <textarea
              ref={inputRef}
              id={`${panelId}-input`}
              rows={1}
              value={input}
              placeholder="Ask Hal anything"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              className="hal-input"
              maxLength={1000}
            />
            <button type="submit" className="hal-send" aria-label="Send message" disabled={!input.trim()}>
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16V4M4.5 9.5L10 4l5.5 5.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </form>
          {!consentOpen && (
            <p className="hal-foot">
              <button type="button" className="hal-foot-btn" onClick={() => setConsentOpen(true)}>Have the team text me</button>
            </p>
          )}
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`hal-launcher ${open ? "hal-launcher-open" : ""}`}
        onClick={() => (open ? closeChat() : openChat())}
        aria-label={open ? "Close chat with Hal" : unread ? "Open chat with Hal, new message" : "Chat with Hal"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        <span className="hal-launcher-face" aria-hidden="true"><HalFace /></span>
        {unread && !open && <span className="hal-dot" aria-hidden="true" />}
      </button>
    </div>
  );
}

function ConsentCard({ session, ensureSession, onDone, onClose }: {
  session: MutableRefObject<Session | null>;
  ensureSession: () => Promise<void>;
  onDone: (name: string, phone: string, promo: boolean, recorded: boolean) => void;
  onClose: () => void;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [care, setCare] = useState(false);
  const [promo, setPromo] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [err, setErr] = useState("");
  const token = useRef<{ value: string; at: number } | null>(null);

  // GHL rejects a form submitted within ~2.5 s of fetching its token, so fetch it when the card opens.
  useEffect(() => {
    requestToken().then((value) => { token.current = { value, at: Date.now() }; }).catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const e164 = toE164(phone);
    if (name.trim().split(/\s+/).length < 2) return setErr("Add your first and last name.");
    if (!e164) return setErr("That mobile number doesn't look right. Use 10 digits.");
    if (!care) return setErr("Tick the first box so the team is allowed to text you back.");
    setErr("");
    setState("sending");
    try {
      await ensureSession();
      const s = session.current;
      if (!token.current?.value) token.current = { value: await requestToken(), at: Date.now() };
      const wait = 2600 - (Date.now() - token.current.at);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const a2pPayload: Record<string, string> = { a2pOptInForm1: CONSENT_CARE };
      if (promo) a2pPayload.a2pOptInForm2 = CONSENT_PROMO;
      const r = await fetch(`${GHL}/chat-widget/forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), phone: e164, locationId: LOCATION_ID, chatType: "Live_Chat",
          conversationId: s?.conversationId, requestToken: token.current.value, chatWidgetId: WIDGET_ID,
          a2pPayload, eventData: { medium: "ChatWidget" },
        }),
      });
      token.current = null;
      if (!r.ok) console.warn("HalChat: consent form returned", r.status);
      onDone(name.trim(), e164, promo, r.ok);
    } catch {
      setState("error");
      setErr(`That didn't send. Try again, or call or text ${PHONE_DISPLAY}.`);
    }
  };

  return (
    <form className="hal-card" onSubmit={submit} aria-labelledby={`${id}-h`} noValidate>
      <div className="hal-card-top">
        <p id={`${id}-h`} className="hal-card-title">Have the team text you</p>
        <button type="button" className="hal-icon-btn hal-icon-btn-sm" onClick={onClose} aria-label="Close this form">
          <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
      <label className="hal-field">
        <span>First and last name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </label>
      <label className="hal-field">
        <span>Mobile number</span>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" required />
      </label>
      <label className="hal-check">
        <input type="checkbox" checked={care} onChange={(e) => setCare(e.target.checked)} />
        <span>{ConsentText(CONSENT_CARE)}</span>
      </label>
      <label className="hal-check">
        <input type="checkbox" checked={promo} onChange={(e) => setPromo(e.target.checked)} />
        <span>{ConsentText(CONSENT_PROMO)}</span>
      </label>
      {err && <p className="hal-err" role="alert">{err}</p>}
      <button type="submit" className="hal-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send to the team"}
      </button>
      <p className="hal-card-alt">Or call <a className="hal-link" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>.</p>
    </form>
  );
}

/** The registered wording, with "terms" and "privacy policy" linked to the pages the A2P campaign names. */
function ConsentText(t: string) {
  const [a, rest] = t.split("See terms and privacy policy.");
  return (
    <>
      {a}See <a className="hal-link" href="/terms" target="_blank" rel="noopener">terms</a> and{" "}
      <a className="hal-link" href="/privacy" target="_blank" rel="noopener">privacy policy</a>.{rest}
    </>
  );
}

function HalFace() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/hal/hal-mark.svg" alt="" width={64} height={64} draggable={false} />;
}

const CSS = `
.hal-root{--hal-cream:#FFFFFF;--hal-paper:#F8FAF6;--hal-ink:#102E32;--hal-teal:#2F6B66;--hal-line:#D4E0DC;--hal-muted:#5A7275;--hal-gold:#F9D8E6;--hal-orange:#D6336C;
  --hal-gap:16px;--hal-bottom:calc(var(--hal-gap) + env(safe-area-inset-bottom));--hal-right:calc(var(--hal-gap) + env(safe-area-inset-right))}
@media (max-width:767px){.hal-root{--hal-bottom:calc(var(--hal-bar) + 14px + env(safe-area-inset-bottom));--hal-right:calc(12px + env(safe-area-inset-right))}}
.hal-root *{box-sizing:border-box}
.hal-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.hal-launcher{position:fixed;right:var(--hal-right);bottom:var(--hal-bottom);z-index:60;width:44px;height:44px;border-radius:999px;border:3px solid var(--hal-teal);
  background:var(--hal-paper);box-shadow:0 0 0 1.5px var(--hal-ink);display:grid;place-items:center;cursor:pointer;padding:0;
  transition:transform .18s ease}
.hal-launcher:hover{transform:translateY(-1px)}
.hal-launcher:focus-visible,.hal-chip:focus-visible,.hal-send:focus-visible,.hal-icon-btn:focus-visible,.hal-primary:focus-visible,.hal-foot-btn:focus-visible,.hal-launcher-face{width:32px;height:32px;display:block;transform:translateX(-1px)}
.hal-launcher-face img,.hal-avatar img{width:100%;height:100%;display:block}
.hal-dot{position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:999px;background:var(--hal-orange);border:2px solid var(--hal-paper)}
.hal-panel{position:fixed;z-index:61;right:var(--hal-right);bottom:calc(var(--hal-bottom) + 56px);width:min(390px,calc(100vw - 32px));height:min(620px,calc(100dvh - var(--hal-bottom) - 80px));
  display:flex;flex-direction:column;background:var(--hal-paper);color:var(--hal-ink);border:1.5px solid var(--hal-ink);border-radius:14px;box-shadow:0 12px 32px rgba(16,46,50,.18);overflow:hidden;
  font-family:var(--font-text);transform-origin:bottom right;animation:hal-pop .22s ease-out}
@media (max-width:639px){
  .hal-panel{inset:0;width:100%;height:100dvh;border:0;border-radius:0;box-shadow:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);animation:hal-up .24s ease-out}
  .hal-launcher-open{display:none}
}
.hal-head{display:flex;align-items:center;gap:12px;padding:14px 14px 12px 16px;background:var(--hal-cream);border-bottom:1.5px solid var(--hal-ink)}
.hal-head-text{flex:1;min-width:0}
.hal-title{margin:0;font-family:var(--font-title)!important;font-weight:900!important;font-size:24px;line-height:1;letter-spacing:-.01em}
.hal-sub{margin:4px 0 0;font-family:var(--font-label);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--hal-muted)}
.hal-avatar{display:grid;place-items:center;flex:none;border-radius:999px;background:var(--hal-paper);border:1.5px solid var(--hal-ink);overflow:hidden}
.hal-avatar-lg{width:46px;height:46px;padding:4px}
.hal-avatar-sm{width:30px;height:30px;padding:3px;align-self:flex-end}
.hal-avatar-ghost{visibility:hidden}
.hal-icon-btn{all:unset;cursor:pointer;display:grid;place-items:center;width:40px;height:40px;border-radius:999px;color:var(--hal-ink)}
.hal-icon-btn:hover{background:rgba(16,46,50,.07)}
.hal-icon-btn-sm{width:30px;height:30px}
.hal-log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:18px 14px 10px;display:flex;flex-direction:column;gap:10px;background:var(--hal-paper)}
.hal-row{display:flex;gap:8px;align-items:flex-end}
.hal-row-you{justify-content:flex-end}
.hal-bubble{margin:0;max-width:82%;padding:10px 14px;font-size:15px;line-height:1.45;border-radius:14px;border:1.5px solid var(--hal-ink);white-space:pre-wrap;overflow-wrap:anywhere}
.hal-bubble-hal{background:var(--hal-cream);color:var(--hal-ink);border-bottom-left-radius:4px}
.hal-bubble-you{background:var(--hal-teal);color:var(--hal-paper);border-bottom-right-radius:4px}
.hal-link{color:inherit;text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1.5px}
.hal-note{margin:2px 6px;font-size:13px;line-height:1.4;color:var(--hal-muted);text-align:center}
.hal-typing{display:inline-flex;gap:5px;align-items:center;padding:14px 16px}
.hal-typing i{width:7px;height:7px;border-radius:999px;background:var(--hal-ink);opacity:.35;animation:hal-dot 1.1s infinite ease-in-out}
.hal-typing i:nth-child(2){animation-delay:.15s}.hal-typing i:nth-child(3){animation-delay:.3s}
.hal-quick{display:flex;flex-wrap:wrap;gap:8px;padding:4px 0 0 38px}
.hal-chip{all:unset;cursor:pointer;font-size:14px;line-height:1.2;padding:8px 13px;border-radius:14px;border:1.5px solid var(--hal-ink);background:var(--hal-paper);color:var(--hal-ink)}
.hal-chip:hover{background:var(--hal-cream)}
.hal-compose{display:flex;align-items:flex-end;gap:8px;padding:10px 12px;border-top:1.5px solid var(--hal-ink);background:var(--hal-paper)}
.hal-input{flex:1;resize:none;max-height:120px;min-height:44px;font:inherit;font-size:16px;line-height:1.35;color:var(--hal-ink);background:#FFFFFF;border:1.5px solid var(--hal-ink);border-radius:14px;padding:11px 14px;outline:none}
.hal-input:focus{box-shadow:0 0 0 3px rgba(47,107,102,.35)}
.hal-send{all:unset;box-sizing:border-box;cursor:pointer;flex:none;width:44px;height:44px;border-radius:12px;background:var(--hal-teal);color:var(--hal-paper);border:2px solid var(--hal-ink);box-shadow:4px 4px 0 var(--hal-ink);display:grid;place-items:center;margin:0 4px 4px 0;transition:transform .12s ease,box-shadow .12s ease}
.hal-send:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--hal-ink)}
.hal-send:disabled{opacity:.45;cursor:default}
.hal-foot{margin:0;padding:0 12px 10px;text-align:center;background:var(--hal-paper)}
.hal-foot-btn{all:unset;cursor:pointer;font-size:13px;color:var(--hal-muted);text-decoration:underline;text-underline-offset:2px;padding:4px 6px}
.hal-card{margin:4px 0 6px 38px;padding:14px;border:1.5px solid var(--hal-ink);border-radius:14px;background:var(--hal-cream);display:flex;flex-direction:column;gap:10px}
.hal-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:-4px -6px -2px 0}
.hal-card-title{margin:0;font-family:var(--font-title);font-weight:800;font-size:17px;line-height:1.2}
.hal-field{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:500}
.hal-field input{font:inherit;font-size:16px;font-weight:400;color:var(--hal-ink);background:#FFFFFF;border:1.5px solid var(--hal-ink);border-radius:10px;padding:10px 12px;outline:none;min-height:44px}
.hal-field input:focus{box-shadow:0 0 0 3px rgba(47,107,102,.35)}
.hal-check{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;line-height:1.45;color:#3E5A5D}
.hal-check input{flex:none;width:20px;height:20px;margin:1px 0 0;accent-color:var(--hal-ink)}
.hal-err{margin:0;font-size:13px;color:#9c3f1d}
.hal-primary{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;font-family:var(--font-label);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:14px;padding:12px 16px;border-radius:14px;background:var(--hal-teal);color:var(--hal-paper);border:2px solid var(--hal-ink);box-shadow:4px 4px 0 var(--hal-ink);margin:0 4px 4px 0}
.hal-primary:disabled{opacity:.6;cursor:default}
.hal-card-alt{margin:0;font-size:13px;color:var(--hal-muted);text-align:center}
@keyframes hal-pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
@keyframes hal-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes hal-dot{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-4px);opacity:.9}}
@media (prefers-reduced-motion:reduce){.hal-root *{animation:none!important;transition:none!important}}
`;
