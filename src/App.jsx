import React, { useState } from 'react';

const BUSINESS_TYPES = [
  { id: 'str', label: 'Airbnb / Short-Term Rental', icon: '🏠' },
  { id: 'venue', label: 'Event Venue', icon: '🎪' },
  { id: 'hotel', label: 'Boutique Hotel', icon: '🏨' },
  { id: 'photo', label: 'Photographer / Videographer', icon: '📷' },
];

const LOCAL_EVENTS_QUESTIONS = [
  {
    id: 'events_awareness',
    label: 'Are you actively monitoring local events and adjusting your pricing around them?',
    type: 'select',
    options: [
      'No, I do not track local events at all',
      'I am aware of them but do not adjust pricing',
      'I adjust for major events occasionally',
      'Yes, I have a system for tracking and pricing around events',
    ],
  },
  {
    id: 'events_onetime',
    label: 'Have you ever had a revenue spike from a one-time local event that you may have assumed would repeat?',
    type: 'select',
    options: [
      'No spike I am aware of',
      'Yes, and I assumed that revenue would repeat the following year',
      'Yes, and I knew it was one-time and planned accordingly',
      'Not sure, I do not track revenue by date closely enough to know',
    ],
  },
  {
    id: 'events_calendar',
    label: 'Do you maintain a forward-looking demand calendar, mapping events 6-12 months out to anticipate pricing opportunities?',
    type: 'select',
    options: [
      'No forward planning at all',
      'I check occasionally but nothing systematic',
      'I have a rough calendar I reference',
      'Yes, I actively manage a 12-month demand calendar',
    ],
  },
  {
    id: 'service_interest',
    label: 'What kind of help are you most interested in?',
    type: 'select',
    options: [
      'A one-time pricing audit and action plan',
      'Monthly strategy calls to review performance',
      'Someone to manage my pricing for me hands-off',
      'Not sure yet, just exploring',
    ],
  },
];

const QUESTIONS = {
  str: [
    { id: 'rooms', label: 'How many rental properties do you manage?', type: 'select', options: ['1', '2-3', '4-6', '7+'] },
    { id: 'rate', label: 'What is your average nightly rate?', type: 'select', options: ['Under $75', '$75-$125', '$126-$200', '$201-$350', '$350+'] },
    { id: 'occupancy', label: 'What is your average monthly occupancy?', type: 'select', options: ['Under 40%', '40-55%', '56-70%', '71-85%', '85%+'] },
    { id: 'pricing', label: 'How do you currently set your nightly rates?', type: 'select', options: ['Same rate year-round', 'Airbnb Smart Pricing only', 'I adjust manually sometimes', 'I use a dynamic pricing tool'] },
    { id: 'seasons', label: 'Do you charge more during peak seasons or local events?', type: 'select', options: ['No, same rate always', 'Occasionally', 'Yes, for major holidays only', 'Yes, consistently'] },
    { id: 'lastchange', label: 'When did you last review your pricing strategy?', type: 'select', options: ['Never', 'Over a year ago', '6-12 months ago', 'Within the last 6 months'] },
    ...LOCAL_EVENTS_QUESTIONS,
  ],
  venue: [
    { id: 'capacity', label: 'What is your venue max capacity?', type: 'select', options: ['Under 50 guests', '50-100 guests', '101-200 guests', '201-500 guests', '500+ guests'] },
    { id: 'rate', label: 'What is your average booking rate per event?', type: 'select', options: ['Under $1,000', '$1,000-$2,500', '$2,500-$5,000', '$5,000-$10,000', '$10,000+'] },
    { id: 'occupancy', label: 'What percentage of your available dates are booked monthly?', type: 'select', options: ['Under 30%', '30-50%', '51-65%', '66-80%', '80%+'] },
    { id: 'pricing', label: 'How do you structure your pricing?', type: 'select', options: ['One flat rate for everything', 'Weekday vs. weekend rates', 'Seasonal pricing tiers', 'Fully dynamic by demand'] },
    { id: 'seasons', label: 'Do you adjust pricing for peak wedding and event season?', type: 'select', options: ['No adjustment', 'Minor adjustments', 'Moderate seasonal tiers', 'Aggressive peak pricing'] },
    { id: 'lastchange', label: 'When did you last update your pricing structure?', type: 'select', options: ['Never', 'Over a year ago', '6-12 months ago', 'Within the last 6 months'] },
    ...LOCAL_EVENTS_QUESTIONS,
  ],
  hotel: [
    { id: 'rooms', label: 'How many rooms does your property have?', type: 'select', options: ['Under 20', '20-40', '41-80', '81-150', '150+'] },
    { id: 'rate', label: 'What is your average daily rate (ADR)?', type: 'select', options: ['Under $80', '$80-$120', '$121-$180', '$181-$250', '$250+'] },
    { id: 'occupancy', label: 'What is your average occupancy rate?', type: 'select', options: ['Under 45%', '45-60%', '61-72%', '73-84%', '85%+'] },
    { id: 'pricing', label: 'How do you manage your room rates?', type: 'select', options: ['Static rates year-round', 'Manual seasonal adjustments', 'OTA-driven pricing', 'Dedicated RM strategy'] },
    { id: 'revpar', label: 'Are you actively tracking RevPAR month over month?', type: 'select', options: ['Not tracking', 'Tracking but not acting on it', 'Tracking and adjusting occasionally', 'Tracking and optimizing regularly'] },
    { id: 'lastchange', label: 'When did you last conduct a full pricing audit?', type: 'select', options: ['Never', 'Over a year ago', '6-12 months ago', 'Within the last 6 months'] },
    ...LOCAL_EVENTS_QUESTIONS,
  ],
  photo: [
    { id: 'sessions', label: 'How many paid sessions do you average per month?', type: 'select', options: ['1-3', '4-6', '7-10', '11-15', '16+'] },
    { id: 'rate', label: 'What is your base session rate?', type: 'select', options: ['Under $150', '$150-$300', '$301-$500', '$501-$800', '$800+'] },
    { id: 'pricing', label: 'How do you currently set your session prices?', type: 'select', options: ['Same flat rate year-round', 'I raise prices occasionally when busy', 'I have weekday vs. weekend rates', 'I use seasonal and demand-based pricing'] },
    { id: 'packages', label: 'Do you offer tiered packages, mini, standard, premium?', type: 'select', options: ['No, one offering only', 'Two tiers', 'Three or more tiers', 'Three plus tiers with add-ons and upsells'] },
    { id: 'slowseason', label: 'What do you do during your slow season, typically Jan-Mar?', type: 'select', options: ['Nothing, I just wait for bookings', 'Lower prices across the board', 'Run targeted mini-session promotions', 'Use strategic off-peak pricing to fill the calendar'] },
    { id: 'lastchange', label: 'When did you last update your pricing?', type: 'select', options: ['Never', 'Over a year ago', '6-12 months ago', 'Within the last 6 months'] },
    { id: 'photo_referrals', label: 'Do you have a referral or repeat booking strategy to fill your calendar?', type: 'select', options: ['No strategy at all', 'I rely on word of mouth passively', 'I occasionally ask for referrals', 'Yes, I have an active referral and repeat client program'] },
    { id: 'photo_peakseason', label: 'Do you raise your rates during peak season, spring and fall, when demand for photographers is highest?', type: 'select', options: ['No, same rate year-round', 'I have thought about it but have not done it', 'I raise rates slightly', 'Yes, I have clear peak and off-peak pricing'] },
    { id: 'service_interest', label: 'What kind of help are you most interested in?', type: 'select', options: ['A one-time pricing audit and action plan', 'Monthly strategy calls to review performance', 'Someone to manage my pricing for me hands-off', 'Not sure yet, just exploring'] },
  ],
};

