import { useState } from “react”;

const BUSINESS_TYPES = [
{ id: “str”, label: “Airbnb / Short-Term Rental”, icon: “🏠” },
{ id: “venue”, label: “Event Venues”, icon: “🎪” },
{ id: “hotel”, label: “Boutique Hotel”, icon: “🏨” },
{ id: “photo”, label: “Photographer / Videographer”, icon: “📷” },
];

const LOCAL_EVENTS_QUESTIONS = [
{
id: “events_awareness”,
label: “Are you actively monitoring local events concerts, festivals, conventions, sports and adjusting your pricing around them?”,
type: “select”,
options: [
“No I don’t track local events at all”,
“I’m aware of them but don’t adjust pricing”,
“I adjust for major events occasionally”,
“Yes I have a system for tracking and pricing around events”,
],
},
{
id: “events_onetime”,
label: “Have you ever had a revenue spike from a one-time local event a special concert, a Super Bowl, a one-off convention that you may have assumed would repeat?”,
type: “select”,
options: [
“No spike I’m aware of”,
“Yes and I assumed that revenue would repeat the following year”,
“Yes and I knew it was one-time and planned accordingly”,
“Not sure I don’t track revenue by date closely enough to know”,
],
},
{
id: “events_calendar”,
label: “Do you maintain a forward-looking demand calendar mapping events 6–12 months out to anticipate pricing opportunities before they arrive?”,
type: “select”,
options: [
“No forward planning at all”,
“I check occasionally but nothing systematic”,
“I have a rough calendar I reference”,
“Yes I actively manage a 12-month demand calendar”,
],
},
];

const QUESTIONS = {
str: [
{ id: “rooms”, label: “How many rental properties do you manage?”, type: “select”, options: [“1”, “2–3”, “4–6”, “7+”] },
{ id: “rate”, label: “What is your average nightly rate?”, type: “select”, options: [“Under $75”, “$75–$125”, “$126–$200”, “$201–$350”, “$350+”] },
{ id: “occupancy”, label: “What is your average monthly occupancy?”, type: “select”, options: [“Under 40%”, “40–55%”, “56–70%”, “71–85%”, “85%+”] },
{ id: “pricing”, label: “How do you currently set your nightly rates?”, type: “select”, options: [“Same rate year-round”, “Airbnb Smart Pricing only”, “I adjust manually sometimes”, “I use a dynamic pricing tool”] },
{ id: “seasons”, label: “Do you charge more during peak seasons or local events?”, type: “select”, options: [“No, same rate always”, “Occasionally”, “Yes, for major holidays only”, “Yes, consistently”] },
{ id: “lastchange”, label: “When did you last review your pricing strategy?”, type: “select”, options: [“Never”, “Over a year ago”, “6–12 months ago”, “Within the last 6 months”] },
…LOCAL_EVENTS_QUESTIONS,
],
venue: [
{ id: “capacity”, label: “What is your venue’s max capacity?”, type: “select”, options: [“Under 50 guests”, “50–100 guests”, “101–200 guests”, “201–500 guests”, “500+ guests”] },
{ id: “rate”, label: “What is your average booking rate per event?”, type: “select”, options: [“Under $1,000”, “$1,000–$2,500”, “$2,500–$5,000”, “$5,000–$10,000”, “$10,000+”] },
{ id: “occupancy”, label: “What percentage of your available dates are booked monthly?”, type: “select”, options: [“Under 30%”, “30–50%”, “51–65%”, “66–80%”, “80%+”] },
{ id: “pricing”, label: “How do you structure your pricing?”, type: “select”, options: [“One flat rate for everything”, “Weekday vs. weekend rates”, “Seasonal pricing tiers”, “Fully dynamic by demand”] },
{ id: “seasons”, label: “Do you adjust pricing for peak wedding/event season?”, type: “select”, options: [“No adjustment”, “Minor adjustments”, “Moderate seasonal tiers”, “Aggressive peak pricing”] },
{ id: “lastchange”, label: “When did you last update your pricing structure?”, type: “select”, options: [“Never”, “Over a year ago”, “6–12 months ago”, “Within the last 6 months”] },
…LOCAL_EVENTS_QUESTIONS,
],
hotel: [
{ id: “rooms”, label: “How many rooms does your property have?”, type: “select”, options: [“Under 20”, “20–40”, “41–80”, “81–150”, “150+”] },
{ id: “rate”, label: “What is your average daily rate (ADR)?”, type: “select”, options: [“Under $80”, “$80–$120”, “$121–$180”, “$181–$250”, “$250+”] },
{ id: “occupancy”, label: “What is your average occupancy rate?”, type: “select”, options: [“Under 45%”, “45–60%”, “61–72%”, “73–84%”, “85%+”] },
{ id: “pricing”, label: “How do you manage your room rates?”, type: “select”, options: [“Static rates year-round”, “Manual seasonal adjustments”, “OTA-driven pricing”, “Dedicated RM strategy”] },
{ id: “revpar”, label: “Are you actively tracking RevPAR month over month?”, type: “select”, options: [“Not tracking”, “Tracking but not acting on it”, “Tracking and adjusting occasionally”, “Tracking and optimizing regularly”] },
{ id: “lastchange”, label: “When did you last conduct a full pricing audit?”, type: “select”, options: [“Never”, “Over a year ago”, “6–12 months ago”, “Within the last 6 months”] },
…LOCAL_EVENTS_QUESTIONS,
],
photo: [
{ id: “sessions”, label: “How many paid sessions do you average per month?”, type: “select”, options: [“1–3”, “4–6”, “7–10”, “11–15”, “16+”] },
{ id: “rate”, label: “What is your base session rate?”, type: “select”, options: [“Under $150”, “$150–$300”, “$301–$500”, “$501–$800”, “$800+”] },
{ id: “pricing”, label: “How do you currently set your session prices?”, type: “select”, options: [“Same flat rate year-round”, “I raise prices occasionally when busy”, “I have weekday vs. weekend rates”, “I use seasonal and demand-based pricing”] },
{ id: “packages”, label: “Do you offer tiered packages mini, standard, premium?”, type: “select”, options: [“No one offering only”, “Two tiers”, “Three or more tiers”, “Three+ tiers with add-ons and upsells”] },
{ id: “slowseason”, label: “What do you do during your slow season (typically Jan–Mar)?”, type: “select”, options: [“Nothing I just wait for bookings”, “Lower prices across the board”, “Run targeted mini-session promotions”, “Use strategic off-peak pricing to fill the calendar”] },
{ id: “lastchange”, label: “When did you last update your pricing?”, type: “select”, options: [“Never”, “Over a year ago”, “6–12 months ago”, “Within the last 6 months”] },
…LOCAL_EVENTS_QUESTIONS,
],
};

