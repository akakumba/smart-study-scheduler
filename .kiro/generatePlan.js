// .kiro/generatePlan.js
const subject = process.argv[2] || "General";
const level = process.argv[3] || "Beginner";

// Generate a 7-day plan
const plan = Array.from({ length: 7 }, (_, i) => {
  if ((i + 1) % 3 === 0) return `Day ${i + 1}: Rest or review ${subject}`;
  return `Day ${i + 1}: Study ${subject} (${level}) - session ${i + 1}`;
});

// Suggested resources
const resources = [
  {
    url: `https://www.google.com/search?q=${encodeURIComponent(subject)}+${encodeURIComponent(level)}+tutorial`,
    description: "Google search for tutorials"
  },
  {
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject)}+${encodeURIComponent(level)}+lessons`,
    description: "YouTube lessons"
  },
  {
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(subject)}`,
    description: "Wikipedia article"
  },
  {
    url: `https://www.khanacademy.org/search?query=${encodeURIComponent(subject)}`,
    description: "Khan Academy search"
  }
];

console.log(JSON.stringify({ subject, level, plan, resources }));