const scoreAnswer = (questionId, answer) => {
  const low = {
    pricing: ['Same rate year-round', 'Same flat rate year-round', 'One flat rate for everything', 'Static rates year-round', 'Airbnb Smart Pricing only'],
    seasons: ['No, same rate always', 'No adjustment'],
    lastchange: ['Never', 'Over a year ago'],
    occupancy: ['Under 40%', 'Under 30%', 'Under 45%'],
    revpar: ['Not tracking'],
    slowseason: ['Nothing, I just wait for bookings', 'Lower prices across the board'],
    packages: ['No, one offering only'],
    events_awareness: ['No, I do not track local events at all', 'I am aware of them but do not adjust pricing'],
    events_onetime: ['Yes, and I assumed that revenue would repeat the following year', 'Not sure, I do not track revenue by date closely enough to know'],
    events_calendar: ['No forward planning at all', 'I check occasionally but nothing systematic'],
  };
  const high = {
    pricing: ['I use a dynamic pricing tool', 'Fully dynamic by demand', 'Dedicated RM strategy', 'I use seasonal and demand-based pricing'],
    seasons: ['Yes, consistently', 'Aggressive peak pricing'],
    lastchange: ['Within the last 6 months'],
    occupancy: ['85%+', '80%+'],
    revpar: ['Tracking and optimizing regularly'],
    slowseason: ['Use strategic off-peak pricing to fill the calendar'],
    packages: ['Three or more tiers', 'Three plus tiers with add-ons and upsells'],
    events_awareness: ['Yes, I have a system for tracking and pricing around events'],
    events_onetime: ['Yes, and I knew it was one-time and planned accordingly'],
    events_calendar: ['Yes, I actively manage a 12-month demand calendar'],
  };
  if (low[questionId] && low[questionId].includes(answer)) return 1;
  if (high[questionId] && high[questionId].includes(answer)) return 4;
  return 2;
};

const getLeakage = (answers, bType) => {
  const rateMap = {
    str: { 'Under $75': 65, '$75-$125': 100, '$126-$200': 160, '$201-$350': 275, '$350+': 400 },
    venue: { 'Under $1,000': 700, '$1,000-$2,500': 1750, '$2,500-$5,000': 3750, '$5,000-$10,000': 7500, '$10,000+': 12000 },
    hotel: { 'Under $80': 65, '$80-$120': 100, '$121-$180': 150, '$181-$250': 215, '$250+': 300 },
    photo: { 'Under $150': 120, '$150-$300': 225, '$301-$500': 400, '$501-$800': 650, '$800+': 1000 },
  };
  const sessionsMap = { '1-3': 2, '4-6': 5, '7-10': 8, '11-15': 13, '16+': 18 };
  const occMap = {
    str: { 'Under 40%': 0.35, '40-55%': 0.47, '56-70%': 0.63, '71-85%': 0.78, '85%+': 0.90 },
    venue: { 'Under 30%': 0.22, '30-50%': 0.40, '51-65%': 0.58, '66-80%': 0.73, '80%+': 0.85 },
    hotel: { 'Under 45%': 0.38, '45-60%': 0.52, '61-72%': 0.66, '73-84%': 0.78, '85%+': 0.90 },
  };
  const rate = (rateMap[bType] && rateMap[bType][answers.rate]) ? rateMap[bType][answers.rate] : 150;
  const isStatic = answers.pricing && (answers.pricing.includes('flat') || answers.pricing.includes('Same') || answers.pricing.includes('Static') || answers.pricing.includes('year-round'));
  const rateUplift = isStatic ? 0.22 : 0.10;
  const eventPenalty = answers.events_onetime && answers.events_onetime.includes('assumed') ? 0.08 : 0;
  const noEvents = answers.events_awareness && (answers.events_awareness.includes('No') || answers.events_awareness.includes('aware'));
  const eventLoss = noEvents ? 0.12 : 0.04;
  if (bType === 'photo') {
    const sessions = sessionsMap[answers.sessions] || 5;
    const current = rate * sessions * 12;
    const pkgUplift = answers.packages && answers.packages.includes('one offering') ? 0.25 : answers.packages && answers.packages.includes('Two') ? 0.15 : 0.08;
    const slowLoss = answers.slowseason && answers.slowseason.includes('Nothing') ? 0.18 : answers.slowseason && answers.slowseason.includes('Lower') ? 0.10 : 0.04;
    return Math.round((current * (rateUplift + pkgUplift + slowLoss + eventLoss - eventPenalty)) / 500) * 500;
  }
  const occ = (occMap[bType] && occMap[bType][answers.occupancy]) ? occMap[bType][answers.occupancy] : 0.55;
  const targetOcc = bType === 'venue' ? 0.75 : 0.82;
  const occGap = Math.max(0, targetOcc - occ);
  const totalUplift = rateUplift + eventLoss;
  let leak = 0;
  if (bType === 'str') {
    leak = (rate * (1 + totalUplift) * (occ + occGap) * 365 - rate * occ * 365) * (1 + eventPenalty);
  } else if (bType === 'venue') {
    leak = (rate * (1 + totalUplift) * (occ + occGap) * 144 - rate * occ * 144) * (1 + eventPenalty);
  } else {
    const rooms = answers.rooms === 'Under 20' ? 15 : answers.rooms === '20-40' ? 30 : answers.rooms === '41-80' ? 60 : 100;
    leak = ((rate * (1 + totalUplift) * (occ + occGap)) - (rate * occ)) * rooms * 365 * (1 + eventPenalty);
  }
  return Math.round(leak / 1000) * 1000;
};