const scoreAnswer = (questionId, answer) => {
const low = {
pricing: [“Same rate year-round”, “Same flat rate year-round”, “One flat rate for everything”, “Static rates year-round”, “Airbnb Smart Pricing only”],
seasons: [“No, same rate always”, “No adjustment”],
lastchange: [“Never”, “Over a year ago”],
occupancy: [“Under 40%”, “Under 30%”, “Under 45%”],
revpar: [“Not tracking”],
slowseason: [“Nothing I just wait for bookings”, “Lower prices across the board”],
packages: [“No one offering only”],
events_awareness: [“No I don’t track local events at all”, “I’m aware of them but don’t adjust pricing”],
events_onetime: [“Yes and I assumed that revenue would repeat the following year”, “Not sure I don’t track revenue by date closely enough to know”],
events_calendar: [“No forward planning at all”, “I check occasionally but nothing systematic”],
};
const high = {
pricing: [“I use a dynamic pricing tool”, “Fully dynamic by demand”, “Dedicated RM strategy”, “I use seasonal and demand-based pricing”],
seasons: [“Yes, consistently”, “Aggressive peak pricing”],
lastchange: [“Within the last 6 months”],
occupancy: [“85%+”, “80%+”],
revpar: [“Tracking and optimizing regularly”],
slowseason: [“Use strategic off-peak pricing to fill the calendar”],
packages: [“Three or more tiers”, “Three+ tiers with add-ons and upsells”],
events_awareness: [“Yes I have a system for tracking and pricing around events”],
events_onetime: [“Yes and I knew it was one-time and planned accordingly”],
events_calendar: [“Yes I actively manage a 12-month demand calendar”],
};
if (low[questionId]?.includes(answer)) return 1;
if (high[questionId]?.includes(answer)) return 4;
return 2;
};

