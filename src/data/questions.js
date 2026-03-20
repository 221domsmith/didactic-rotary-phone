export const BUSINESS_TYPES = [
  { id: "str", label: "Airbnb / Short-Term Rental", icon: "🏠" },
  { id: "venue", label: "Event Venue", icon: "🎪" },
  { id: "hotel", label: "Boutique Hotel", icon: "🏨" },
  { id: "photo", label: "Photographer / Videographer", icon: "📷" },
];

export const LOCAL_EVENTS_QUESTIONS = [
  {
    id: "events_awareness",
    label: "Are you actively monitoring local events...",
    type: "select",
    options: [
      "No I don’t track local events at all",
      "I’m aware of them but don’t adjust pricing",
      "I adjust for major events occasionally",
      "Yes I have a system for tracking and pricing around events",
    ],
  },
];

// continue same...

export const QUESTIONS = {
  str: [
    {
      id: "rooms",
      label: "How many rental properties do you manage?",
      type: "select",
      options: ["1", "2–3", "4–6", "7+"],
    },
    ...LOCAL_EVENTS_QUESTIONS,
  ],
};