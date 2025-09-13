#!/usr/bin/env node

const fetchResources = require('./hooks/fetchResources');

// Parse timeframe to get number of days with enhanced validation
function parseTimeframe(timeframe, level) {
  // Default days based on level
  const defaultDays = {
    'Beginner': 7,
    'Intermediate': 14,
    'Advanced': 21
  };

  // If no timeframe provided, use default
  if (!timeframe || timeframe === '' || timeframe === null || timeframe === undefined) {
    return defaultDays[level] || 7;
  }

  // Convert to string and try to extract number
  const timeframeStr = timeframe.toString().trim();
  
  // Handle direct number input
  if (/^\d+$/.test(timeframeStr)) {
    const days = parseInt(timeframeStr, 10);
    if (days > 0 && days <= 365) {
      return days;
    }
  }
  
  // Handle "X days" format
  const match = timeframeStr.match(/(\d+)\s*days?/i);
  if (match) {
    const days = parseInt(match[1], 10);
    if (days > 0 && days <= 365) {
      return days;
    }
  }

  // Handle other time formats and convert to days
  const weekMatch = timeframeStr.match(/(\d+)\s*weeks?/i);
  if (weekMatch) {
    const weeks = parseInt(weekMatch[1], 10);
    const days = weeks * 7;
    if (days > 0 && days <= 365) {
      return days;
    }
  }

  const monthMatch = timeframeStr.match(/(\d+)\s*months?/i);
  if (monthMatch) {
    const months = parseInt(monthMatch[1], 10);
    const days = months * 30; // Approximate
    if (days > 0 && days <= 365) {
      return days;
    }
  }

  // If input is invalid (negative, zero, or too large), fall back to default
  console.warn(`Invalid timeframe "${timeframe}", using default for ${level} level`);
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
    },
    'Python': {
      'Beginner': {
        core: [
          'Python syntax and basic data types',
          'Variables, operators, and input/output',
          'Control structures - if statements and loops',
          'Functions and parameter passing',
          'Lists, tuples, and dictionaries',
          'File handling and error management',
          'Build a simple Python project'
        ],
        extended: [
          'String methods and formatting',
          'List comprehensions and generators',
          'Working with modules and packages',
          'Object-oriented programming basics',
          'Regular expressions and pattern matching',
          'Working with APIs and JSON',
          'Testing and debugging techniques'
        ]
      },
      'Intermediate': {
        core: [
          'Object-oriented programming concepts',
          'Inheritance, polymorphism, and encapsulation',
          'Working with external libraries and pip',
          'Data manipulation with pandas',
          'Web scraping and automation',
          'Database connectivity and SQL',
          'Build a data analysis project'
        ],
        extended: [
          'Decorators and context managers',
          'Multithreading and multiprocessing',
          'Web development with Flask/Django',
          'API development and REST services',
          'Data visualization with matplotlib',
          'Machine learning with scikit-learn',
          'Performance optimization techniques'
        ]
      },
      'Advanced': {
        core: [
          'Advanced Python patterns and idioms',
          'Metaclasses and descriptors',
          'Asynchronous programming with asyncio',
          'Memory management and profiling',
          'Package development and distribution',
          'Advanced testing strategies',
          'Deploy a production Python application'
        ],
        extended: [
          'C extensions and Cython optimization',
          'Distributed computing with Dask',
          'Machine learning model deployment',
          'Microservices architecture',
          'Security best practices',
          'Performance monitoring and logging',
          'Contributing to open source projects'
        ]
      }
    },
    'React': {
      'Beginner': {
        core: [
          'React fundamentals and JSX syntax',
          'Components and props',
          'State management with useState',
          'Event handling and forms',
          'Conditional rendering and lists',
          'Component lifecycle and useEffect',
          'Build your first React app'
        ],
        extended: [
          'CSS styling in React components',
          'Handling user input and validation',
          'Working with external APIs',
          'React Router for navigation',
          'Error boundaries and debugging',
          'Performance optimization basics',
          'Deployment to production'
        ]
      },
      'Intermediate': {
        core: [
          'Advanced hooks (useContext, useReducer)',
          'Custom hooks development',
          'State management with Context API',
          'Performance optimization techniques',
          'Testing React components',
          'Integration with backend APIs',
          'Build a full-featured React application'
        ],
        extended: [
          'Advanced patterns (HOCs, render props)',
          'Code splitting and lazy loading',
          'Server-side rendering basics',
          'Progressive Web App features',
          'Animation and transitions',
          'Accessibility best practices',
          'Advanced debugging techniques'
        ]
      },
      'Advanced': {
        core: [
          'Advanced state management (Redux, Zustand)',
          'Server-side rendering with Next.js',
          'Advanced TypeScript integration',
          'Micro-frontends architecture',
          'Advanced testing strategies',
          'Performance monitoring and optimization',
          'Build and deploy enterprise React apps'
        ],
        extended: [
          'React internals and reconciliation',
          'Custom renderer development',
          'Advanced build optimization',
          'Concurrent features and Suspense',
          'Advanced security considerations',
          'Scalable architecture patterns',
          'Contributing to React ecosystem'
        ]
      }
    },
    'CSS': {
      'Beginner': {
        core: [
          'CSS syntax and selectors',
          'Colors, fonts, and text styling',
          'Box model and layout basics',
          'Flexbox fundamentals',
          'CSS Grid basics',
          'Responsive design principles',
          'Build a responsive webpage'
        ],
        extended: [
          'CSS positioning and z-index',
          'Pseudo-classes and pseudo-elements',
          'CSS transitions and basic animations',
          'Media queries and breakpoints',
          'CSS variables and custom properties',
          'Browser compatibility and prefixes',
          'CSS debugging techniques'
        ]
      },
      'Intermediate': {
        core: [
          'Advanced Flexbox and Grid layouts',
          'CSS animations and keyframes',
          'Sass/SCSS preprocessing',
          'CSS architecture and methodologies',
          'Performance optimization',
          'Advanced responsive techniques',
          'Build a complex layout system'
        ],
        extended: [
          'CSS-in-JS and styled components',
          'Advanced animation techniques',
          'CSS frameworks integration',
          'Cross-browser compatibility',
          'Accessibility in CSS',
          'CSS testing strategies',
          'Modern CSS features'
        ]
      },
      'Advanced': {
        core: [
          'CSS architecture at scale',
          'Advanced CSS Grid techniques',
          'Custom CSS frameworks',
          'Performance optimization strategies',
          'CSS-in-JS advanced patterns',
          'Design system development',
          'Build a production CSS system'
        ],
        extended: [
          'CSS Houdini and Paint API',
          'Advanced browser rendering',
          'CSS optimization tools',
          'Maintainable CSS strategies',
          'CSS security considerations',
          'Future CSS specifications',
          'CSS tooling and automation'
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
    console.log('Usage: node .kiro/generatePlan.js <subject> <level> [duration]');
    console.log('');
    console.log('Examples:');
    console.log('  node .kiro/generatePlan.js "Math" "Beginner"');
    console.log('  node .kiro/generatePlan.js "JavaScript" "Intermediate" "10"');
    console.log('  node .kiro/generatePlan.js "Python" "Advanced" "30 days"');
    console.log('  node .kiro/generatePlan.js "React" "Beginner" "2 weeks"');
    console.log('  node .kiro/generatePlan.js "CSS" "Intermediate" "1 month"');
    console.log('');
    console.log('Supported subjects: Math, JavaScript, Python, React, CSS');
    console.log('Supported levels: Beginner, Intermediate, Advanced');
    console.log('Duration formats: "10", "10 days", "2 weeks", "1 month"');
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