const getLeakage = (answers, bType) => {
const rateMap = {
str: { “Under $75”: 65, “$75–$125”: 100, “$126–$200”: 160, “$201–$350”: 275, “$350+”: 400 },
venue: { “Under $1,000”: 700, “$1,000–$2,500”: 1750, “$2,500–$5,000”: 3750, “$5,000–$10,000”: 7500, “$10,000+”: 12000 },
hotel: { “Under $80”: 65, “$80–$120”: 100, “$121–$180”: 150, “$181–$250”: 215, “$250+”: 300 },
photo: { “Under $150”: 120, “$150–$300”: 225, “$301–$500”: 400, “$501–$800”: 650, “$800+”: 1000 },
};
const sessionsMap = { “1–3”: 2, “4–6”: 5, “7–10”: 8, “11–15”: 13, “16+”: 18 };
const occMap = {
str: { “Under 40%”: 0.35, “40–55%”: 0.47, “56–70%”: 0.63, “71–85%”: 0.78, “85%+”: 0.90 },
venue: { “Under 30%”: 0.22, “30–50%”: 0.40, “51–65%”: 0.58, “66–80%”: 0.73, “80%+”: 0.85 },
hotel: { “Under 45%”: 0.38, “45–60%”: 0.52, “61–72%”: 0.66, “73–84%”: 0.78, “85%+”: 0.90 },
};
const rate = rateMap[bType]?.[answers.rate] || 150;
const isStatic = answers.pricing?.includes(“flat”) || answers.pricing?.includes(“Same”) || answers.pricing?.includes(“Static”) || answers.pricing?.includes(“year-round”);
const rateUplift = isStatic ? 0.22 : 0.10;
const eventPenalty = answers.events_onetime?.includes(“assumed”) ? 0.08 : 0;
const noEvents = answers.events_awareness?.includes(“No”) || answers.events_awareness?.includes(“aware”);
const eventLoss = noEvents ? 0.12 : 0.04;

if (bType === “photo”) {
const sessions = sessionsMap[answers.sessions] || 5;
const current = rate * sessions * 12;
const pkgUplift = answers.packages?.includes(“one offering”) ? 0.25 : answers.packages?.includes(“Two”) ? 0.15 : 0.08;
const slowLoss = answers.slowseason?.includes(“Nothing”) ? 0.18 : answers.slowseason?.includes(“Lower”) ? 0.10 : 0.04;
return Math.round((current * (rateUplift + pkgUplift + slowLoss + eventLoss - eventPenalty)) / 500) * 500;
}
const occ = occMap[bType]?.[answers.occupancy] || 0.55;
const targetOcc = bType === “venue” ? 0.75 : 0.82;
const occGap = Math.max(0, targetOcc - occ);
const totalUplift = rateUplift + eventLoss;
let leak;
if (bType === “str”) {
leak = (rate * (1 + totalUplift) * (occ + occGap) * 365 - rate * occ * 365) * (1 + eventPenalty);
} else if (bType === “venue”) {
leak = (rate * (1 + totalUplift) * (occ + occGap) * 144 - rate * occ * 144) * (1 + eventPenalty);
} else {
const rooms = answers.rooms === “Under 20” ? 15 : answers.rooms === “20–40” ? 30 : answers.rooms === “41–80” ? 60 : 100;
leak = ((rate * (1 + totalUplift) * (occ + occGap)) - (rate * occ)) * rooms * 365 * (1 + eventPenalty);
}
return Math.round(leak / 1000) * 1000;
};