const getScoreLabel = (s) => {
  if (s <= 30) return { label: 'Critical', color: '#ef4444', bg: '#fdf0f0', desc: 'Your revenue strategy has significant gaps. You are likely leaving 25-40% of potential revenue uncaptured every year.' };
  if (s <= 55) return { label: 'Developing', color: '#f97316', bg: '#fdf4ee', desc: 'You have some pricing awareness but no systematic strategy. Structured RM could move you 15-25% higher.' };
  if (s <= 75) return { label: 'Functional', color: '#eab308', bg: '#fdfae8', desc: 'You are doing better than most, but there are clear gaps in your peak and off-peak strategy.' };
  return { label: 'Optimized', color: '#22c55e', bg: '#f0fdf4', desc: 'Strong foundation. Fine-tuning your channel mix and demand forecasting could push you to the next tier.' };
};

const getRecs = (answers, bType) => {
  const recs = [];
  const isStatic = answers.pricing && (answers.pricing.includes('flat') || answers.pricing.includes('Same') || answers.pricing.includes('Static') || answers.pricing.includes('year-round'));
  if (isStatic) recs.push({ text: bType === 'photo' ? 'Move away from a single flat rate. A three-tier package structure, mini, standard, premium, with seasonal pricing is the fastest way to increase annual revenue without booking more clients.' : 'Implement a three-tier rate structure: base, peak, and off-peak. Static pricing is the single biggest revenue leak for your business type.', event: false });
  if (bType === 'photo' && answers.packages && (answers.packages.includes('one offering') || answers.packages.includes('Two'))) recs.push({ text: 'Build at least three distinct packages with clear value differentiation. Your highest-tier package should be priced so that even 2 bookings per month makes a material impact on your annual revenue.', event: false });
  if (bType === 'photo' && answers.slowseason && (answers.slowseason.includes('Nothing') || answers.slowseason.includes('Lower'))) recs.push({ text: 'Stop discounting across the board in slow season. It trains clients to wait for deals. Instead, run limited mini-session events in January and February to generate volume without touching your standard rate card.', event: false });
  if (answers.seasons && (answers.seasons.includes('No') || answers.seasons.includes('Never'))) recs.push({ text: 'Build a demand calendar. Identify your top 10 highest-demand dates and set rate floors 30-50% above your base rate for those windows.', event: false });
  if (answers.lastchange && (answers.lastchange.includes('Never') || answers.lastchange.includes('year'))) recs.push({ text: 'Your pricing has not kept pace with the market. Inflation alone justifies a 10-15% increase, but more importantly, your competitive positioning may have shifted entirely since your last review.', event: false });
  if (bType === 'hotel' && answers.revpar && answers.revpar.includes('Not tracking')) recs.push({ text: 'Start tracking RevPAR weekly. You cannot optimize what you do not measure. RevPAR is the single most important metric for your property revenue health.', event: false });
  if (bType === 'str' && answers.pricing && answers.pricing.includes('Smart Pricing')) recs.push({ text: 'Airbnb Smart Pricing optimizes for Airbnb booking volume, not your profit. Add manual rate floors for your top 20 demand dates and override Smart Pricing entirely during local events.', event: false });
  if (answers.events_awareness && (answers.events_awareness.includes('No') || answers.events_awareness.includes('aware'))) recs.push({ text: 'You are missing event-driven demand spikes. Set up a Google Calendar with local events 12 months out. Any event drawing 5,000 or more people within 10 miles is a pricing opportunity you should act on weeks in advance.', event: true });
  if (answers.events_onetime && answers.events_onetime.includes('assumed')) recs.push({ text: 'Forecast risk: You had a one-time event spike and may have built that into your baseline. That revenue will not repeat. Remove that period from your normal year-over-year comparison, otherwise you are pricing against demand that no longer exists.', event: true });
  if (answers.events_onetime && answers.events_onetime.includes('Not sure')) recs.push({ text: 'You do not have enough visibility into what is driving your revenue peaks. Start tagging bookings by what was happening locally that week. You will find patterns that completely change how you price.', event: true });
  if (answers.events_calendar && (answers.events_calendar.includes('No forward') || answers.events_calendar.includes('occasionally'))) recs.push({ text: 'Build a 12-month demand calendar now. Forward visibility is the foundation of every RM strategy. Without it you are always reacting to demand instead of pricing ahead of it.', event: true });
  return recs.slice(0, 5);
};

