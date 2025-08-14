// .kiro/runSchedulerTest.js
const fetchResources = require("./hooks/fetchResources");

async function runTest() {
  const input = {
    subject: "JavaScript",
    learningStyle: "visual",
    skillLevel: "Beginner",
    availableTime: 3, // days
  };

  console.log("🧪 Running Smart Study Scheduler Test...\n");

  const resources = await fetchResources(input);

  console.log("📘 Study Plan:");
  for (let day = 1; day <= input.availableTime; day++) {
    console.log(`Day ${day}: Learn ${input.subject} (${input.skillLevel})`);
  }

  console.log("\n🔗 Suggested Resources:");
  resources.resources.forEach((res, i) => {
    console.log(`${i + 1}. ${res.title} — ${res.url}`);
    console.log(`   ${res.description}`);
  });
}

runTest().catch((err) => {
  console.error("❌ Error running scheduler test:", err);
});
