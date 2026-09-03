"use client";
import { useEffect, useMemo, useState } from "react";
import { bookFirstVisit, confirmDeposit, depositCheckout, submitPlanQuote } from "./actions";
import { getFreeSlots } from "../assessment/actions";
import {
  ADD_ONS,
  ADD_ON_GROUPS,
  DEPOSIT_USD,
  MEMBER_MONTHLY_DISCOUNT,
  MEMBERSHIPS_PER_YEAR,
  MONTHLY_FLOOR,
  MULTI_YEAR_PREPAID_DISCOUNT,
  PREPAID_UNDER_MONTHLY,
  TERM_OPTIONS,
  depositSchedule,
  effectivePrice,
  WINDOW_VISITS_PER_YEAR,
  prepaidTermTotal,
  type TermYears,
  priceHouse,
  suggestedAddOns,
  type Access,
  type AddOnAnswer,
  type DrivewaySize,
  type ExactInputs,
  type HouseInputs,
  type RoofType,
  type Stories,
} from "./pricing";

// ─── Design tokens (inlined, same source as the assessment page) ──────────────
const DS = `
  @import url("https://use.typekit.net/asf7gwn.css");

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:           #0C1215;
    --blue:          #62C4EB;
    --blue-deep:     #3AA8D4;
    --blue-wash:     #EDF7FC;
    --mint:          #4DFFA6;
    --surface:       #FFFFFF;
    --surface-alt:   #F4F7F8;
    --text-primary:  #0C1215;
    --text-secondary:#4B5C6B;
    --text-muted:    #8C9AA5;
    --border:        #E4ECF1;
    --border-light:  #EFF4F7;
    --font-display: "neue-haas-grotesk-display", system-ui, -apple-system, sans-serif;
    --font-body:    "neue-haas-grotesk-text", system-ui, -apple-system, sans-serif;
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-2xl: 32px;
    --shadow-soft: 0 2px 16px rgba(12,18,21,0.05);
    --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
    --aura-water:
      radial-gradient(120% 120% at 12% 10%, #DDF1FB 0%, transparent 55%),
      radial-gradient(120% 120% at 88% 22%, #E9F6FC 0%, transparent 55%),
      radial-gradient(140% 130% at 55% 100%, #EEF5FB 0%, transparent 60%);
  }

  html { -webkit-font-smoothing: antialiased; }
  body { font-family: var(--font-body); color: var(--text-primary); background: var(--surface); }
  ::selection { background: rgba(77,255,166,0.25); }

  .plan { font-family: var(--font-body); color: var(--text-primary); background: var(--surface); min-height: 100vh; width: 100%; max-width: 100vw; overflow-x: hidden; }
  .plan * { min-width: 0; }
  .plan img, .plan input, .plan select, .plan button { max-width: 100%; }
  .plan-wrap, .plan-card { width: 100%; }
  .plan h1, .plan h2, .plan p, .plan .price-for, .plan .choice { overflow-wrap: anywhere; }
  .plan a:focus-visible, .plan button:focus-visible, .plan input:focus-visible, .plan select:focus-visible {
    outline: 2px solid var(--blue); outline-offset: 2px;
  }

  .plan-header { background: var(--ink); padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .plan-header a.phone { font-family: var(--font-display); font-weight: 600; font-size: 0.9375rem; color: var(--blue); text-decoration: none; white-space: nowrap; }

  .plan-hero { background: var(--aura-water); background-color: var(--surface-alt); padding: 36px 24px 32px; }
  .plan-hero h1 { font-family: var(--font-display); font-weight: 400; font-size: clamp(2rem, 6vw, 3rem); letter-spacing: -0.03em; line-height: 1.0; color: var(--ink); margin-bottom: 14px; text-wrap: balance; }
  .plan-hero h1 .accent { color: var(--blue); font-weight: 500; }
  .plan-hero p { font-size: 1.0625rem; line-height: 1.6; color: var(--text-secondary); max-width: 440px; margin: 0 auto; text-wrap: pretty; }

  .plan-wrap { max-width: 560px; margin: 0 auto; padding: 24px 16px 64px; }
  .plan-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--r-2xl); padding: clamp(22px, 5vw, 40px); box-shadow: var(--shadow-soft); }

  /* Step counter: the one place a small label is allowed. */
  .steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 28px; }
  .steps .seg { height: 4px; border-radius: 2px; background: var(--border); transition: background 0.3s var(--ease-out-expo); }
  .steps .seg.on { background: var(--blue); }
  .steps .seg.past { background: var(--ink); }
  .steps .name { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); margin-top: 8px; }
  .steps .name.on { color: var(--ink); }

  .plan h2 { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.5rem, 4.5vw, 1.875rem); letter-spacing: -0.02em; line-height: 1.1; color: var(--ink); margin-bottom: 8px; text-wrap: balance; }
  .plan .lead { font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 24px; text-wrap: pretty; }
  .plan .summary { font-size: 0.875rem; line-height: 1.6; color: var(--text-muted); margin: -2px 0 14px; text-wrap: pretty; }
  .plan .summary strong { color: var(--text-primary); font-weight: 500; }
  .plan .linkish { background: none; border: none; padding: 0; font: inherit; color: var(--blue-deep); text-decoration: underline; cursor: pointer; min-height: 0; }

  .field { margin-bottom: 22px; }
  .field label, .field .q { display: block; font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; }
  .field .help { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; margin-top: 8px; }
  .field input, .field select {
    width: 100%; min-height: 52px; padding: 12px 14px; border: 2px solid var(--border); border-radius: var(--r-md);
    font-size: 1.0625rem; font-family: var(--font-body); color: var(--ink); background: var(--surface);
    transition: border-color 0.15s; appearance: none; -webkit-appearance: none;
  }
  .field input:focus, .field select:focus { border-color: var(--blue); outline: none; }
  .field select { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234B5C6B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
  details.more { margin-top: 8px; }
  details.more summary { list-style: none; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; min-height: 40px; }
  details.more summary::-webkit-details-marker { display: none; }
  details.more summary::before { content: ""; width: 7px; height: 7px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(-45deg); transition: transform 0.2s; margin-left: 2px; }
  details.more[open] summary::before { transform: rotate(45deg); }
  details.more summary .opt { font-weight: 400; color: var(--text-muted); }
  details.more .row { display: grid; gap: 8px; margin-top: 6px; }
  details.more .row.two { grid-template-columns: 1fr 1fr; }
  details.more label { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 4px; }
  details.more input { min-height: 46px; font-size: 1rem; }
  .addr-row { display: grid; grid-template-columns: 1fr 56px 96px; gap: 8px; margin-top: 8px; }
  .addr-row input { text-align: left; }
  .unit-wrap { position: relative; }
  .unit-wrap .unit { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 0.9375rem; color: var(--text-muted); pointer-events: none; }

  .choices { display: grid; gap: 8px; }
  .choices.cols-3 { grid-template-columns: repeat(3, 1fr); }
  .choice {
    min-height: 52px; padding: 12px 14px; border: 2px solid var(--border); border-radius: var(--r-md);
    background: var(--surface); color: var(--ink); font-family: var(--font-body); font-size: 0.9375rem; font-weight: 400;
    text-align: left; cursor: pointer; transition: border-color 0.15s, background 0.15s; display: flex; align-items: center; gap: 10px; line-height: 1.3;
  }
  .choice.center { justify-content: center; text-align: center; font-family: var(--font-display); font-weight: 600; font-size: 1.0625rem; }
  .choice.on { border-color: var(--blue); background: var(--blue-wash); font-weight: 500; }
  .choice .box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: transparent; }
  .choice.on .box { border-color: var(--blue); background: var(--blue); }
  .choice .sub { display: block; font-size: 0.8125rem; color: var(--text-muted); font-weight: 400; margin-top: 2px; }

  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 56px; padding: 16px 24px; border: none; border-radius: var(--r-md); font-family: var(--font-display); font-weight: 600; font-size: 1.0625rem; letter-spacing: -0.01em; cursor: pointer; transition: transform 0.2s var(--ease-out-expo), background 0.2s; }
  .btn-ink { background: var(--ink); color: #fff; }
  .btn-ink:hover { background: #1a232a; }
  .btn-ink:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--text-secondary); font-family: var(--font-body); font-weight: 500; font-size: 0.9375rem; min-height: 44px; }
  .btn-ghost:hover { color: var(--ink); }

  .offer { border: 2px solid var(--ink); border-radius: var(--r-lg); padding: 18px 20px 16px; margin-bottom: 12px; }
  .offer .price-big { margin: 0 0 4px; }
  .offer .bill { font-size: 1rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 8px; }
  .lock { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .lock-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); white-space: nowrap; }
  .lock-choices { display: flex; gap: 6px; flex: 1; }
  .lock-choices button { flex: 1; min-height: 40px; border: 2px solid var(--border); border-radius: var(--r-sm); background: var(--surface); font-family: var(--font-body); font-size: 0.875rem; font-weight: 500; color: var(--ink); cursor: pointer; }
  .lock-choices button.on { border-color: var(--blue); background: var(--blue-wash); }
  .stack { margin: 18px 0 6px; }
  .stack h3 { font-family: var(--font-display); font-weight: 500; font-size: 1.125rem; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 6px; }
  .stack-row { display: flex; justify-content: space-between; gap: 12px; padding: 9px 0; border-top: 1px solid var(--border-light); font-size: 0.9375rem; }
  .stack-row .l { color: var(--text-primary); display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .stack-row .l .t { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
  .stack-row .l .sub { font-size: 0.8125rem; color: var(--text-muted); }
  .stack-row .a { font-variant-numeric: tabular-nums; white-space: nowrap; color: var(--text-primary); }
  .stack-row .a.strike { text-decoration: line-through; color: var(--text-muted); }
  .stack-row .free { font-size: 0.75rem; font-weight: 500; color: var(--ink); border: 1px solid var(--ink); border-radius: var(--r-sm); padding: 0 7px; line-height: 1.5; }
  .stack-total { border-top: 1px solid var(--border); margin-top: 4px; padding-top: 8px; }
  .stack-total .t { display: flex; justify-content: space-between; align-items: baseline; padding: 5px 0; font-size: 0.9375rem; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
  .stack-total .t.yours { border-top: 2px solid var(--ink); margin-top: 6px; padding-top: 12px; color: var(--ink); font-weight: 600; font-size: 1rem; }
  .stack-total .t.yours .pay { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .stack-total .t.yours .amt { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.875rem, 8vw, 2.25rem); letter-spacing: -0.03em; line-height: 1; white-space: nowrap; }
  .stack-total .t.yours .eq { font-family: var(--font-body); font-weight: 400; font-size: 0.8125rem; color: var(--text-muted); white-space: nowrap; }
  .save-block { background: var(--mint); color: var(--ink); border-radius: var(--r-lg); padding: 18px 20px 16px; margin-top: 10px; text-align: center; }
  .save-block .k { font-size: 0.9375rem; font-weight: 500; }
  .save-block .v { font-family: var(--font-display); font-weight: 500; font-size: 2rem; letter-spacing: -0.02em; line-height: 1; margin: 4px 0 6px; font-variant-numeric: tabular-nums; }
  .save-block .s { font-size: 0.9375rem; line-height: 1.4; }
  .upgrade { width: 100%; display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 12px 14px; border: 2px solid var(--border); border-radius: var(--r-lg); background: var(--surface); text-align: left; cursor: pointer; font-family: var(--font-body); }
  .upgrade.on { border-color: var(--blue); background: var(--blue-wash); }
  .upgrade .box { width: 20px; height: 20px; border-radius: 5px; border: 2px solid var(--border); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; }
  .upgrade.on .box { border-color: var(--blue); background: var(--blue); }
  .upgrade .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .upgrade .t { font-size: 0.9375rem; font-weight: 500; color: var(--ink); }
  .upgrade .sub { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.4; }
  .upgrade .amt { font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--ink); white-space: nowrap; }
  .scarcity { background: var(--surface-alt); border-radius: var(--r-lg); padding: 14px 16px; margin-top: 18px; font-size: 0.9375rem; line-height: 1.55; color: var(--text-primary); text-wrap: pretty; }
  .guarantee { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.5; margin-top: 12px; text-wrap: pretty; }
  .price-big { display: flex; align-items: baseline; gap: 6px; margin: 4px 0 6px; }
  .price-big .num { font-family: var(--font-display); font-weight: 400; font-size: clamp(4rem, 18vw, 6rem); letter-spacing: -0.04em; line-height: 0.95; color: var(--ink); font-variant-numeric: tabular-nums; }
  .price-big .per { font-family: var(--font-body); font-size: 1.125rem; color: var(--text-secondary); }
  .price-for { font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }
  .price-for strong { color: var(--ink); font-weight: 500; }

  .strip { background: var(--mint); color: var(--ink); border-radius: var(--r-md); padding: 10px 14px; margin: -12px 0 22px; font-size: 0.875rem; line-height: 1.5; font-weight: 500; text-wrap: pretty; }
  .strip span { font-weight: 400; opacity: 0.75; margin: 0 6px; }

  .toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: var(--surface-alt); border-radius: var(--r-md); padding: 4px; margin: 4px 0 16px; }
  .toggle button { min-height: 48px; border: none; border-radius: 9px; background: transparent; font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .toggle button.on { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-soft); }
  .toggle .tag { font-family: var(--font-body); font-size: 0.75rem; font-weight: 500; color: var(--ink); border: 1px solid var(--ink); border-radius: var(--r-sm); padding: 1px 7px; }



  .fine { font-size: 0.875rem; line-height: 1.55; color: var(--text-muted); text-wrap: pretty; }

  details.math { margin: 18px 0 8px; }
  details.math summary { cursor: pointer; font-size: 0.9375rem; font-weight: 500; color: var(--text-secondary); list-style: none; display: flex; align-items: center; gap: 8px; min-height: 44px; }
  details.math summary::-webkit-details-marker { display: none; }
  details.math summary::before { content: ""; width: 8px; height: 8px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(-45deg); transition: transform 0.2s; margin-left: 2px; }
  details.math[open] summary::before { transform: rotate(45deg); }
  .math-line { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid var(--border-light); font-size: 0.9375rem; }
  .math-line .l { color: var(--text-primary); }
  .math-line .d { display: block; font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
  .math-line .a { font-variant-numeric: tabular-nums; color: var(--text-primary); white-space: nowrap; }
  .math-line.total { border-top: 2px solid var(--border); font-weight: 500; }
  .math-line.mint .a, .math-line.mint .l { color: #0a7a4b; }
  .math-line .strike { text-decoration: line-through; color: var(--text-muted); font-weight: 400; margin-right: 8px; }
  .math-line .free { display: inline-block; background: var(--mint); color: var(--ink); border-radius: var(--r-sm); padding: 2px 8px; font-size: 0.8125rem; font-weight: 500; }
  .math-line .a.wrap { white-space: normal; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; max-width: 46%; }
  .math-line .a.wrap .strike { margin-right: 0; }
  .term { margin: -6px 0 18px; }
  .term .q { font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin-bottom: 8px; text-wrap: pretty; }
  .term .choice.center { min-height: 44px; font-size: 0.9375rem; }
  .term-note { font-size: 0.9375rem; color: var(--text-secondary); margin-top: 10px; line-height: 1.5; }

  .addon { align-items: flex-start; }
  .addon .box { margin-top: 2px; }
  .addon .body { flex: 1; }
  .addon .title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .addon-group { margin-bottom: 16px; }
  .addon-group .grp { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
  .checklist { display: grid; grid-template-columns: 1fr; gap: 4px; }
  @media (min-width: 560px) { .checklist { grid-template-columns: 1fr 1fr; column-gap: 12px; } }
  .checklist .row { min-height: 44px; padding: 8px 10px; border: 1px solid transparent; border-radius: var(--r-sm); background: transparent; color: var(--ink); font-family: var(--font-body); font-size: 0.9375rem; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 10px; line-height: 1.3; }
  .checklist .row:hover { background: var(--surface-alt); }
  .checklist .row.on { background: var(--blue-wash); border-color: var(--blue); }
  .checklist .row .box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border); flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; }
  .checklist .row.on .box { border-color: var(--blue); background: var(--blue); }
  .checklist .row .name { flex: 1; }
  .checklist .item { min-width: 0; }
  .checklist .ask { padding: 2px 10px 10px 38px; display: grid; gap: 8px; }
  .checklist .ask .muted { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.4; }
  .checklist .ask-row { display: grid; grid-template-columns: 1fr; gap: 6px; }
  .checklist .ask-row label { font-size: 0.8125rem; color: var(--text-secondary); font-weight: 500; }
  .checklist .ask-row input { min-height: 40px; padding: 6px 10px; border: 2px solid var(--border); border-radius: var(--r-sm); font-size: 1rem; font-family: var(--font-body); }
  .checklist .ask-row input:disabled { background: var(--surface-alt); color: var(--text-muted); }
  .checklist .surfaces { display: flex; gap: 6px; }
  .checklist .mini { min-height: 36px; padding: 4px 12px; border: 2px solid var(--border); border-radius: var(--r-sm); background: var(--surface); font-family: var(--font-body); font-size: 0.8125rem; font-weight: 500; color: var(--ink); cursor: pointer; justify-self: start; }
  .checklist .mini.on { border-color: var(--blue); background: var(--blue-wash); }
  .checklist .row .pop { font-size: 0.75rem; font-weight: 500; color: var(--ink); background: var(--mint); border-radius: var(--r-sm); padding: 2px 7px; line-height: 1.4; flex-shrink: 0; }
  .addon .pop { font-size: 0.75rem; font-weight: 500; color: var(--ink); background: var(--mint); border-radius: var(--r-sm); padding: 2px 7px; line-height: 1.4; }
  .addon .was { text-decoration: line-through; color: var(--text-muted); margin-right: 6px; }
  .addon .now { color: var(--ink); font-weight: 500; }
  .running { background: var(--blue-wash); border: 2px solid var(--blue); border-radius: var(--r-lg); padding: 12px 16px; margin-top: 14px; font-size: 0.9375rem; line-height: 1.5; color: var(--text-primary); }
  .running strong { font-weight: 500; }

  .reserve { border: 2px solid var(--border); border-radius: var(--r-lg); padding: 18px; margin-bottom: 14px; }
  .reserve h3 { font-family: var(--font-display); font-weight: 500; font-size: 1.125rem; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 6px; }
  .reserve p { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
  .reserve.gated { border-style: dashed; }
  .reserve.gated h3, .reserve.gated p { color: var(--text-muted); }
  .btn.dev { border: 1px dashed var(--text-muted); font-size: 0.8125rem; min-height: 36px; margin-top: 8px; }
  .reserve .ok { background: var(--mint); color: var(--ink); border-radius: var(--r-md); padding: 12px 14px; font-size: 0.9375rem; line-height: 1.5; }
  .reserve a.btn { text-decoration: none; }
  .checkout { width: 100%; height: 720px; border: 1px solid var(--border); border-radius: var(--r-md); background: var(--surface); }
  .cal { border: 2px solid var(--border); border-radius: var(--r-lg); overflow: hidden; }
  .cal-head { display: flex; align-items: center; justify-content: space-between; background: var(--ink); color: #fff; padding: 10px 12px; font-family: var(--font-display); font-weight: 600; font-size: 0.9375rem; }
  .cal-head button { background: none; border: none; color: rgba(255,255,255,0.8); font-size: 22px; line-height: 1; padding: 0 10px; cursor: pointer; min-height: 32px; }
  .cal-head button:disabled { color: rgba(255,255,255,0.25); cursor: not-allowed; }
  .cal-dow { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--surface-alt); border-bottom: 1px solid var(--border-light); }
  .cal-dow span { text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); padding: 6px 0; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; background: var(--surface-alt); }
  .cal-day { aspect-ratio: 1; border: 2px solid transparent; border-radius: var(--r-sm); background: var(--surface); color: var(--border); font-family: var(--font-body); font-size: 0.9375rem; cursor: not-allowed; }
  .cal-day.open { color: var(--ink); font-weight: 600; cursor: pointer; border-color: var(--blue-wash); background: var(--blue-wash); }
  .cal-day.sel { background: var(--ink); color: var(--blue); border-color: var(--blue); }
  .times { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .time { min-height: 44px; padding: 8px 14px; border: 2px solid var(--border); border-radius: var(--r-sm); background: var(--surface); font-family: var(--font-body); font-size: 0.9375rem; color: var(--ink); cursor: pointer; }
  .time.on { border-color: var(--blue); background: var(--ink); color: var(--blue); }

  .error { background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--r-sm); padding: 12px 16px; margin-bottom: 16px; font-size: 0.875rem; color: #b91c1c; line-height: 1.5; }

  .consent { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-top: 12px; text-align: center; }
  .consent a { color: var(--blue-deep); text-decoration: underline; }

  .done { text-align: center; padding: 8px 0; }
  .done .mark { width: 64px; height: 64px; background: var(--blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--ink); }
  .done h2 { font-size: clamp(1.75rem, 6vw, 2.25rem); margin-bottom: 12px; }
  .done p { font-size: 1.0625rem; line-height: 1.6; color: var(--text-secondary); max-width: 420px; margin: 0 auto; text-wrap: pretty; }
  .done p + p { margin-top: 12px; }
  .done .tel { background: var(--ink); border-radius: var(--r-lg); padding: 18px 28px; display: inline-block; margin-top: 28px; }
  .done .tel .k { font-size: 0.8125rem; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
  .done .tel a { font-family: var(--font-display); font-weight: 700; font-size: 1.5rem; color: var(--blue); text-decoration: none; letter-spacing: -0.02em; }

  @media (prefers-reduced-motion: reduce) { .plan * { transition: none !important; } }
`;