const getPricing = (answers, bType, score) => {
  let auditStart = '$299';
  let retainerStart = '$399';
  let doneStart = '$599';
  let complexity = 'Standard scope';
  const isMultiProperty = bType === 'str' && answers.rooms && answers.rooms !== '1';
  if (bType === 'photo') {
    auditStart = '$199'; retainerStart = '$249'; doneStart = '$399'; complexity = 'Photographer / single operator';
  } else if (bType === 'venue') {
    auditStart = '$299'; retainerStart = '$399'; doneStart = '$599'; complexity = 'Event venue';
  } else if (bType === 'str' && !isMultiProperty) {
    auditStart = '$299'; retainerStart = '$399'; doneStart = '$599'; complexity = 'Single STR property';
  } else if (isMultiProperty) {
    auditStart = '$499'; retainerStart = '$699'; doneStart = '$999'; complexity = 'Multi-property STR portfolio';
  } else if (bType === 'hotel') {
    auditStart = '$499'; retainerStart = '$799'; doneStart = '$1,200'; complexity = 'Boutique hotel';
  }
  if (score <= 30) { complexity = complexity + ' (elevated complexity)'; }
  return { auditStart: auditStart, retainerStart: retainerStart, doneStart: doneStart, complexity: complexity };
};

export default function App() {
  const [step, setStep] = useState('landing');
  const [bType, setBType] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [leakage, setLeakage] = useState(0);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [reportDone, setReportDone] = useState(false);
  const [consultDone, setConsultDone] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [anim, setAnim] = useState(true);
  const [hovBiz, setHovBiz] = useState(null);
  const [hovOpt, setHovOpt] = useState(null);
  const [hovNav, setHovNav] = useState(false);
  const [pricing, setPricing] = useState({ auditStart: '$299', retainerStart: '$399', doneStart: '$599', complexity: '' });

  const questions = bType ? QUESTIONS[bType] : [];
  const baseQCount = bType === 'photo' ? questions.length - 1 : questions.length - LOCAL_EVENTS_QUESTIONS.length;
  const isEventQ = currentQ >= baseQCount && questions.length > 0 && bType !== 'photo';

  const go = (fn) => { setAnim(false); setTimeout(function() { fn(); setAnim(true); }, 220); };
  const selectBiz = (type) => go(function() { setBType(type); setStep('questions'); setCurrentQ(0); setAnswers({}); });

  const answer = (qId, val) => {
    const next = Object.assign({}, answers, { [qId]: val });
    setAnswers(next);
    if (currentQ < questions.length - 1) {
      go(function() { setCurrentQ(currentQ + 1); });
    } else {
      const total = questions.reduce(function(a, q) { return a + scoreAnswer(q.id, next[q.id] || ''); }, 0);
      const pct = Math.round((total / (questions.length * 4)) * 100);
      const leak = getLeakage(next, bType);
      const priceRec = getPricing(next, bType, pct);
      setScore(pct);
      setLeakage(leak);
      setPricing(priceRec);
      fetchAI(next, bType, pct, leak);
      go(function() { setStep('results'); });
    }
  };

  const fetchAI = function(ans, bt, pct, leak) {
    setLoadingAI(true);
    const labelMap = { str: 'Airbnb/short-term rental', venue: 'event venue', hotel: 'boutique hotel', photo: 'photographer or videographer' };
    const label = labelMap[bt] || bt;
    const summary = Object.entries(ans).map(function(e) { return e[0] + ': ' + e[1]; }).join(', ');
    const anomaly = ans.events_onetime && ans.events_onetime.includes('assumed') ? ' Flag the one-time event revenue anomaly risk specifically.' : '';
    const prompt = 'You are Dom Smith, a revenue management consultant with 7 years at a major U.S. airline. A ' + label + ' owner just completed a revenue audit. Score: ' + pct + '/100. Estimated annual revenue gap: $' + leak.toLocaleString() + '. Their answers: ' + summary + '.' + anomaly + ' Write 2-3 sharp, direct sentences. Lead with their single biggest revenue leak. End with one specific action they can take this week. Sound like a straight-talking consultant, not a chatbot. No preamble, no lists.';
    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
    }).then(function(res) { return res.json(); }).then(function(data) {
      const block = data.content && data.content.find(function(b) { return b.type === 'text'; });
      setAiInsight(block ? block.text : '');
      setLoadingAI(false);
    }).catch(function() { setAiInsight(''); setLoadingAI(false); });
  };

  const reset = function() {
    go(function() {
      setStep('landing'); setBType(null); setAnswers({}); setScore(0); setLeakage(0);
      setReportDone(false); setConsultDone(false); setAiInsight(''); setCurrentQ(0);
      setPricing({ auditStart: '$299', retainerStart: '$399', doneStart: '$599', complexity: '' });
    });
  };

  const si = getScoreLabel(score);
  const recs = bType ? getRecs(answers, bType) : [];
  const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;
  const typeLabel = { str: 'Airbnb / STR', venue: 'Event Venue', hotel: 'Boutique Hotel', photo: 'Photographer / Videographer' }[bType] || '';

  const c = {
    wrap: { minHeight: '100vh', background: '#faf7f2', color: '#1a1410', fontFamily: 'Georgia, Times New Roman, serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 80px' },
    hdr: { width: '100%', maxWidth: 660, padding: '32px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontSize: 13, letterSpacing: '0.3em', color: '#b8922e', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Georgia, serif', padding: 0 },
    card: { width: '100%', maxWidth: 660, marginTop: 44, opacity: anim ? 1 : 0, transform: anim ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.22s ease, transform 0.22s ease' },
    lbl: { fontSize: 11, color: '#b8922e', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
    h1: { fontSize: 36, fontWeight: 400, lineHeight: 1.2, color: '#1a1410', marginBottom: 14, letterSpacing: '-0.02em' },
    sub: { fontSize: 15, color: '#6a5e4e', lineHeight: 1.75, marginBottom: 36, maxWidth: 500 },
    gold: { width: 44, height: 2, background: '#b8922e', marginBottom: 30 },
    prog: { width: '100%', height: 2, background: '#ddd6c4', borderRadius: 1, marginBottom: 38, overflow: 'hidden' },
    progFill: { height: '100%', background: '#b8922e', width: progress + '%', transition: 'width 0.3s ease', borderRadius: 1 },
    circle: { width: 110, height: 110, borderRadius: '50%', background: si ? si.bg : '#fff', border: '3px solid ' + (si ? si.color : '#ccc'), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    leakBox: { background: '#f0ebe0', border: '1px solid #d0c8b4', borderLeft: '3px solid #b8922e', padding: '20px 24px', borderRadius: 2, marginBottom: 22 },
    aiBox: { background: '#f0ebe0', border: '1px solid #d0c8b4', padding: '18px 22px', borderRadius: 2, marginBottom: 22, position: 'relative' },
    inp: { width: '100%', background: '#f0ebe0', border: '1px solid #d0c8b4', borderRadius: 2, padding: '12px 14px', color: '#3a2e24', fontSize: 14, fontFamily: 'Georgia, serif', outline: 'none', boxSizing: 'border-box', marginBottom: 10 },
    pBtn: { background: '#b8922e', color: '#faf7f2', border: 'none', borderRadius: 2, padding: '14px 28px', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700, width: '100%', marginBottom: 9 },
    sBtn: { background: 'transparent', color: '#b8922e', border: '1px solid #b8922e', borderRadius: 2, padding: '13px 28px', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia, serif', width: '100%', marginBottom: 9 },
    divider: { width: '100%', height: 1, background: '#ddd6c4', margin: '26px 0' },
    back: { background: 'none', border: 'none', color: '#9a8e7e', fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Georgia, serif', padding: 0 },
    ok: { background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: 2, padding: '16px 20px', marginTop: 8, fontSize: 13, color: '#166534', lineHeight: 1.65 },
  };

  const bizBtnStyle = function(id) {
    return { width: '100%', background: hovBiz === id ? '#e8e2d4' : '#f5f0e8', border: '1px solid ' + (hovBiz === id ? '#b8922e' : '#d8d0be'), borderRadius: 3, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', marginBottom: 10, transition: 'all 0.18s', textAlign: 'left' };
  };

  const optBtnStyle = function(o) {
    return { width: '100%', background: hovOpt === o ? '#e8e2d4' : '#f5f0e8', border: '1px solid ' + (hovOpt === o ? '#b8922e' : '#d8d0be'), borderRadius: 3, padding: '13px 18px', color: hovOpt === o ? '#1a1410' : '#5a4e40', fontSize: 14, cursor: 'pointer', marginBottom: 9, textAlign: 'left', fontFamily: 'Georgia, serif', transition: 'all 0.15s' };
  };

  return (
    React.createElement('div', { style: c.wrap },
      React.createElement('div', { style: c.hdr },
        React.createElement('button', { style: c.logo, onClick: function() { go(function() { setStep('landing'); }); } }, 'Peakrate'),
        React.createElement('button', {
          onMouseEnter: function() { setHovNav(true); },
          onMouseLeave: function() { setHovNav(false); },
          onClick: function() { go(function() { setStep('why'); }); },
          style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Georgia, serif', color: hovNav ? '#b8922e' : '#9a8e7e', transition: 'color 0.2s', padding: 0 }
        }, 'Why Peakrate?')
      ),
      React.createElement('div', { style: c.card },
        step === 'landing' && React.createElement('div', null,
          React.createElement('div', { style: Object.assign({}, c.lbl, { marginBottom: 14 }) }, 'Free Revenue Audit, 3 Minutes'),
          React.createElement('h1', { style: c.h1 }, 'Find out how much you are leaving behind.'),
          React.createElement('div', { style: c.gold }),
          React.createElement('p', { style: c.sub }, 'Answer a few questions about your business. We will calculate your revenue score, estimate your annual gap, identify your event demand blind spots, and show you exactly where to start.'),
          React.createElement('div', { style: Object.assign({}, c.lbl, { marginBottom: 16 }) }, 'Select your business type'),
          BUSINESS_TYPES.map(function(bt) {
            return React.createElement('button', { key: bt.id, style: bizBtnStyle(bt.id), onMouseEnter: function() { setHovBiz(bt.id); }, onMouseLeave: function() { setHovBiz(null); }, onClick: function() { selectBiz(bt.id); } },
              React.createElement('span', { style: { fontSize: 26 } }, bt.icon),
              React.createElement('span', { style: { fontSize: 15, color: '#3a2e24' } }, bt.label),
              React.createElement('span', { style: { marginLeft: 'auto', color: '#9a8e7e', fontSize: 16 } }, '→')
            );
          }),
          React.createElement('div', { style: { marginTop: 36, paddingTop: 20, borderTop: '1px solid #e0d8c8', fontSize: 12, color: '#b0a898', lineHeight: 1.7 } },
            'Built by Dom Smith · 7 years Revenue Management at a major U.S. airline · Now helping small businesses capture what they are leaving on the table'
          )
        ),

        step === 'questions' && questions.length > 0 && React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 } },
            React.createElement('button', { style: c.back, onClick: function() { go(function() { setStep('landing'); }); } }, 'Back'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
              isEventQ && React.createElement('div', { style: { fontSize: 10, color: '#b8922e', letterSpacing: '0.15em', textTransform: 'uppercase', background: '#fdfae8', padding: '3px 8px', borderRadius: 2 } }, 'Event Intelligence'),
              React.createElement('div', { style: { fontSize: 12, color: '#9a8e7e' } }, (currentQ + 1) + ' / ' + questions.length)
            )
          ),
          React.createElement('div', { style: c.prog }, React.createElement('div', { style: c.progFill })),
          currentQ === baseQCount && bType !== 'photo' && React.createElement('div', { style: { background: '#fdfae8', border: '1px solid #d8d0be', borderLeft: '3px solid #b8922e', padding: '14px 18px', borderRadius: 2, marginBottom: 26 } },
            React.createElement('div', { style: { fontSize: 10, color: '#b8922e', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 5 } }, 'Now: Event Demand Analysis'),
            React.createElement('div', { style: { fontSize: 13, color: '#7a6e5e', lineHeight: 1.65 } }, 'One-time events can inflate your historical data and distort your forecast for years. These questions identify whether you are pricing around local demand or being misled by it.')
          ),
          React.createElement('div', { style: c.lbl }, isEventQ ? 'Event Demand Intelligence' : typeLabel + ' · Revenue Audit'),
          React.createElement('div', { style: { fontSize: 22, color: '#1a1410', fontWeight: 400, lineHeight: 1.4, marginBottom: 28 } }, questions[currentQ].label),
          questions[currentQ].options.map(function(opt) {
            return React.createElement('button', { key: opt, style: optBtnStyle(opt), onMouseEnter: function() { setHovOpt(opt); }, onMouseLeave: function() { setHovOpt(null); }, onClick: function() { answer(questions[currentQ].id, opt); } }, opt);
          })
        ),

        step === 'results' && React.createElement('div', null,
          React.createElement('div', { style: c.lbl }, 'Your Revenue Audit · ' + typeLabel),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 22 } },
            React.createElement('div', { style: c.circle },
              React.createElement('div', { style: { fontSize: 30, color: si.color, fontWeight: 300, lineHeight: 1 } }, score),
              React.createElement('div', { style: { fontSize: 11, color: '#9a8e7e', marginTop: 2 } }, '/ 100')
            ),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 20, color: si.color, marginBottom: 6 } }, si.label),
              React.createElement('div', { style: { fontSize: 13, color: '#6a5e4e', lineHeight: 1.65, maxWidth: 380 } }, si.desc)
            )
          ),
          React.createElement('div', { style: c.leakBox },
            React.createElement('div', { style: { fontSize: 11, color: '#b8922e', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 } }, 'Estimated Annual Revenue Gap'),
            React.createElement('div', { style: { fontSize: 34, color: '#1a1410', fontWeight: 300 } }, leakage <= 5000 ? '$' : leakage <= 15000 ? '$$' : leakage <= 40000 ? '$$$' : '$$$$'),
            React.createElement('div', { style: { fontSize: 14, color: '#8a7e6e', marginTop: 4 } }, 'Estimated range: ' + (leakage <= 5000 ? 'Under $5K/yr' : leakage <= 15000 ? '$5K-$15K/yr' : leakage <= 40000 ? '$15K-$40K/yr' : '$40K+/yr')),
            React.createElement('div', { style: { fontSize: 12, color: '#8a7e6e', marginTop: 4, fontStyle: 'italic' } }, 'Based on your current strategy vs. optimized RM benchmarks for your business type'),
            answers.events_onetime && answers.events_onetime.includes('assumed') && React.createElement('div', { style: { marginTop: 12, padding: '10px 14px', background: '#fdf0f0', border: '1px solid #fca5a5', borderRadius: 2, fontSize: 12, color: '#dc2626', lineHeight: 1.6 } }, 'Forecast risk: A one-time event spike may be inflating your revenue baseline. That demand will not return, and pricing as if it will costs you.')
          ),
          React.createElement('div', { style: c.aiBox },
            React.createElement('div', { style: { fontSize: 10, color: '#9a8e7e', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 } }, 'Consultant\'s Read'),
            loadingAI
              ? React.createElement('div', { style: { fontSize: 13, color: '#9a8e7e', fontStyle: 'italic' } }, 'Analyzing your results...')
              : React.createElement('div', { style: { fontSize: 14, color: '#5a4e40', lineHeight: 1.8, fontStyle: 'italic' } }, aiInsight || 'Your answers reveal clear, addressable gaps in your revenue strategy, the kind that compound quietly over years without a structured RM approach.'),
            React.createElement('div', { style: { position: 'absolute', bottom: 12, right: 16, fontSize: 10, color: '#b0a898' } }, 'Dom Smith · Peakrate')
          ),
          React.createElement('div', { style: c.lbl }, 'Recommendations'),
          recs.map(function(rec, i) {
            return React.createElement('div', { key: i, style: { background: rec.event ? '#edf5e8' : '#f0ebe0', border: '1px solid ' + (rec.event ? '#c8d8b8' : '#ddd6c6'), padding: '15px 18px', borderRadius: 2, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'flex-start' } },
              React.createElement('div', { style: { fontSize: 17, color: rec.event ? '#a8c898' : '#c8bea8', fontWeight: 700, minWidth: 22, paddingTop: 2 } }, '0' + (i + 1)),
              React.createElement('div', { style: { fontSize: 13, color: rec.event ? '#4a7040' : '#6a5e4e', lineHeight: 1.7, flex: 1 } }, rec.text),
              rec.event && React.createElement('div', { style: { fontSize: 10, color: '#4a6838', paddingTop: 2, flexShrink: 0 } }, 'Event RM')
            );
          }),
          React.createElement('div', { style: c.divider }),
          React.createElement('div', { style: { marginBottom: 28 } },
            React.createElement('div', { style: c.lbl }, 'Ways To Work Together'),
            React.createElement('p', { style: { fontSize: 14, color: '#7a6e5e', lineHeight: 1.7, marginBottom: 20 } }, 'Every engagement starts with a free 30-minute call. Pricing below is based on your business type and scope.'),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 } },
              [
                { title: 'Free Consultation', price: 'Free', period: '30 minutes', desc: 'Start here. We review your audit results together and figure out the best path forward. No pitch, no pressure.', features: ['Review your audit results', 'Identify your top revenue gaps', 'Walk through service options', 'No obligation'], highlight: false, free: true },
                { title: 'One-Time Audit', price: 'Starting from ' + pricing.auditStart, period: 'one time', desc: 'Full pricing audit, rate recommendations, and a 90-day action plan.', features: ['Complete pricing analysis', 'Package structure redesign', '12-month demand calendar', 'Written action plan'], highlight: false, free: false },
                { title: 'Monthly Retainer', price: 'Starting from ' + pricing.retainerStart, period: 'per month', desc: 'Monthly strategy calls, performance reviews, and ongoing pricing guidance.', features: ['Monthly 1-on-1 strategy call', 'Performance tracking', 'Seasonal rate adjustments', 'Event demand monitoring'], highlight: true, free: false },
                { title: 'Done For You', price: 'Starting from ' + pricing.doneStart, period: 'per month', desc: 'We manage your pricing directly. You focus on running your business.', features: ['Direct pricing management', 'Weekly rate monitoring', 'Event and demand response', 'Monthly revenue report'], highlight: false, free: false },
              ].map(function(tier, i) {
                return React.createElement('div', { key: i, style: { background: tier.highlight ? '#f5f0e8' : '#faf7f2', border: '1px solid ' + (tier.highlight ? '#b8922e' : '#d8d0be'), borderTop: '3px solid ' + (tier.highlight ? '#b8922e' : '#d8d0be'), borderRadius: 3, padding: '20px 16px', position: 'relative' } },
                  tier.highlight && React.createElement('div', { style: { position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%) translateY(-50%)', background: '#b8922e', color: '#faf7f2', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 10, whiteSpace: 'nowrap' } }, 'Most Popular'),
                  React.createElement('div', { style: { fontSize: 12, color: '#b8922e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 } }, tier.title),
                  React.createElement('div', { style: { fontSize: tier.free ? 22 : 16, color: tier.free ? '#22c55e' : '#1a1410', fontWeight: 300, marginBottom: 2 } }, tier.price),
                  React.createElement('div', { style: { fontSize: 11, color: '#9a8e7e', marginBottom: 12 } }, tier.period),
                  React.createElement('div', { style: { fontSize: 12, color: '#7a6e5e', lineHeight: 1.65, marginBottom: 14 } }, tier.desc),
                  tier.features.map(function(f, j) {
                    return React.createElement('div', { key: j, style: { fontSize: 12, color: '#6a5e4e', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'flex-start' } },
                      React.createElement('span', { style: { color: '#b8922e', flexShrink: 0 } }, '✓'),
                      f
                    );
                  }),
                  tier.free && React.createElement('button', { onClick: function() { window.open('https://calendly.com/peakrate/30min', '_blank'); }, style: { marginTop: 14, width: '100%', background: '#1a1410', color: '#faf7f2', border: 'none', borderRadius: 2, padding: '10px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 700 } }, 'Book Now')
                );
              })
            ),
            React.createElement('div', { style: { fontSize: 12, color: '#9a8e7e', marginTop: 12, fontStyle: 'italic', textAlign: 'center' } }, 'All prices are starting rates and are subject to increase based on business size and complexity. Final pricing confirmed after your free consultation.')
          ),
          React.createElement('div', { style: c.divider }),
          !reportDone && !consultDone
            ? React.createElement('div', null,
                React.createElement('div', { style: c.lbl }, 'Next Steps'),
                React.createElement('p', { style: { fontSize: 14, color: '#7a6e5e', lineHeight: 1.75, marginBottom: 22 } }, 'Get your full report emailed to you, or book a free 30-minute consultation with Dom to walk through your results and build a 90-day action plan.'),
                React.createElement('input', { style: c.inp, placeholder: 'Your name', value: contact.name, onChange: function(e) { setContact(function(p) { return Object.assign({}, p, { name: e.target.value }); }); } }),
                React.createElement('input', { style: c.inp, placeholder: 'Email address', value: contact.email, onChange: function(e) { setContact(function(p) { return Object.assign({}, p, { email: e.target.value }); }); } }),
                React.createElement('input', { style: c.inp, placeholder: 'Phone (optional)', value: contact.phone, onChange: function(e) { setContact(function(p) { return Object.assign({}, p, { phone: e.target.value }); }); } }),
                React.createElement('button', { style: c.pBtn, onClick: function() { if (contact.email) { setConsultDone(true); window.open('https://calendly.com/peakrate/30min', '_blank'); } } }, 'Book Free 30-Min Consultation'),
                React.createElement('button', { style: c.sBtn, onClick: function() { if (contact.email) setReportDone(true); } }, 'Send Me the Full Report')
              )
            : React.createElement('div', { style: c.ok },
                consultDone
                  ? React.createElement('span', null, React.createElement('strong', null, 'Consultation request received.'), React.createElement('br', null), 'Dom will reach out to ' + contact.email + ' within 24 hours to schedule your free session. Come ready to talk numbers.')
                  : React.createElement('span', null, React.createElement('strong', null, 'Report on its way.'), React.createElement('br', null), 'Your full revenue audit will be sent to ' + contact.email + ' within the hour.')
              ),
          React.createElement('div', { style: c.divider }),
          React.createElement('button', { style: c.back, onClick: reset }, 'Start Over')
        ),

        step === 'why' && React.createElement('div', null,
          React.createElement('button', { style: c.back, onClick: function() { go(function() { setStep('landing'); }); } }, 'Back to Audit'),
          React.createElement('div', { style: { marginTop: 36 } },
            React.createElement('div', { style: c.lbl }, 'Why Peakrate?'),
            React.createElement('h1', { style: Object.assign({}, c.h1, { fontSize: 30, marginBottom: 20 }) }, 'You deserve the same strategy the big guys use.'),
            React.createElement('div', { style: c.gold }),
            React.createElement('div', { style: { fontSize: 15, color: '#6a5e4e', lineHeight: 1.85, marginBottom: 24 } }, 'When you work with Peakrate you are not getting handed off to a junior analyst who has never run a business. You are not getting a 40-page report that sits in your inbox unread. You are getting me, Dom, directly. One on one. Someone who has sat inside the revenue management operations of one of the largest airlines in the world and who also watched his wife try to figure out why January was always so slow.'),
            React.createElement('div', { style: { fontSize: 15, color: '#6a5e4e', lineHeight: 1.85, marginBottom: 24 } }, 'I know both worlds. And I built this to bridge them.'),
            React.createElement('div', { style: { fontSize: 15, color: '#6a5e4e', lineHeight: 1.85, marginBottom: 36 } }, 'Big consulting firms charge big firm prices for big firm problems. Your business does not have a big firm problem. It has a fixable pricing and demand problem that nobody has ever walked you through. That is a different conversation, shorter, more direct, and actually useful.'),
            React.createElement('div', { style: { background: '#f0ebe0', border: '1px solid #d0c8b4', borderLeft: '3px solid #b8922e', padding: '24px 28px', borderRadius: 2, marginBottom: 32 } },
              React.createElement('div', { style: c.lbl }, 'The Background'),
              React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 } },
                [
                  { icon: '✈️', org: 'Major U.S. Airline', role: 'Senior Revenue Management Professional', note: 'Managed multi-billion dollar fare inventory across entire markets, driving competitive pricing strategy and revenue optimization at scale.' },
                  { icon: '🐠', org: 'Major Hospitality Organization', role: 'Hospitality Revenue Strategist', note: 'Led revenue strategy for one of the largest attractions in the country, including building ROI models for major capital investments.' },
                  { icon: '🏦', org: 'Regional Financial Institution', role: 'Financial Strategy Professional / Consumer Finance Specialist', note: 'Drove financial strategy and consumer lending performance, applying data-driven analysis to improve portfolio outcomes.' },
                ].map(function(item, i) {
                  return React.createElement('div', { key: i },
                    React.createElement('div', { style: { fontSize: 22, marginBottom: 8 } }, item.icon),
                    React.createElement('div', { style: { fontSize: 13, color: '#b8922e', marginBottom: 3, letterSpacing: '0.05em' } }, item.org),
                    React.createElement('div', { style: { fontSize: 12, color: '#3a2e24', marginBottom: 6 } }, item.role),
                    React.createElement('div', { style: { fontSize: 12, color: '#8a7e6e', lineHeight: 1.6, fontStyle: 'italic' } }, item.note)
                  );
                })
              )
            ),
            React.createElement('div', { style: c.lbl }, 'The Difference'),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 } },
              [
                { icon: '✗', label: 'Big Consulting Firm', points: ['Junior analyst you have never met', 'Generic 40-page report', 'Enterprise pricing, small business budget', 'One size fits all strategy', 'Gone after the engagement'] },
                { icon: '✓', label: 'Peakrate', points: ['Dom directly, every conversation', 'Plain language action plan', 'Multi-billion dollar strategy, small business price', 'Built around your specific numbers', 'Here when you need adjustments'] },
              ].map(function(col, i) {
                return React.createElement('div', { key: i, style: { background: i === 1 ? '#edf5e8' : '#f0ebe0', border: '1px solid ' + (i === 1 ? '#c8d8b8' : '#ddd6c6'), padding: '20px', borderRadius: 2 } },
                  React.createElement('div', { style: { fontSize: 13, color: i === 1 ? '#4a7040' : '#8a7e6e', letterSpacing: '0.05em', marginBottom: 14, fontWeight: 600 } }, col.icon + ' ' + col.label),
                  col.points.map(function(p, j) {
                    return React.createElement('div', { key: j, style: { fontSize: 13, color: i === 1 ? '#4a6838' : '#8a7e6e', lineHeight: 1.5, marginBottom: 8, paddingLeft: 4 } }, p);
                  })
                );
              })
            ),
            React.createElement('div', { style: { background: '#f0ebe0', border: '1px solid #d0c8b4', padding: '22px 26px', borderRadius: 2, marginBottom: 32 } },
              React.createElement('div', { style: c.lbl }, 'Where This Is Going'),
              React.createElement('div', { style: { fontSize: 15, color: '#6a5e4e', lineHeight: 1.85 } }, 'Peakrate is not a side project. The vision is a full revenue management firm, a team of analysts bringing enterprise-level strategy to small and mid-size businesses across hospitality, events, and creative services. The kind of firm that makes what used to cost $50,000 accessible for $500 a month. But right now it is just me. And honestly that is a feature, not a bug. You get my full attention and someone who genuinely wants to win together, not just deliver a report and disappear.')
            ),
            React.createElement('div', { style: { borderTop: '1px solid #e0d8c8', paddingTop: 24 } },
              React.createElement('div', { style: { fontSize: 14, color: '#7a6e5e', fontStyle: 'italic', marginBottom: 20 } }, 'Dom Smith, Founder · Peakrate'),
              React.createElement('button', { style: c.pBtn, onClick: function() { go(function() { setStep('landing'); }); } }, 'Take the Free Audit')
            )
          )
        )
      )
    )
  );
}
