// .kiro/hooks/fetchResources.js

module.exports = async function fetchResources({ subject, level = 'Beginner' }) {
  const resourceDatabase = {
    JavaScript: [
      // Video Resources
      { title: "JavaScript Crash Course - Traversy Media", url: "https://youtu.be/hdI2bqOjy3c", type: "video", description: "Complete beginner-friendly crash course" },
      { title: "freeCodeCamp JavaScript Full Course", url: "https://youtu.be/PkZNo7MFNFg", type: "video", description: "8+ hour comprehensive tutorial" },
      { title: "JavaScript Tutorial for Beginners - Programming with Mosh", url: "https://youtu.be/W6NZfCO5SIk", type: "video", description: "Modern JavaScript fundamentals" },
      { title: "Coursera JavaScript Basics", url: "https://www.coursera.org/learn/javascript-basics", type: "video", description: "University-level structured course" },
      
      // Article/Tutorial Resources
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "article", description: "Official Mozilla documentation" },
      { title: "W3Schools JavaScript Tutorial", url: "https://www.w3schools.com/js/", type: "article", description: "Interactive examples and exercises" },
      { title: "JavaScript.info - Modern JavaScript Tutorial", url: "https://javascript.info/", type: "article", description: "In-depth modern JS concepts" },
      { title: "GeeksforGeeks JavaScript Tutorial", url: "https://www.geeksforgeeks.org/javascript-tutorial/", type: "article", description: "Comprehensive programming guide" },
      
      // Interactive Platforms
      { title: "Codecademy JavaScript Course", url: "https://www.codecademy.com/learn/introduction-to-javascript", type: "interactive", description: "Hands-on coding exercises" },
      { title: "LeetCode JavaScript Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy&page=1&topicSlugs=javascript", type: "interactive", description: "Algorithm practice problems" },
      { title: "HackerRank JavaScript Domain", url: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript", type: "interactive", description: "10-day coding challenge" },
      { title: "Codewars JavaScript Kata", url: "https://www.codewars.com/kata/search/javascript", type: "interactive", description: "Coding challenges and community" }
    ],
    
    Python: [
      // Video Resources
      { title: "Python for Beginners - freeCodeCamp", url: "https://youtu.be/rfscVS0vtbw", type: "video", description: "4+ hour complete beginner course" },
      { title: "Python Crash Course - Traversy Media", url: "https://youtu.be/JJmcL1N2KQs", type: "video", description: "Quick start Python tutorial" },
      { title: "Automate the Boring Stuff with Python", url: "https://youtu.be/1F_OgqRuSdI", type: "video", description: "Practical Python applications" },
      { title: "Coursera Python for Everybody", url: "https://www.coursera.org/specializations/python", type: "video", description: "University of Michigan Python course" },
      
      // Article/Tutorial Resources
      { title: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "article", description: "Official Python documentation" },
      { title: "W3Schools Python Tutorial", url: "https://www.w3schools.com/python/", type: "article", description: "Step-by-step Python guide" },
      { title: "GeeksforGeeks Python Programming", url: "https://www.geeksforgeeks.org/python-programming-language/", type: "article", description: "Comprehensive Python resource" },
      { title: "Real Python Tutorials", url: "https://realpython.com/", type: "article", description: "Advanced Python concepts and best practices" },
      
      // Interactive Platforms
      { title: "Codecademy Python Course", url: "https://www.codecademy.com/learn/learn-python-3", type: "interactive", description: "Interactive Python learning" },
      { title: "LeetCode Python Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy&page=1&topicSlugs=python", type: "interactive", description: "Algorithm challenges in Python" },
      { title: "HackerRank Python Domain", url: "https://www.hackerrank.com/domains/python", type: "interactive", description: "Python coding challenges" },
      { title: "Python Challenge", url: "http://www.pythonchallenge.com/", type: "interactive", description: "Unique Python puzzle game" }
    ],
    
    Math: [
      // Video Resources
      { title: "Khan Academy Math Courses", url: "https://www.khanacademy.org/math", type: "video", description: "Comprehensive math video library" },
      { title: "Professor Leonard Calculus", url: "https://youtu.be/fYyARMqiaag", type: "video", description: "University-level calculus lectures" },
      { title: "3Blue1Brown - Essence of Linear Algebra", url: "https://youtu.be/fNk_zzaMoSs", type: "video", description: "Visual approach to mathematics" },
      { title: "Coursera Mathematics for Machine Learning", url: "https://www.coursera.org/specializations/mathematics-machine-learning", type: "video", description: "Applied mathematics course" },
      
      // Article/Tutorial Resources
      { title: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu/", type: "article", description: "Comprehensive calculus and algebra notes" },
      { title: "Wolfram MathWorld", url: "https://mathworld.wolfram.com/", type: "article", description: "Mathematical encyclopedia" },
      { title: "MIT OpenCourseWare Mathematics", url: "https://ocw.mit.edu/courses/mathematics/", type: "article", description: "Free MIT mathematics courses" },
      { title: "Better Explained Math Concepts", url: "https://betterexplained.com/", type: "article", description: "Intuitive math explanations" },
      
      // Interactive Platforms
      { title: "Brilliant Math & Science", url: "https://brilliant.org/courses/", type: "interactive", description: "Interactive problem-solving platform" },
      { title: "Desmos Graphing Calculator", url: "https://www.desmos.com/calculator", type: "interactive", description: "Advanced graphing tool" },
      { title: "Photomath - Step by Step Solutions", url: "https://photomath.com/", type: "interactive", description: "Math problem solver with explanations" },
      { title: "IXL Math Practice", url: "https://www.ixl.com/math/", type: "interactive", description: "Adaptive math practice problems" }
    ],
    
    React: [
      // Video Resources
      { title: "React Crash Course - Traversy Media", url: "https://youtu.be/w7ejDZ8SWv8", type: "video", description: "Quick React fundamentals" },
      { title: "freeCodeCamp React Course", url: "https://youtu.be/bMknfKXIFA8", type: "video", description: "Complete React tutorial" },
      { title: "React Tutorial for Beginners - Programming with Mosh", url: "https://youtu.be/Ke90Tje7VS0", type: "video", description: "Modern React development" },
      { title: "Coursera React Specialization", url: "https://www.coursera.org/specializations/full-stack-react", type: "video", description: "Full-stack React development" },
      
      // Article/Tutorial Resources
      { title: "React Official Documentation", url: "https://react.dev/learn", type: "article", description: "Official React learning guide" },
      { title: "W3Schools React Tutorial", url: "https://www.w3schools.com/react/", type: "article", description: "Beginner-friendly React guide" },
      { title: "GeeksforGeeks React Tutorial", url: "https://www.geeksforgeeks.org/react-tutorial/", type: "article", description: "Comprehensive React concepts" },
      { title: "React Patterns", url: "https://reactpatterns.com/", type: "article", description: "Common React design patterns" },
      
      // Interactive Platforms
      { title: "Codecademy React Course", url: "https://www.codecademy.com/learn/react-101", type: "interactive", description: "Hands-on React learning" },
      { title: "React Challenges on Codewars", url: "https://www.codewars.com/kata/search/react", type: "interactive", description: "React coding challenges" },
      { title: "Scrimba React Course", url: "https://scrimba.com/learn/learnreact", type: "interactive", description: "Interactive React screencasts" },
      { title: "React CodePen Challenges", url: "https://codepen.io/collection/DNbRzP/", type: "interactive", description: "React component challenges" }
    ],

    CSS: [
      // Video Resources
      { title: "CSS Crash Course - Traversy Media", url: "https://youtu.be/yfoY53QXEnI", type: "video", description: "Complete CSS fundamentals" },
      { title: "freeCodeCamp CSS Course", url: "https://youtu.be/1Rs2ND1ryYc", type: "video", description: "Comprehensive CSS tutorial" },
      { title: "CSS Grid Course - Wes Bos", url: "https://cssgrid.io/", type: "video", description: "Master CSS Grid layout" },
      { title: "Coursera Web Design for Everybody", url: "https://www.coursera.org/specializations/web-design", type: "video", description: "University CSS course" },
      
      // Article/Tutorial Resources
      { title: "MDN CSS Documentation", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", type: "article", description: "Complete CSS reference" },
      { title: "W3Schools CSS Tutorial", url: "https://www.w3schools.com/css/", type: "article", description: "Interactive CSS examples" },
      { title: "CSS-Tricks", url: "https://css-tricks.com/", type: "article", description: "CSS tips, tricks, and techniques" },
      { title: "GeeksforGeeks CSS Tutorial", url: "https://www.geeksforgeeks.org/css-tutorial/", type: "article", description: "Structured CSS learning" },
      
      // Interactive Platforms
      { title: "Codecademy CSS Course", url: "https://www.codecademy.com/learn/learn-css", type: "interactive", description: "Interactive CSS practice" },
      { title: "CSS Diner", url: "https://flukeout.github.io/", type: "interactive", description: "CSS selector game" },
      { title: "Flexbox Froggy", url: "https://flexboxfroggy.com/", type: "interactive", description: "Learn Flexbox through games" },
      { title: "Grid Garden", url: "https://cssgridgarden.com/", type: "interactive", description: "CSS Grid learning game" }
    ]
  };

  // Get resources for the subject, or return general resources
  const subjectResources = resourceDatabase[subject] || [
    { title: "Khan Academy - General Learning", url: "https://khanacademy.org", type: "video", description: "Free educational content" },
    { title: "Coursera Free Courses", url: "https://www.coursera.org/courses?query=free", type: "article", description: "University-level courses" },
    { title: "edX Free Courses", url: "https://www.edx.org/", type: "interactive", description: "Interactive learning platform" }
  ];

  // Create YouTube search link for the subject and level
  const youtubeSearchQuery = `${subject} ${level} tutorial`.replace(/\s+/g, '+');
  const youtubeSearchResource = {
    title: `YouTube: ${subject} ${level} Tutorials`,
    url: `https://www.youtube.com/results?search_query=${youtubeSearchQuery}`,
    type: "video",
    description: `Search results for ${subject} ${level} tutorials`
  };

  // Return a diverse mix of resource types (at least one of each type when possible)
  const videoResources = subjectResources.filter(r => r.type === 'video').slice(0, 2);
  const articleResources = subjectResources.filter(r => r.type === 'article').slice(0, 2);
  const interactiveResources = subjectResources.filter(r => r.type === 'interactive').slice(0, 2);

  // Always include the YouTube search link as the first resource
  const selectedResources = [youtubeSearchResource, ...videoResources, ...articleResources, ...interactiveResources];

  return {
    resources: selectedResources.length > 0 ? selectedResources : [youtubeSearchResource, ...subjectResources.slice(0, 5)]
  };
};