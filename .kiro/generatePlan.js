#!/usr/bin/env node

const fetchResources = require('./hooks/fetchResources');

// Parse timeframe to get number of days
function parseTimeframe(timeframe, level) {
  // Default days based on level
  const defaultDays = {
    'Beginner': 7,
    'Intermediate': 14,
    'Advanced': 21
  };

  if (!timeframe) {
    return defaultDays[level] || 7;
  }

  // Try to extract number from timeframe string
  const match = timeframe.toString().match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1]);
    // Validate: must be positive and reasonable (1-365 days)
    if (days > 0 && days <= 365) {
      return days;
    }
  }

  // Fall back to default if invalid
  return defaultDays[level] || 7;
}

// Generate study plan content based on subject, level, and number of days
function generatePlanContent(subject, level, totalDays) {
  const planTemplates = {
    'Math': {
      'Beginner': {
        core: [
          'Basic arithmetic and number operations',
          'Introduction to fractions and decimals',
          'Basic geometry - shapes and measurements',
          'Introduction to algebra - variables and simple equations',
          'Word problems and practical applications',
          'Review and practice exercises',
          'Assessment and next steps planning'
        ],
        extended: [
          'Number systems and properties',
          'Advanced fraction operations',
          'Percentage calculations and applications',
          'Basic statistics and data interpretation',
          'Introduction to coordinate geometry',
          'Simple probability concepts',
          'Mathematical reasoning and logic'
        ]
      },
      'Intermediate': {
        core: [
          'Advanced algebra and quadratic equations',
          'Trigonometry basics - sine, cosine, tangent',
          'Statistics and probability fundamentals',
          'Calculus introduction - limits and derivatives',
          'Geometry - area, volume, and coordinate systems',
          'Complex problem solving and applications',
          'Comprehensive review and testing'
        ],
        extended: [
          'Polynomial functions and graphing',
          'Exponential and logarithmic functions',
          'Advanced trigonometric identities',
          'Sequences and series',
          'Matrix operations and systems of equations',
          'Introduction to differential equations',
          'Real-world mathematical modeling'
        ]
      },
      'Advanced': {
        core: [
          'Advanced calculus - integration techniques',
          'Linear algebra - matrices and vector spaces',
          'Differential equations and modeling',
          'Advanced statistics and hypothesis testing',
          'Mathematical proofs and logic',
          'Applied mathematics in real-world scenarios',
          'Research topics and advanced applications'
        ],
        extended: [
          'Multivariable calculus and partial derivatives',
          'Complex analysis and functions',
          'Abstract algebra and group theory',
          'Numerical methods and computational mathematics',
          'Topology and advanced geometry',
          'Mathematical optimization techniques',
          'Advanced probability theory and stochastic processes'
        ]
      }
    },
    'JavaScript': {
      'Beginner': {
        core: [
          'Variables, data types, and basic syntax',
          'Functions and scope',
          'Arrays and objects',
          'DOM manipulation basics',
          'Event handling and user interaction',
          'Debugging and error handling',
          'Build a simple interactive webpage'
        ],
        extended: [
          'Control structures - loops and conditionals',
          'String manipulation and methods',
          'Working with forms and user input',
          'Local storage and session management',
          'Introduction to JSON and data handling',
          'Basic animations and effects',
          'Code organization and best practices'
        ]
      },
      'Intermediate': {
        core: [
          'ES6+ features and modern syntax',
          'Asynchronous JavaScript - promises and async/await',
          'API calls and fetch',
          'JavaScript frameworks introduction',
          'Testing and debugging techniques',
          'Performance optimization',
          'Build a dynamic web application'
        ],
        extended: [
          'Advanced array methods and functional programming',
          'Closures and advanced scope concepts',
          'Prototype inheritance and classes',
          'Module systems and bundling',
          'Regular expressions and pattern matching',
          'Browser APIs and web technologies',
          'State management patterns'
        ]
      },
      'Advanced': {
        core: [
          'Advanced design patterns and architecture',
          'Node.js and server-side JavaScript',
          'Advanced React/Vue concepts',
          'TypeScript integration',
          'Performance profiling and optimization',
          'Security best practices',
          'Deploy a full-stack application'
        ],
        extended: [
          'Microservices and distributed systems',
          'Advanced testing strategies and TDD',
          'WebAssembly and performance optimization',
          'Progressive Web Apps and service workers',
          'GraphQL and advanced API design',
          'DevOps and CI/CD pipelines',
          'Scalability and system design'
        ]
      }
    }
  };

  // Get plan template or create generic one
  const template = planTemplates[subject]?.[level] || {
    core: [
      `Introduction to ${subject}`,
      'Basic concepts and terminology',
      'Hands-on practice and examples',
      'Intermediate topics and applications',
      'Advanced concepts and problem solving',
      'Real-world projects and case studies',
      'Review, assessment, and next steps'
    ],
    extended: [
      `Deep dive into ${subject} fundamentals`,
      'Advanced techniques and methodologies',
      'Industry best practices and standards',
      'Complex problem-solving scenarios',
      'Integration with other technologies',
      'Performance optimization strategies',
      'Future trends and emerging concepts'
    ]
  };

  const allTopics = [...template.core, ...template.extended];
  const plan = [];

  // Distribute topics across the requested number of days
  if (totalDays <= 7) {
    // Use core topics, possibly combining some
    const coreTopics = template.core.slice(0, totalDays);
    for (let i = 0; i < totalDays; i++) {
      plan.push(`Day ${i + 1}: ${coreTopics[i] || allTopics[i % allTopics.length]}`);
    }
  } else {
    // Use all available topics, repeating or expanding as needed
    for (let i = 0; i < totalDays; i++) {
      const topicIndex = i % allTopics.length;
      const topic = allTopics[topicIndex];
      
      if (i < allTopics.length) {
        plan.push(`Day ${i + 1}: ${topic}`);
      } else {
        // For longer plans, add practice/review days
        const cycleDay = Math.floor(i / allTopics.length) + 1;
        plan.push(`Day ${i + 1}: Practice and review - ${topic} (Cycle ${cycleDay})`);
      }
    }
  }

  return plan;
}

// Main function to generate study plan
async function generateStudyPlan(subject, level, timeframe) {
  // Parse the timeframe to get number of days
  const totalDays = parseTimeframe(timeframe, level);
  
  // Generate the study plan content
  const studyPlan = generatePlanContent(subject, level, totalDays);

  // Fetch resources for the subject
  const resourceData = await fetchResources({ subject, level });

  return {
    subject,
    level,
    timeframe: `${totalDays} days`,
    plan: studyPlan,
    resources: resourceData.resources,
    generatedAt: new Date().toISOString(),
    totalDays: totalDays
  };
}

// CLI functionality - run when called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node .kiro/generatePlan.js <subject> <level> [days]');
    console.log('Examples:');
    console.log('  node .kiro/generatePlan.js "Math" "Beginner"');
    console.log('  node .kiro/generatePlan.js "JavaScript" "Intermediate" "10"');
    console.log('  node .kiro/generatePlan.js "Python" "Advanced" "30 days"');
    console.log('');
    console.log('Default durations: Beginner (7 days), Intermediate (14 days), Advanced (21 days)');
    process.exit(1);
  }

  const [subject, level, timeframe] = args;
  
  generateStudyPlan(subject, level, timeframe)
    .then(plan => {
      console.log(JSON.stringify(plan, null, 2));
    })
    .catch(error => {
      console.error('Error generating plan:', error);
      process.exit(1);
    });
}

// Export for use in server
module.exports = generateStudyPlan;