const STEP_NAMES = ["House", "Price", "Add-ons", "Claim", "Reserve"];
type Billing = "monthly" | "annual";
const PCT = (d: number) => `${Math.round(d * 100)}%`;
const TZ = "America/Los_Angeles";
const slotTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const slotDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: TZ });
const DAYS = ["No preference", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function calDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1).getDay();
  const n = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(d);
  return cells;
}
const dateKey = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

export default function PlanCalculator({ src, dryRun = false }: { src: string; dryRun?: boolean }) {
  const [step, setStep] = useState(0);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("OR");
  const [zip, setZip] = useState("");
  const address = [street.trim(), city.trim(), `${stateCode.trim().toUpperCase()} ${zip.trim()}`.trim()].filter(Boolean).join(", ");
  const [answers, setAnswers] = useState<Record<string, AddOnAnswer>>({});
  const setAnswer = (k: string, patch: Partial<AddOnAnswer>) => setAnswers((p) => ({ ...p, [k]: { ...(p[k] || {}), ...patch } }));
  const [sqft, setSqft] = useState("");
  const [stories, setStories] = useState<Stories | 0>(0);
  const [windows, setWindows] = useState("");
  const [roof, setRoof] = useState<RoofType>("composition");
  const [driveway, setDriveway] = useState<DrivewaySize>("typical");
  const [access, setAccess] = useState<Access>("easy");
  const [exactText, setExactText] = useState<Record<keyof ExactInputs, string>>({ roofSf: "", drivewaySf: "", walkwaySf: "", gutterLf: "", largeWindows: "", frenchWindows: "" });
  const setExact = (k: keyof ExactInputs, v: string) => setExactText((p) => ({ ...p, [k]: v.replace(/[^0-9]/g, "").slice(0, 6) }));
  // An expander stays open while it holds a number (so coming back to this
  // step shows what was typed). Closing it means "use the generic choice":
  // its numbers are cleared.
  const [openMore, setOpenMore] = useState<Record<string, boolean>>({});
  const moreProps = (name: string, keys: (keyof ExactInputs)[]) => ({
    open: !!openMore[name] || keys.some((k) => exactText[k] !== ""),
    onToggle: (e: React.SyntheticEvent<HTMLDetailsElement>) => {
      const isOpen = e.currentTarget.open;
      setOpenMore((p) => ({ ...p, [name]: isOpen }));
      if (!isOpen) setExactText((p) => { const n = { ...p }; keys.forEach((k) => { n[k] = ""; }); return n; });
    },
  });
  const exact = useMemo(() => {
    const out: ExactInputs = {};
    (Object.keys(exactText) as (keyof ExactInputs)[]).forEach((k) => { const n = parseInt(exactText[k], 10); if (n > 0) out[k] = n; });
    return out;
  }, [exactText]);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", bestDay: DAYS[0] });
  const [billing, setBilling] = useState<Billing>("monthly");
  const [springGutters, setSpringGutters] = useState(false);
  const today = new Date();
  const [calY, setCalY] = useState(today.getFullYear());
  const [calM, setCalM] = useState(today.getMonth());
  const [pickedISO, setPickedISO] = useState("");
  const [term, setTerm] = useState<TermYears>(1);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState<{ saved: boolean; contactId?: string } | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  // Step 5: deposit + first visit (both optional).
  const [depositUrl, setDepositUrl] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositErr, setDepositErr] = useState("");
  const [depositPaid, setDepositPaid] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkNote, setCheckNote] = useState("");
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const [booking, setBooking] = useState("");
  const [bookedISO, setBookedISO] = useState("");
  const [bookErr, setBookErr] = useState("");

  const house: HouseInputs | null = useMemo(() => {
    const s = parseInt(sqft, 10);
    const w = parseInt(windows, 10);
    if (!street.trim() || !city.trim() || !(s > 0) || !stories || !(w >= 0) || windows === "") return null;
    return { address, addressParts: { street: street.trim(), city: city.trim(), state: stateCode.trim().toUpperCase() || "OR", zip: zip.trim() }, livingSqft: s, stories, windows: w, roof, driveway, access, exact };
  }, [address, street, city, stateCode, zip, sqft, stories, windows, roof, driveway, access, exact]);

  const price = useMemo(() => (house ? priceHouse(house) : null), [house]);

  const toggleAddOn = (k: string) => setAddOns((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const go = (n: number) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!house) return;
    setError("");
    setSending(true);
    const result = await submitPlanQuote({
      house,
      addOns,
      addOnAnswers: answers,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      bestDay: contact.bestDay === DAYS[0] ? "" : contact.bestDay,
      billing,
      term,
      springGutters,
      src,
    });
    setSending(false);
    if (result.success) {
      setSaved({ saved: result.saved, contactId: result.contactId });
      if (result.saved && result.contactId) go(4);
      else { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } else {
      setError(result.error || "Something went wrong. Give it another try, or call or text (503) 704-3755.");
    }
  };

  const chosen = ADD_ONS.filter((a) => addOns.includes(a.key));
  // What the customer pays under the billing they picked, as a short phrase.
  const termLine = term > 1 ? `, price locked for ${term} years` : "";
  const eff = price ? effectivePrice(price, springGutters) : null;
  const schedule = eff ? depositSchedule(eff, billing) : "";
  // Value stack rows: the four seasons carry the access charges so the rows
  // add up to the seasonal à la carte total, then windows and screens.
  const stack = useMemo(() => {
    if (!price) return null;
    const amt = (k: string) => price.lines.find((l) => l.key === k)?.amount ?? 0;
    const storyShare = amt("story-access") / 4;
    const season = (keys: string[]) => (keys.reduce((t, k) => t + amt(k), 0) + storyShare) * price.accessMultiplier;
    const rows: { label: string; sub?: string; value: number; free?: boolean }[] = [
      { label: "Spring roof and siding", value: season(["roof", "siding"]) },
      { label: "Summer driveway and walkways", value: season(["driveway"]) },
      { label: "Fall gutters and downspouts", value: season(["gutters"]) },
      { label: "Winter walkways and entry", value: season(["winter"]) },
      { label: `Windows, ${WINDOW_VISITS_PER_YEAR} visits`, sub: "exterior, every window", value: price.windowsAnnualValue, free: true },
      { label: `Screens, ${WINDOW_VISITS_PER_YEAR} visits`, sub: "you remove and reinstall", value: price.screensAnnualValue, free: true },
    ];
    const e = effectivePrice(price, springGutters);
    if (springGutters) rows.splice(3, 0, { label: "Spring gutters, second cleaning", value: e.upgradeValue });
    const baseYourPrice = billing === "annual" ? price.prepaidAnnual : price.memberAnnual;
    const yourPrice = billing === "annual" ? e.prepaid : e.annual;
    const total = price.valueReceived + (springGutters ? e.upgradeValue : 0);
    return { rows, total, yourPrice, save: Math.max(0, Math.round(price.valueReceived - baseYourPrice)), upgradeMonthly: e.upgradeMonthly };
  }, [price, billing, springGutters]);
  const priceLine = eff
    ? billing === "annual"
      ? `$${fmt(eff.prepaidMonthly)} a month on a 12-month membership, paid $${fmt(eff.prepaid)} up front${termLine}`
      : `$${fmt(eff.monthly)} a month on a 12-month membership, billed monthly${termLine}`
    : "";
  const savedLine = price && eff ? `You save $${fmt(price.savedVsAlaCarte + (billing === "annual" ? eff.prepaySaves : 0))} this year` : "";
  const suggested = useMemo(() => (house ? suggestedAddOns(house) : []), [house]);

  // Real availability for the next 14 days, fetched once the Reserve step opens.
  useEffect(() => {
    if (step !== 4 || slotsLoaded) return;
    // GHL caps a free-slots query at 31 days, so two windows cover ~60 days.
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    Promise.all([getFreeSlots(now, now + 31 * day), getFreeSlots(now + 31 * day, now + 62 * day)])
      .then(([a, b]) => setSlotMap({ ...a.days, ...b.days }))
      .catch(() => setSlotMap({}))
      .finally(() => setSlotsLoaded(true));
  }, [step, slotsLoaded]);

  const dayKeys = Object.keys(slotMap).filter((k) => slotMap[k].length > 0).sort();
  const monthsAhead = (calY - today.getFullYear()) * 12 + (calM - today.getMonth());
  const prevMonth = () => { if (calM === 0) { setCalY(calY - 1); setCalM(11); } else setCalM(calM - 1); setDayKey(""); setPickedISO(""); };
  const nextMonth = () => { if (calM === 11) { setCalY(calY + 1); setCalM(0); } else setCalM(calM + 1); setDayKey(""); setPickedISO(""); };

  const startDeposit = async () => {
    if (!saved?.contactId || !house) return;
    setDepositErr("");
    setDepositBusy(true);
    const r = await depositCheckout({ contactId: saved.contactId, address: house.address, name: contact.name, email: contact.email, phone: contact.phone });
    setDepositBusy(false);
    if (r.ok && r.url) setDepositUrl(r.url);
    else setDepositErr(r.error || "We couldn't open the deposit checkout just now.");
  };

  // After they pay inside the frame: look for the transaction, a few tries.
  const checkPaid = async () => {
    if (!saved?.contactId) return;
    setChecking(true);
    setCheckNote("");
    for (let i = 0; i < 3; i++) {
      const r = await confirmDeposit(saved.contactId);
      if (r.paid) { setDepositPaid(true); setChecking(false); return; }
      await new Promise((res) => setTimeout(res, 3000));
    }
    setChecking(false);
    setCheckNote("We don't see the payment yet. If you paid, give it a minute and tap again. If not, the checkout is still open above.");
  };

  const pickSlot = async (iso: string) => {
    if (!saved?.contactId) return;
    setBookErr("");
    setBooking(iso);
    const r = await bookFirstVisit({ contactId: saved.contactId, name: contact.name, startISO: iso });
    setBooking("");
    if (r.ok) setBookedISO(iso);
    else setBookErr(r.error || "That time didn't go through.");
  };

  const finish = () => { setDone(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="plan">
      <style dangerouslySetInnerHTML={{ __html: DS }} />

      <header className="plan-header">
        <a href="https://www.rinseitoff.com" style={{ display: "inline-block" }}>
          <img src="/logo-white.png" alt="Rinse It Off" style={{ height: 36, width: "auto" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </a>
        <a className="phone" href="tel:+15037043755">(503) 704-3755</a>
      </header>

      {done && price && house && saved ? (
        <div className="plan-wrap">
          <div className="plan-card done">
            <div className="mark">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2>{depositPaid ? "Your price is reserved." : "Almost there."}</h2>
            <div className="price-big" style={{ justifyContent: "center" }}>
              <span className="num">${fmt(billing === "annual" ? price.prepaidMonthlyEquivalent : price.memberMonthly)}</span>
              <span className="per">/mo</span>
            </div>
            <p style={{ marginBottom: 16 }}>{priceLine} for {house.address}. {schedule}. {savedLine}.</p>
            {!saved.saved ? (
              <p>Our system had trouble saving your details just now. Call or text us and we&apos;ll take the deposit by hand.</p>
            ) : depositPaid ? (
              <p>Next we&apos;ll text you the membership agreement and auto-pay setup, and that locks it in. The deposit receipt is on its way to {contact.email}.</p>
            ) : (
              <p>We&apos;ll text you to take the deposit and set your first visit.</p>
            )}
            {saved.saved && bookedISO && <p>Your first visit is booked for {slotDate(bookedISO)} at {slotTime(bookedISO)}. We&apos;ll text you a reminder the day before.</p>}
            {saved.saved && depositPaid && !bookedISO && <p>We&apos;ll text you within one business day to set your first visit.</p>}
            <div className="tel">
              <div className="k">Questions? Call or text</div>
              <a href="tel:+15037043755">(503) 704-3755</a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="plan-hero">
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <h1>
                Your monthly price, <span className="accent">custom to your house.</span>
              </h1>
              <p>Answer a few questions and we&apos;ll show you the price for a year of exterior care, windows included.</p>
            </div>
          </div>

          <div className="plan-wrap">
            <div className="plan-card">
              <div className="steps" aria-label={`Step ${step + 1} of 5`}>
                {STEP_NAMES.map((n, i) => (
                  <div key={n}>
                    <div className={`seg ${i === step ? "on" : i < step ? "past" : ""}`} />
                    <div className={`name ${i === step ? "on" : ""}`}>{n}</div>
                  </div>
                ))}
              </div>
              {step >= 2 && price && (
                <div className="strip">
                  You save ${fmt(price.savedVsAlaCarte)} this year<span>·</span>${fmt(price.windowsAnnualValue + price.screensAnnualValue)} of windows and screens free
                </div>
              )}

              {step === 0 && (
                <form onSubmit={(e) => { e.preventDefault(); if (house) go(1); }}>
                  <h2>First, the house.</h2>
                  <p className="lead">Rough numbers are fine.</p>

                  <div className="field">
                    <label htmlFor="street">Street address</label>
                    <input id="street" type="text" autoComplete="address-line1" placeholder="1234 SE Example St" value={street} onChange={(e) => setStreet(e.target.value)} required />
                    <div className="addr-row">
                      <input id="city" type="text" autoComplete="address-level2" placeholder="City" aria-label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                      <input id="state" type="text" autoComplete="address-level1" aria-label="State" value={stateCode} maxLength={2} onChange={(e) => setStateCode(e.target.value.toUpperCase())} />
                      <input id="zip" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="ZIP" aria-label="ZIP" value={zip} onChange={(e) => setZip(e.target.value.replace(/[^0-9-]/g, "").slice(0, 10))} />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="sqft">Living area</label>
                    <div className="unit-wrap">
                      <input id="sqft" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="1,800" value={sqft} onChange={(e) => setSqft(e.target.value.replace(/[^0-9]/g, ""))} required />
                      <span className="unit">sq ft</span>
                    </div>
                    <div className="help">A basic 3-bedroom is usually 1,500 to 2,000.</div>
                  </div>

                  <div className="field">
                    <div className="q">Stories</div>
                    <div className="choices cols-3" role="group" aria-label="Stories">
                      {([1, 2, 3] as Stories[]).map((s) => (
                        <button key={s} type="button" className={`choice center ${stories === s ? "on" : ""}`} onClick={() => setStories(s)} aria-pressed={stories === s}>
                          {s === 3 ? "3+" : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="windows">Exterior windows</label>
                    <input id="windows" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="14" value={windows} onChange={(e) => setWindows(e.target.value.replace(/[^0-9]/g, ""))} required />
                    <div className="help">Count what you can see from outside.</div>
                    <details className="more" {...moreProps("windows", ["largeWindows", "frenchWindows"])}>
                      <summary>Add details<span className="opt">· optional</span></summary>
                      <div className="row two">
                        <div><label htmlFor="largeWindows">Large or picture windows</label><input id="largeWindows" type="text" inputMode="numeric" value={exactText.largeWindows} onChange={(e) => setExact("largeWindows", e.target.value)} /></div>
                        <div><label htmlFor="frenchWindows">French or multi-pane</label><input id="frenchWindows" type="text" inputMode="numeric" value={exactText.frenchWindows} onChange={(e) => setExact("frenchWindows", e.target.value)} /></div>
                      </div>
                    </details>
                  </div>

                  <div className="field">
                    <div className="q">Roof</div>
                    <div className="choices" role="group" aria-label="Roof">
                      {([
                        ["composition", "Composition shingle"],
                        ["shake-steep", "Wood shake or steep pitch"],
                        ["metal-tile", "Metal or tile"],
                      ] as [RoofType, string][]).map(([v, l]) => (
                        <button key={v} type="button" className={`choice ${roof === v ? "on" : ""}`} onClick={() => setRoof(v)} aria-pressed={roof === v}>
                          <span className="box">{roof === v && <Check />}</span>{l}
                        </button>
                      ))}
                    </div>
                    <details className="more" {...moreProps("roof", ["roofSf"])}>
                      <summary>Enter roof size<span className="opt">· optional</span></summary>
                      <div className="row">
                        <div><label htmlFor="roofSf">Roof, sq ft</label><input id="roofSf" type="text" inputMode="numeric" value={exactText.roofSf} onChange={(e) => setExact("roofSf", e.target.value)} /></div>
                      </div>
                    </details>
                  </div>

                  <div className="field">
                    <div className="q">Driveway and walkways</div>
                    <div className="choices" role="group" aria-label="Driveway and walkways">
                      {([
                        ["small", "Small", "Under 800 sq ft"],
                        ["typical", "Typical", "Two cars wide, a path to the door"],
                        ["large", "Large or long", "Three cars, a long drive, lots of paths"],
                      ] as [DrivewaySize, string, string][]).map(([v, l, sub]) => (
                        <button key={v} type="button" className={`choice ${driveway === v ? "on" : ""}`} onClick={() => setDriveway(v)} aria-pressed={driveway === v}>
                          <span className="box">{driveway === v && <Check />}</span>
                          <span>{l}<span className="sub">{sub}</span></span>
                        </button>
                      ))}
                    </div>
                    <details className="more" {...moreProps("driveway", ["drivewaySf", "walkwaySf"])}>
                      <summary>Enter dimensions<span className="opt">· optional</span></summary>
                      <div className="row two">
                        <div><label htmlFor="drivewaySf">Driveway, sq ft</label><input id="drivewaySf" type="text" inputMode="numeric" value={exactText.drivewaySf} onChange={(e) => setExact("drivewaySf", e.target.value)} /></div>
                        <div><label htmlFor="walkwaySf">Walkways, sq ft</label><input id="walkwaySf" type="text" inputMode="numeric" value={exactText.walkwaySf} onChange={(e) => setExact("walkwaySf", e.target.value)} /></div>
                      </div>
                    </details>
                  </div>

                  <div className="field">
                    <div className="q">Gutters</div>
                    <details className="more" style={{ marginTop: 0 }} {...moreProps("gutters", ["gutterLf"])}>
                      <summary>Enter linear feet<span className="opt">· optional</span></summary>
                      <div className="row">
                        <div><label htmlFor="gutterLf">Gutters, linear ft</label><input id="gutterLf" type="text" inputMode="numeric" value={exactText.gutterLf} onChange={(e) => setExact("gutterLf", e.target.value)} /></div>
                      </div>
                    </details>
                  </div>

                  <div className="field">
                    <div className="q">Getting around the house</div>
                    <div className="choices" role="group" aria-label="Access">
                      {([
                        ["easy", "Easy", "We can walk all the way around"],
                        ["gated-tight", "Gated or tight side yards"],
                        ["steep-ladder", "Steep lot or hard ladder access"],
                      ] as [Access, string, string?][]).map(([v, l, sub]) => (
                        <button key={v} type="button" className={`choice ${access === v ? "on" : ""}`} onClick={() => setAccess(v)} aria-pressed={access === v}>
                          <span className="box">{access === v && <Check />}</span>
                          <span>{l}{sub && <span className="sub">{sub}</span>}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-ink" disabled={!house}>
                    Show my price
                  </button>
                  {!house && (
                    <p className="fine" style={{ textAlign: "center", marginTop: 10 }}>Street, city, square footage, stories and windows first.</p>
                  )}
                </form>
              )}

              {step === 1 && price && house && stack && (
                <div>
                  <p className="summary">
                    <strong>{house.addressParts ? `${house.addressParts.street}, ${house.addressParts.city}` : house.address}</strong> · {house.livingSqft.toLocaleString()} sq ft · {house.stories === 3 ? "3 stories" : house.stories === 2 ? "2 stories" : "1 story"} · {house.windows} windows · {house.roof === "shake-steep" ? "wood shake or steep" : house.roof === "metal-tile" ? "metal or tile" : "composition"} roof · {house.driveway === "large" ? "large" : house.driveway === "small" ? "small" : "typical"} driveway · {house.access === "gated-tight" ? "gated or tight" : house.access === "steep-ladder" ? "steep" : "easy"} access
                    {Object.keys(exact).length > 0 && (
                      <> · you gave: {[exact.roofSf && `roof ${exact.roofSf.toLocaleString()} sq ft`, exact.drivewaySf && `driveway ${exact.drivewaySf.toLocaleString()} sq ft`, exact.walkwaySf && `walkways ${exact.walkwaySf.toLocaleString()} sq ft`, exact.gutterLf && `gutters ${exact.gutterLf.toLocaleString()} ft`, exact.largeWindows && `${exact.largeWindows} large windows`, exact.frenchWindows && `${exact.frenchWindows} French windows`].filter(Boolean).join(", ")}</>
                    )}
                    {" "}<button type="button" className="linkish" onClick={() => go(0)}>Edit</button>
                  </p>

                  <div className="toggle" role="group" aria-label="Billing">
                    <button type="button" className={billing === "monthly" ? "on" : ""} onClick={() => setBilling("monthly")} aria-pressed={billing === "monthly"}>Monthly</button>
                    <button type="button" className={billing === "annual" ? "on" : ""} onClick={() => setBilling("annual")} aria-pressed={billing === "annual"}>Annual <span className="tag">save {PCT(PREPAID_UNDER_MONTHLY)}</span></button>
                  </div>

                  <div className="offer">
                    <div className="price-big">
                      <span className="num">${fmt(billing === "annual" ? eff!.prepaidMonthly : eff!.monthly)}</span>
                      <span className="per">/mo</span>
                    </div>
                    <p className="bill">{billing === "annual" ? <>${fmt(eff!.prepaid)} once a year. You save ${fmt(eff!.prepaySaves)} vs monthly.</> : <>Billed monthly. 12-month membership.</>}</p>
                    <p className="fine" style={{ marginBottom: 0 }}>This is your starting price. Our first visit confirms it, and unusual height or access can add to it.</p>
                  </div>

                  <div className="lock">
                    <span className="lock-label">Lock your price</span>
                    <div className="lock-choices" role="group" aria-label="Lock your price">
                      {TERM_OPTIONS.map((y) => (
                        <button key={y} type="button" className={term === y ? "on" : ""} onClick={() => setTerm(y)} aria-pressed={term === y}>{y} {y === 1 ? "year" : "years"}</button>
                      ))}
                    </div>
                  </div>
                  {billing === "annual" && term > 1 && (
                    <p className="term-note">Prepay the full term and save {PCT(MULTI_YEAR_PREPAID_DISCOUNT)} off booking each visit: ${fmt(prepaidTermTotal(price.coreAnnual, term))} for {term} years.</p>
                  )}

                  <div className="stack">
                    <h3>What you get</h3>
                    {stack.rows.map((r) => (
                      <div className="stack-row" key={r.label}>
                        <span className="l">
                          <span className="t">{r.label}{r.free && <span className="free">Free</span>}</span>
                          {r.sub && <span className="sub">{r.sub}</span>}
                        </span>
                        <span className={`a ${r.free ? "strike" : ""}`}>${fmt(r.value)}</span>
                      </div>
                    ))}
                    <div className="stack-total">
                      <div className="t"><span>Total value</span><span>${fmt(stack.total)}</span></div>
                      <div className="t yours">
                        <span>Your price</span>
                        <span className="pay">
                          <span className="amt">{billing === "annual" ? `$${fmt(eff!.prepaid)} a year` : `$${fmt(eff!.monthly)}/mo`}</span>
                          <span className="eq">{billing === "annual" ? `$${fmt(eff!.prepaidMonthly)}/mo equivalent` : `$${fmt(eff!.annual)} a year`}</span>
                        </span>
                      </div>
                    </div>
                    <div className="save-block">
                      <div className="k">You save</div>
                      <div className="v">${fmt(stack.save)}</div>
                      <div className="s">including ${fmt(price.windowsAnnualValue + price.screensAnnualValue)} of windows and screens, free</div>
                    </div>
                  </div>

                  <button type="button" className={`upgrade ${springGutters ? "on" : ""}`} onClick={() => setSpringGutters((v) => !v)} aria-pressed={springGutters}>
                    <span className="box">{springGutters && <Check />}</span>
                    <span className="body">
                      <span className="t">Add a second gutter cleaning in spring</span>
                      <span className="sub">Recommended in Oregon · done on the spring visit, no extra trip</span>
                    </span>
                    <span className="amt">+${fmt(stack.upgradeMonthly)}/mo</span>
                  </button>

                  <div className="scarcity">
                    We take {MEMBERSHIPS_PER_YEAR} new memberships a year in the Portland metro. Every one is four visits we have to keep, so once your neighborhood&apos;s route fills, it&apos;s full until next year.
                  </div>
                  <p className="guarantee">Before-and-after photos every visit. Anything not right, we re-rinse it free within 48 hours.</p>

                  <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
                    <button type="button" className="btn btn-ink" onClick={() => go(2)}>{billing === "annual" ? "Claim the annual price" : `Claim $${fmt(eff!.monthly)}/mo`}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => go(0)}>Change something about the house</button>
                  </div>
                </div>
              )}

              {step === 2 && price && (
                <div>
                  <h2>Anything else while we&apos;re there?</h2>
                  <p className="lead">Pick anything you&apos;d like priced in your estimate. Members save 10% on add-ons.</p>

                  {ADD_ON_GROUPS.map((g) => (
                    <div key={g} className="addon-group">
                      <div className="grp">{g}</div>
                      <div className="checklist" role="group" aria-label={g}>
                        {ADD_ONS.filter((a) => a.group === g).map((a) => {
                          const on = addOns.includes(a.key);
                          const pop = suggested.includes(a.key);
                          const ans = answers[a.key] || {};
                          return (
                            <div key={a.key} className={`item ${on ? "on" : ""}`}>
                              <button type="button" className={`row ${on ? "on" : ""}`} onClick={() => toggleAddOn(a.key)} aria-pressed={on}>
                                <span className="box">{on && <Check />}</span>
                                <span className="name">{a.label}</span>
                                {pop && <span className="pop">Popular</span>}
                              </button>
                              {on && (a.ask || a.note) && (
                                <div className="ask">
                                  {a.note && !a.ask && <span className="muted">{a.note}</span>}
                                  {a.ask?.kind === "surfaces-sqft" && (
                                    <div className="surfaces">
                                      {(["walkways", "walls"] as const).map((sf) => { const sel = (ans.surfaces || []).includes(sf); return (
                                        <button key={sf} type="button" className={`mini ${sel ? "on" : ""}`} aria-pressed={sel} onClick={() => setAnswer(a.key, { surfaces: sel ? (ans.surfaces || []).filter((x) => x !== sf) : [...(ans.surfaces || []), sf] })}>{sf === "walkways" ? "Walkways" : "Walls"}</button>
                                      ); })}
                                    </div>
                                  )}
                                  {a.ask && (
                                    <div className="ask-row">
                                      <label htmlFor={`ask-${a.key}`}>{a.ask.label}</label>
                                      <input id={`ask-${a.key}`} type="text" inputMode="numeric" value={ans.notSure ? "" : ans.qty ? String(ans.qty) : ""} disabled={!!ans.notSure} onChange={(e) => setAnswer(a.key, { qty: parseInt(e.target.value.replace(/[^0-9]/g, "").slice(0, 7), 10) || undefined })} />
                                      <button type="button" className={`mini ${ans.notSure ? "on" : ""}`} aria-pressed={!!ans.notSure} onClick={() => setAnswer(a.key, { notSure: !ans.notSure, qty: undefined })}>Not sure</button>
                                    </div>
                                  )}
                                  {a.ask && a.note && <span className="muted">{a.note}</span>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {chosen.length > 0 && <p className="fine" style={{ marginTop: 4 }}>We&apos;ll price these in your estimate.</p>}

                  <div style={{ display: "grid", gap: 8, marginTop: 24 }}>
                    <button type="button" className="btn btn-ink" onClick={() => go(3)}>{addOns.length ? "Next, claim my price" : "Skip this, claim my price"}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => go(1)}>Back to my price</button>
                  </div>
                </div>
              )}

              {step === 3 && price && house && (
                <form onSubmit={handleSubmit}>
                  <h2>Reserve your price.</h2>
                  <p className="lead">Tell us who you are and we&apos;ll reserve {priceLine} for {house.address}{chosen.length ? `, plus ${chosen.length} add-on${chosen.length === 1 ? "" : "s"}` : ""}. {schedule}. {savedLine}.</p>

                  <input type="hidden" name="src" value={src} readOnly />

                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" type="text" autoComplete="name" placeholder="Jane Smith" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(503) 555-0100" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
                    <div className="help">We text to set up visits, so a mobile number is best.</div>
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="jane@example.com" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label htmlFor="bestDay">Best day of the week for visits (optional)</label>
                    <select id="bestDay" value={contact.bestDay} onChange={(e) => setContact({ ...contact, bestDay: e.target.value })}>
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {error && <div className="error">{error}</div>}

                  <p className="fine" style={{ marginBottom: 12 }}>This is your starting price. Our first visit confirms it, and unusual height or access can add to it.</p>
                  <button type="submit" className="btn btn-ink" disabled={sending || !contact.name || !contact.phone || !contact.email}>
                    {sending ? "Reserving it" : "Reserve this price"}
                  </button>
                  <p className="consent">
                    By submitting, you agree to receive calls and texts about your quote and visits from Rinse It Off. Msg &amp; data rates may apply, frequency varies. Reply STOP to opt out, HELP for help. See our{" "}
                    <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.
                  </p>
                  <button type="button" className="btn btn-ghost" onClick={() => go(2)} style={{ marginTop: 4 }}>Back</button>
                </form>
              )}

              {step === 4 && price && house && saved && (
                <div>
                  <h2>Reserve your price.</h2>
                  <p className="lead">${fmt(billing === "annual" ? eff!.prepaidMonthly : eff!.monthly)} a month on a 12-month membership for {house.addressParts ? `${house.addressParts.street}, ${house.addressParts.city}` : house.address}.</p>

                  <div className="reserve">
                    <h3>Reserve your price</h3>
                    {depositPaid ? (
                      <div className="ok">Your price is reserved. Next we&apos;ll text you the membership agreement and auto-pay setup, and that locks it in.</div>
                    ) : depositUrl ? (
                      <>
                        <iframe className="checkout" src={depositUrl} title="Pay the deposit" allow="payment" />
                        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                          <button type="button" className="btn btn-ink" onClick={checkPaid} disabled={checking}>{checking ? "Checking" : "I paid"}</button>
                          <a className="btn btn-ghost" href={depositUrl} target="_blank" rel="noopener noreferrer">Checkout not loading? Open it in a new tab</a>
                        </div>
                        {checkNote && <p className="fine" style={{ marginTop: 10, marginBottom: 0 }}>{checkNote}</p>}
                      </>
                    ) : dryRun ? (
                      <>
                        <p>{schedule}.</p>
                        <button type="button" className="btn btn-ink" disabled>Deposit checkout is off on this preview</button>
                        <p className="fine" style={{ marginTop: 10, marginBottom: 0 }}>Internal review build: no card is taken and nothing is written to the contact. Use &ldquo;Dev only: simulate paid&rdquo; to see the rest of the step.</p>
                      </>
                    ) : (
                      <>
                        <p>{schedule}.</p>
                        <button type="button" className="btn btn-ink" onClick={startDeposit} disabled={depositBusy}>
                          {depositBusy ? "Setting it up" : `Reserve your price with a $${DEPOSIT_USD} deposit`}
                        </button>
                        <p className="fine" style={{ marginTop: 10, marginBottom: 0 }}>The deposit reserves your price and comes off your membership total.</p>
                      </>
                    )}
                    {depositErr && <div className="error" style={{ marginTop: 12, marginBottom: 0 }}>{depositErr}</div>}
                    {dryRun && !depositPaid && (
                      <button type="button" className="btn btn-ghost dev" onClick={() => setDepositPaid(true)}>Dev only: simulate paid</button>
                    )}
                  </div>

                  <div className={`reserve ${depositPaid ? "" : "gated"}`}>
                    <h3>Pick your first visit (optional)</h3>
                    {!depositPaid ? (
                      <p style={{ marginBottom: 0 }}>Pay the ${DEPOSIT_USD} deposit to pick your first visit.</p>
                    ) : bookedISO ? (
                      <div className="ok">Booked: {slotDate(bookedISO)} at {slotTime(bookedISO)}.</div>
                    ) : !slotsLoaded ? (
                      <p style={{ marginBottom: 0 }}>Checking the calendar.</p>
                    ) : dayKeys.length === 0 ? (
                      <p style={{ marginBottom: 0 }}>Nothing open in the next two months. We&apos;ll text you with the first opening.</p>
                    ) : (
                      <>
                        <div className="cal">
                          <div className="cal-head">
                            <button type="button" onClick={prevMonth} disabled={calY === today.getFullYear() && calM === today.getMonth()} aria-label="Previous month">‹</button>
                            <span>{MONTHS[calM]} {calY}</span>
                            <button type="button" onClick={nextMonth} disabled={monthsAhead >= 2} aria-label="Next month">›</button>
                          </div>
                          <div className="cal-dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
                          <div className="cal-grid">
                            {calDays(calY, calM).map((d, i) => {
                              if (d === null) return <span key={"e" + i} />;
                              const key = dateKey(calY, calM, d);
                              const open = (slotMap[key]?.length ?? 0) > 0;
                              const sel = dayKey === key;
                              return (
                                <button key={key} type="button" className={`cal-day ${open ? "open" : ""} ${sel ? "sel" : ""}`} disabled={!open} onClick={() => { setDayKey(key); setPickedISO(""); }} aria-pressed={sel}>{d}</button>
                              );
                            })}
                          </div>
                        </div>
                        {dayKey && (
                          <div className="times">
                            {(slotMap[dayKey] || []).map((iso) => (
                              <button key={iso} type="button" className={`time ${pickedISO === iso ? "on" : ""}`} onClick={() => setPickedISO(iso)} aria-pressed={pickedISO === iso}>{slotTime(iso)}</button>
                            ))}
                          </div>
                        )}
                        {pickedISO && (
                          <div style={{ marginTop: 12 }}>
                            <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--ink)", fontWeight: 500 }}>{slotDate(pickedISO)} at {slotTime(pickedISO)}</strong></p>
                            <button type="button" className="btn btn-ink" onClick={() => pickSlot(pickedISO)} disabled={!!booking}>{booking ? "Booking" : "Confirm this visit"}</button>
                          </div>
                        )}
                        {bookErr && <div className="error" style={{ marginTop: 12, marginBottom: 0 }}>{bookErr}</div>}
                      </>
                    )}
                  </div>

                  <button type="button" className={`btn ${depositPaid ? "btn-ink" : "btn-ghost"}`} onClick={finish}>
                    {depositPaid ? "All set" : "Text me instead"}
                  </button>
                  {!depositPaid && <p className="fine" style={{ textAlign: "center", marginTop: 8 }}>We&apos;ll text you to take the deposit and set your first visit.</p>}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