const getScoreLabel = (s) => {
if (s <= 30) return { label: “Critical”, color: “#ef4444”, bg: “#fdf0f0”, desc: “Your revenue strategy has significant gaps. You’re likely leaving 25–40% of potential revenue uncaptured every year.” };
if (s <= 55) return { label: “Developing”, color: “#f97316”, bg: “#fdf4ee”, desc: “You have some pricing awareness but no systematic strategy. Structured RM could move you 15–25% higher.” };
if (s <= 75) return { label: “Functional”, color: “#eab308”, bg: “#f5f0d8”, desc: “You’re doing better than most, but there are clear gaps in your peak and off-peak strategy.” };
return { label: “Optimized”, color: “#22c55e”, bg: “#f0fdf4”, desc: “Strong foundation. Fine-tuning your channel mix and demand forecasting could push you to the next tier.” };
};

const getRecs = (answers, bType) => {
const recs = [];
const isStatic = answers.pricing?.includes(“flat”) || answers.pricing?.includes(“Same”) || answers.pricing?.includes(“Static”) || answers.pricing?.includes(“year-round”);
if (isStatic) recs.push({ text: bType === “photo” ? “Move away from a single flat rate. A three-tier package structure mini, standard, premium with seasonal pricing is the fastest way to increase annual revenue without booking more clients.” : “Implement a three-tier rate structure: base, peak, and off-peak. Static pricing is the single biggest revenue leak for your business type.”, event: false });
if (bType === “photo” && (answers.packages?.includes(“one offering”) || answers.packages?.includes(“Two”))) recs.push({ text: “Build at least three distinct packages with clear value differentiation. Your highest-tier package should be priced so that even 2 bookings per month makes a material impact on your annual revenue.”, event: false });
if (bType === “photo” && (answers.slowseason?.includes(“Nothing”) || answers.slowseason?.includes(“Lower”))) recs.push({ text: “Stop discounting across the board in slow season it trains clients to wait for deals. Instead, run limited mini-session events in January and February to generate volume without touching your standard rate card.”, event: false });
if (answers.seasons?.includes(“No”) || answers.seasons?.includes(“Never”)) recs.push({ text: “Build a demand calendar. Identify your top 10 highest-demand dates and set rate floors 30–50% above your base rate for those windows.”, event: false });
if (answers.lastchange?.includes(“Never”) || answers.lastchange?.includes(“year”)) recs.push({ text: “Your pricing hasn’t kept pace with the market. Inflation alone justifies a 10–15% increase but more importantly, your competitive positioning may have shifted entirely since your last review.”, event: false });
if (bType === “hotel” && answers.revpar?.includes(“Not tracking”)) recs.push({ text: “Start tracking RevPAR weekly. You cannot optimize what you don’t measure RevPAR is the single most important metric for your property’s revenue health.”, event: false });
if (bType === “str” && answers.pricing?.includes(“Smart Pricing”)) recs.push({ text: “Airbnb Smart Pricing optimizes for Airbnb’s booking volume, not your profit. Add manual rate floors for your top 20 demand dates and override Smart Pricing entirely during local events.”, event: false });
// Event recs
if (answers.events_awareness?.includes(“No”) || answers.events_awareness?.includes(“aware”)) recs.push({ text: “You’re missing event-driven demand spikes. Set up a Google Calendar with local events 12 months out concerts, festivals, conventions, sports. Any event drawing 5,000+ people within 10 miles is a pricing opportunity you should act on weeks in advance.”, event: true });
if (answers.events_onetime?.includes(“assumed”)) recs.push({ text: “⚠️ Forecast risk: You had a one-time event spike and may have built that into your baseline. That revenue won’t repeat. Remove that period from your normal year-over-year comparison otherwise you’re pricing against demand that no longer exists.”, event: true });
if (answers.events_onetime?.includes(“Not sure”)) recs.push({ text: “You don’t have enough visibility into what’s driving your revenue peaks. Start tagging bookings by what was happening locally that week you’ll find patterns that completely change how you price.”, event: true });
if (answers.events_calendar?.includes(“No forward”) || answers.events_calendar?.includes(“occasionally”)) recs.push({ text: “Build a 12-month demand calendar now. Forward visibility is the foundation of every RM strategy without it you’re always reacting to demand instead of pricing ahead of it.”, event: true });
return recs.slice(0, 5);
};

export default function PeakrateApp() {
const [step, setStep] = useState(“landing”);
const [bType, setBType] = useState(null);
const [currentQ, setCurrentQ] = useState(0);
const [answers, setAnswers] = useState({});
const [score, setScore] = useState(0);
const [leakage, setLeakage] = useState(0);
const [contact, setContact] = useState({ name: “”, email: “”, phone: “” });
const [reportDone, setReportDone] = useState(false);
const [consultDone, setConsultDone] = useState(false);
const [aiInsight, setAiInsight] = useState(””);
const [loadingAI, setLoadingAI] = useState(false);
const [anim, setAnim] = useState(true);
const [hovBiz, setHovBiz] = useState(null);
const [hovOpt, setHovOpt] = useState(null);
const [hovBTS, setHovBTS] = useState(false);

const questions = bType ? QUESTIONS[bType] : [];
const baseQCount = questions.length - LOCAL_EVENTS_QUESTIONS.length;
const isEventQ = currentQ >= baseQCount && questions.length > 0;

const go = (fn) => { setAnim(false); setTimeout(() => { fn(); setAnim(true); }, 220); };

const selectBiz = (type) => go(() => { setBType(type); setStep(“questions”); setCurrentQ(0); setAnswers({}); });

const answer = (qId, val) => {
const next = { …answers, [qId]: val };
setAnswers(next);
if (currentQ < questions.length - 1) {
go(() => setCurrentQ(currentQ + 1));
} else {
const total = questions.reduce((a, q) => a + scoreAnswer(q.id, next[q.id] || “”), 0);
const pct = Math.round((total / (questions.length * 4)) * 100);
const leak = getLeakage(next, bType);
setScore(pct); setLeakage(leak);
fetchAI(next, bType, pct, leak);
go(() => setStep(“results”));
}
};

const fetchAI = async (ans, bt, pct, leak) => {
setLoadingAI(true);
const label = { str: “Airbnb/short-term rental”, venue: “event venue”, hotel: “boutique hotel”, photo: “photographer or videographer” }[bt];
const summary = Object.entries(ans).map(([k, v]) => `${k}: ${v}`).join(”, “);
const anomaly = ans.events_onetime?.includes(“assumed”) ? “ IMPORTANT: Flag the one-time event revenue anomaly risk specifically they assumed a spike would repeat and it likely won’t.” : “”;
const prompt = `You are Dom Smith, a revenue management consultant with 7 years at a major U.S. airline. A ${label} owner just completed a revenue audit. Score: ${pct}/100. Estimated annual revenue gap: $${leak.toLocaleString()}. Their answers: ${summary}.${anomaly} Write 2–3 sharp, direct sentences. Lead with their single biggest revenue leak. End with one specific action they can take this week. Sound like a straight-talking consultant, not a chatbot. No preamble, no lists.`;
try {
const res = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ model: “claude-sonnet-4-20250514”, max_tokens: 1000, messages: [{ role: “user”, content: prompt }] }),
});
const data = await res.json();
setAiInsight(data.content?.find(b => b.type === “text”)?.text || “”);
} catch { setAiInsight(””); }
setLoadingAI(false);
};

const reset = () => go(() => { setStep(“landing”); setBType(null); setAnswers({}); setScore(0); setLeakage(0); setReportDone(false); setConsultDone(false); setAiInsight(””); setCurrentQ(0); });

const si = getScoreLabel(score);
const recs = bType ? getRecs(answers, bType) : [];
const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;
const typeLabel = { str: “Airbnb / STR”, venue: “Event Venue”, hotel: “Boutique Hotel”, photo: “Photographer / Videographer” }[bType] || “”;

const c = {
wrap: { minHeight: “100vh”, background: “#faf7f2”, color: “#1a1410”, fontFamily: “‘Georgia’,‘Times New Roman’,serif”, display: “flex”, flexDirection: “column”, alignItems: “center”, padding: “0 20px 80px” },
hdr: { width: “100%”, maxWidth: 660, padding: “32px 0 0”, display: “flex”, alignItems: “center”, justifyContent: “space-between” },
logo: { fontSize: 13, letterSpacing: “0.3em”, color: “#b8922e”, textTransform: “uppercase” },
card: { width: “100%”, maxWidth: 660, marginTop: 44, opacity: anim ? 1 : 0, transform: anim ? “translateY(0)” : “translateY(10px)”, transition: “opacity 0.22s ease, transform 0.22s ease” },
lbl: { fontSize: 11, color: “#b8922e”, letterSpacing: “0.2em”, textTransform: “uppercase”, marginBottom: 10 },
h1: { fontSize: 36, fontWeight: 400, lineHeight: 1.2, color: “#1a1410”, marginBottom: 14, letterSpacing: “-0.02em” },
sub: { fontSize: 15, color: “#6a5e4e”, lineHeight: 1.75, marginBottom: 36, maxWidth: 500 },
gold: { width: 44, height: 2, background: “#b8922e”, marginBottom: 30 },
bizBtn: (id) => ({ width: “100%”, background: hovBiz === id ? “#e8e2d4” : “#f5f0e8”, border: `1px solid ${hovBiz === id ? "#b8922e" : "#d8d0be"}`, borderRadius: 3, padding: “18px 22px”, display: “flex”, alignItems: “center”, gap: 14, cursor: “pointer”, marginBottom: 10, transition: “all 0.18s”, textAlign: “left” }),
optBtn: (o) => ({ width: “100%”, background: hovOpt === o ? “#e8e2d4” : “#f5f0e8”, border: `1px solid ${hovOpt === o ? "#b8922e" : "#d8d0be"}`, borderRadius: 3, padding: “13px 18px”, color: hovOpt === o ? “#1a1410” : “#5a4e40”, fontSize: 14, cursor: “pointer”, marginBottom: 9, textAlign: “left”, fontFamily: “Georgia,serif”, transition: “all 0.15s” }),
prog: { width: “100%”, height: 2, background: “#ddd6c4”, borderRadius: 1, marginBottom: 38, overflow: “hidden” },
progFill: { height: “100%”, background: “#b8922e”, width: `${progress}%`, transition: “width 0.3s ease”, borderRadius: 1 },
circle: { width: 110, height: 110, borderRadius: “50%”, background: si?.bg, border: `3px solid ${si?.color}`, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, flexShrink: 0 },
leakBox: { background: “#f0ebe0”, border: “1px solid #232018”, borderLeft: “3px solid #c8a84b”, padding: “20px 24px”, borderRadius: 2, marginBottom: 22 },
aiBox: { background: “#f0ebe0”, border: “1px solid #232018”, padding: “18px 22px”, borderRadius: 2, marginBottom: 22, position: “relative” },
recItem: (ev) => ({ background: ev ? “#ede8dc” : “#f0ebe0”, border: `1px solid ${ev ? "#c8d8b8" : "#ddd6c6"}`, padding: “15px 18px”, borderRadius: 2, marginBottom: 8, display: “flex”, gap: 12, alignItems: “flex-start” }),
inp: { width: “100%”, background: “#f0ebe0”, border: “1px solid #232018”, borderRadius: 2, padding: “12px 14px”, color: “#3a2e24”, fontSize: 14, fontFamily: “Georgia,serif”, outline: “none”, boxSizing: “border-box”, marginBottom: 10 },
pBtn: { background: “#b8922e”, color: “#faf7f2”, border: “none”, borderRadius: 2, padding: “14px 28px”, fontSize: 13, letterSpacing: “0.1em”, textTransform: “uppercase”, cursor: “pointer”, fontFamily: “Georgia,serif”, fontWeight: 700, width: “100%”, marginBottom: 9 },
sBtn: { background: “transparent”, color: “#b8922e”, border: “1px solid #c8a84b”, borderRadius: 2, padding: “13px 28px”, fontSize: 13, letterSpacing: “0.1em”, textTransform: “uppercase”, cursor: “pointer”, fontFamily: “Georgia,serif”, width: “100%”, marginBottom: 9 },
div: { width: “100%”, height: 1, background: “#ddd6c4”, margin: “26px 0” },
back: { background: “none”, border: “none”, color: “#9a8e7e”, fontSize: 12, cursor: “pointer”, letterSpacing: “0.1em”, textTransform: “uppercase”, fontFamily: “Georgia,serif”, padding: 0 },
ok: { background: “#f0fdf4”, border: “1px solid #22c55e”, borderRadius: 2, padding: “16px 20px”, marginTop: 8, fontSize: 13, color: “#166534”, lineHeight: 1.65 },
};

return (
<div style={c.wrap}>
<div style={c.hdr}>
<div style={c.logo} onClick={() => go(() => setStep(“landing”))} >Peakrate</div>
<button onMouseEnter={() => setHovBTS(true)} onMouseLeave={() => setHovBTS(false)} onClick={() => go(() => setStep(“why”))} style={{ background: “none”, border: “none”, cursor: “pointer”, fontSize: 12, letterSpacing: “0.15em”, textTransform: “uppercase”, fontFamily: “Georgia,serif”, color: hovBTS ? “#b8922e” : “#9a8e7e”, transition: “color 0.2s”, padding: 0 }}>Why Peakrate?</button>
</div>

```
  <div style={c.card}>

    {step === "landing" && (
      <div>
        <div style={{ ...c.lbl, marginBottom: 14 }}>Free Revenue Audit 3 Minutes</div>
        <h1 style={c.h1}>Find out how much<br />you're leaving behind.</h1>
        <div style={c.gold} />
        <p style={c.sub}>Answer a few questions about your business. We'll calculate your revenue score, estimate your annual gap, identify your event demand blind spots, and show you exactly where to start.</p>
        <div style={{ ...c.lbl, marginBottom: 16 }}>Select your business type</div>
        {BUSINESS_TYPES.map(bt => (
          <button key={bt.id} style={c.bizBtn(bt.id)} onMouseEnter={() => setHovBiz(bt.id)} onMouseLeave={() => setHovBiz(null)} onClick={() => selectBiz(bt.id)}>
            <span style={{ fontSize: 26 }}>{bt.icon}</span>
            <span style={{ fontSize: 15, color: "#3a2e24" }}>{bt.label}</span>
            <span style={{ marginLeft: "auto", color: "#9a8e7e", fontSize: 16 }}>→</span>
          </button>
        ))}
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid #161410", fontSize: 12, color: "#aaa09", lineHeight: 1.7 }}>
          Built by Dom Smith · 7 years Revenue Management at a major U.S. airline · Now helping small businesses capture what they're leaving on the table
        </div>
      </div>
    )}

    {step === "questions" && questions.length > 0 && (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <button style={c.back} onClick={() => go(() => setStep("landing"))}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isEventQ && <div style={{ fontSize: 10, color: "#b8922e", letterSpacing: "0.15em", textTransform: "uppercase", background: "#f5f0d8", padding: "3px 8px", borderRadius: 2 }}>Event Intelligence</div>}
            <div style={{ fontSize: 12, color: "#9a8e7e" }}>{currentQ + 1} / {questions.length}</div>
          </div>
        </div>
        <div style={c.prog}><div style={c.progFill} /></div>

        {currentQ === baseQCount && (
          <div style={{ background: "#f5f0e8", border: "1px solid #2a2520", borderLeft: "3px solid #c8a84b", padding: "14px 18px", borderRadius: 2, marginBottom: 26 }}>
            <div style={{ fontSize: 10, color: "#b8922e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 5 }}>Now: Event Demand Analysis</div>
            <div style={{ fontSize: 13, color: "#7a6e5e", lineHeight: 1.65 }}>One-time events can inflate your historical data and distort your forecast for years. These questions identify whether you're pricing around local demand or being misled by it.</div>
          </div>
        )}

        <div style={c.lbl}>{isEventQ ? "Event Demand Intelligence" : `${typeLabel} · Revenue Audit`}</div>
        <div style={{ fontSize: 22, color: "#1a1410", fontWeight: 400, lineHeight: 1.4, marginBottom: 28 }}>{questions[currentQ].label}</div>
        {questions[currentQ].options.map(opt => (
          <button key={opt} style={c.optBtn(opt)} onMouseEnter={() => setHovOpt(opt)} onMouseLeave={() => setHovOpt(null)} onClick={() => answer(questions[currentQ].id, opt)}>
            {opt}
          </button>
        ))}
      </div>
    )}

    {step === "results" && (
      <div>
        <div style={c.lbl}>Your Revenue Audit · {typeLabel}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
          <div style={c.circle}>
            <div style={{ fontSize: 30, color: si.color, fontWeight: 300, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 11, color: "#9a8e7e", marginTop: 2 }}>/ 100</div>
          </div>
          <div>
            <div style={{ fontSize: 20, color: si.color, marginBottom: 6 }}>{si.label}</div>
            <div style={{ fontSize: 13, color: "#6a5e4e", lineHeight: 1.65, maxWidth: 380 }}>{si.desc}</div>
          </div>
        </div>

        <div style={c.leakBox}>
          <div style={{ fontSize: 11, color: "#b8922e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Estimated Annual Revenue Gap</div>
          <div style={{ fontSize: 34, color: "#1a1410", fontWeight: 300 }}>
            {leakage <= 5000 ? "$" : leakage <= 15000 ? "$$" : leakage <= 40000 ? "$$$" : "$$$$"}
          </div>
          <div style={{ fontSize: 14, color: "#8a7e6e", marginTop: 4 }}>
            Estimated range: {leakage <= 5000 ? "Under $5K/yr" : leakage <= 15000 ? "$5K–$15K/yr" : leakage <= 40000 ? "$15K–$40K/yr" : "$40K+/yr"}
          </div>
          <div style={{ fontSize: 12, color: "#8a7e6e", marginTop: 4, fontStyle: "italic" }}>Based on your current strategy vs. optimized RM benchmarks for your business type</div>
          {answers.events_onetime?.includes("assumed") && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#fdf0f0", border: "1px solid #7f1d1d", borderRadius: 2, fontSize: 12, color: "#fca5a5", lineHeight: 1.6 }}>
              ⚠️ Forecast risk: A one-time event spike may be inflating your revenue baseline. That demand won't return and pricing as if it will costs you.
            </div>
          )}
        </div>

        <div style={c.aiBox}>
          <div style={{ fontSize: 10, color: "#9a8e7e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Consultant's Read</div>
          {loadingAI
            ? <div style={{ fontSize: 13, color: "#9a8e7e", fontStyle: "italic" }}>Analyzing your results...</div>
            : <div style={{ fontSize: 14, color: "#5a4e40", lineHeight: 1.8, fontStyle: "italic" }}>{aiInsight || "Your answers reveal clear, addressable gaps in your revenue strategy the kind that compound quietly over years without a structured RM approach."}</div>
          }
          <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: 10, color: "#aaa09" }}>Dom Smith · Peakrate</div>
        </div>

        <div style={c.lbl}>Recommendations</div>
        {recs.map((rec, i) => (
          <div key={i} style={c.recItem(rec.event)}>
            <div style={{ fontSize: 17, color: rec.event ? "#b0c8a0" : "#222018", fontWeight: 700, minWidth: 22, paddingTop: 2 }}>0{i + 1}</div>
            <div style={{ fontSize: 13, color: rec.event ? "#4a7040" : "#6a5e4e", lineHeight: 1.7, flex: 1 }}>{rec.text}</div>
            {rec.event && <div style={{ fontSize: 10, color: "#4a6838", paddingTop: 2, flexShrink: 0 }}>📅 Event RM</div>}
          </div>
        ))}

        <div style={c.div} />

        {!reportDone && !consultDone ? (
          <div>
            <div style={c.lbl}>Next Steps</div>
            <p style={{ fontSize: 14, color: "#7a6e5e", lineHeight: 1.75, marginBottom: 22 }}>Get your full report emailed to you, or book a free 30-minute consultation with Dom to walk through your results and build a 90-day action plan.</p>
            <input style={c.inp} placeholder="Your name" value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} />
            <input style={c.inp} placeholder="Email address" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} />
            <input style={c.inp} placeholder="Phone (optional)" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} />
            <button style={c.pBtn} onClick={() => { if (contact.email) setConsultDone(true); }}>Book Free 30-Min Consultation</button>
            <button style={c.sBtn} onClick={() => { if (contact.email) setReportDone(true); }}>Send Me the Full Report</button>
          </div>
        ) : (
          <div style={c.ok}>
            {consultDone
              ? <><strong>Consultation request received.</strong><br />Dom will reach out to {contact.email} within 24 hours to schedule your free session. Come ready to talk numbers.</>
              : <><strong>Report on its way.</strong><br />Your full revenue audit will be sent to {contact.email} within the hour.</>
            }
          </div>
        )}

        <div style={c.div} />
        <button style={c.back} onClick={reset}>← Start Over</button>
      </div>
    )}


    {step === "why" && (
      <div>
        <button style={c.back} onClick={() => go(() => setStep("landing"))}>← Back to Audit</button>
        <div style={{ marginTop: 36 }}>
          <div style={c.lbl}>Why Peakrate?</div>
          <h1 style={{ ...c.h1, fontSize: 30, marginBottom: 20 }}>You deserve the same strategy the big guys use.</h1>
          <div style={c.gold} />
          <div style={{ fontSize: 15, color: "#6a5e4e", lineHeight: 1.85, marginBottom: 24 }}>
            When you work with Peakrate you're not getting handed off to a junior analyst who's never run a business. You're not getting a 40-page report that sits in your inbox unread. You're getting me Dom directly. One on one. Someone who has sat inside the revenue management operations of one of the largest airlines in the world and who also watched his wife try to figure out why January was always so slow.
          </div>
          <div style={{ fontSize: 15, color: "#6a5e4e", lineHeight: 1.85, marginBottom: 24 }}>
            I know both worlds. And I built this to bridge them.
          </div>
          <div style={{ fontSize: 15, color: "#6a5e4e", lineHeight: 1.85, marginBottom: 36 }}>
            Big consulting firms charge big firm prices for big firm problems. Your business doesn't have a big firm problem. It has a fixable pricing and demand problem that nobody's ever walked you through. That's a different conversation shorter, more direct, and actually useful.
          </div>

          <div style={{ background: "#f0ebe0", border: "1px solid #232018", borderLeft: "3px solid #c8a84b", padding: "24px 28px", borderRadius: 2, marginBottom: 32 }}>
            <div style={c.lbl}>The Background</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {[
                { icon: "✈️", org: "a major U.S. airline", role: "Senior RM Analyst", note: "Multi-billion dollar fare portfolio across Pacific Northwest markets" },
                { icon: "🐠", org: "a major hospitality and attractions organization", role: "Revenue Analyst", note: "Hospitality and attractions revenue strategy, including major exhibit builds" },
                { icon: "🏦", org: "a regional financial institution", role: "Financial Analyst", note: "Consumer finance, lending, and financial strategy" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, color: "#b8922e", marginBottom: 3, letterSpacing: "0.05em" }}>{item.org}</div>
                  <div style={{ fontSize: 12, color: "#3a2e24", marginBottom: 6 }}>{item.role}</div>
                  <div style={{ fontSize: 12, color: "#8a7e6e", lineHeight: 1.6, fontStyle: "italic" }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={c.lbl}>The Difference</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[
              { icon: "❌", label: "Big Consulting Firm", points: ["Junior analyst you've never met", "Generic 40-page report", "Enterprise pricing, small business budget", "One size fits all strategy", "Gone after the engagement"] },
              { icon: "✅", label: "Peakrate", points: ["Dom directly, every conversation", "Plain language action plan", "Multi-billion dollar strategy, small business price", "Built around your specific numbers", "Here when you need adjustments"] },
            ].map((col, i) => (
              <div key={i} style={{ background: i === 1 ? "#ede8dc" : "#f0ebe0", border: i === 1 ? "1px solid #2a3820" : "1px solid #1c1a16", padding: "20px", borderRadius: 2 }}>
                <div style={{ fontSize: 13, color: i === 1 ? "#7a9860" : "#7a6e5e", letterSpacing: "0.05em", marginBottom: 14, fontWeight: 600 }}>{col.icon} {col.label}</div>
                {col.points.map((p, j) => (
                  <div key={j} style={{ fontSize: 13, color: i === 1 ? "#4a6838" : "#8a7e6e", lineHeight: 1.5, marginBottom: 8, paddingLeft: 4 }}>{p}</div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: "#f0ebe0", border: "1px solid #232018", padding: "22px 26px", borderRadius: 2, marginBottom: 32 }}>
            <div style={c.lbl}>Where This Is Going</div>
            <div style={{ fontSize: 15, color: "#6a5e4e", lineHeight: 1.85 }}>
              Peakrate isn't a side project. The vision is a full revenue management firm a team of analysts bringing enterprise-level strategy to small and mid-size businesses across hospitality, events, and creative services. The kind of firm that makes what used to cost 0,000 accessible for 00 a month. But right now it's just me. And honestly that's a feature, not a bug you get my full attention and someone who genuinely wants to win together, not just deliver a report and disappear.
            </div>
          </div>

          <div style={{ borderTop: "1px solid #161410", paddingTop: 24 }}>
            <div style={{ fontSize: 14, color: "#7a6e5e", fontStyle: "italic", marginBottom: 20 }}>  Dom Smith, Founder · Peakrate</div>
            <button style={c.pBtn} onClick={() => go(() => setStep("landing"))}>Take the Free Audit →</button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
```

);
}
