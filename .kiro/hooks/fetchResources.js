// .kiro/hooks/fetchResources.js

module.exports = async function fetchResources({ subject, level = 'Beginner' }) {
  const resourceDatabase = {
    JavaScript: [
      // Video Resources
      { title: "JavaScript Crash Course - Traversy Media", url: "https://youtu.be/hdI2bqOjy3c", type: "video" },
      { title: "freeCodeCamp JavaScript Full Course", url: "https://youtu.be/PkZNo7MFNFg", type: "video" },
      { title: "JavaScript Tutorial for Beginners - Programming with Mosh", url: "https://youtu.be/W6NZfCO5SIk", type: "video" },
      
      // Article/Tutorial Resources
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "article" },
      { title: "W3Schools JavaScript Tutorial", url: "https://www.w3schools.com/js/", type: "article" },
      { title: "JavaScript.info - Modern JavaScript Tutorial", url: "https://javascript.info/", type: "article" },
      
      // Interactive Platforms
      { title: "Codecademy JavaScript Course", url: "https://www.codecademy.com/learn/introduction-to-javascript", type: "interactive" },
      { title: "LeetCode JavaScript Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy&page=1&topicSlugs=javascript", type: "interactive" },
      { title: "HackerRank JavaScript Domain", url: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript", type: "interactive" }
    ],
    
    Python: [
      // Video Resources
      { title: "Python for Beginners - freeCodeCamp", url: "https://youtu.be/rfscVS0vtbw", type: "video" },
      { title: "Python Crash Course - Traversy Media", url: "https://youtu.be/JJmcL1N2KQs", type: "video" },
      { title: "Automate the Boring Stuff with Python", url: "https://youtu.be/1F_OgqRuSdI", type: "video" },
      
      // Article/Tutorial Resources
      { title: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "article" },
      { title: "W3Schools Python Tutorial", url: "https://www.w3schools.com/python/", type: "article" },
      { title: "GeeksforGeeks Python Programming", url: "https://www.geeksforgeeks.org/python-programming-language/", type: "article" },
      
      // Interactive Platforms
      { title: "Codecademy Python Course", url: "https://www.codecademy.com/learn/learn-python-3", type: "interactive" },
      { title: "LeetCode Python Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy&page=1&topicSlugs=python", type: "interactive" },
      { title: "HackerRank Python Domain", url: "https://www.hackerrank.com/domains/python", type: "interactive" }
    ],
    
    Math: [
      // Video Resources
      { title: "Khan Academy Math Courses", url: "https://www.khanacademy.org/math", type: "video" },
      { title: "Professor Leonard Calculus", url: "https://youtu.be/fYyARMqiaag", type: "video" },
      { title: "3Blue1Brown - Essence of Linear Algebra", url: "https://youtu.be/fNk_zzaMoSs", type: "video" },
      
      // Article/Tutorial Resources
      { title: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu/", type: "article" },
      { title: "Wolfram MathWorld", url: "https://mathworld.wolfram.com/", type: "article" },
      { title: "MIT OpenCourseWare Mathematics", url: "https://ocw.mit.edu/courses/mathematics/", type: "article" },
      
      // Interactive Platforms
      { title: "Brilliant Math & Science", url: "https://brilliant.org/courses/", type: "interactive" },
      { title: "Desmos Graphing Calculator", url: "https://www.desmos.com/calculator", type: "interactive" },
      { title: "Photomath - Step by Step Solutions", url: "https://photomath.com/", type: "interactive" }
    ],
    
    React: [
      // Video Resources
      { title: "React Crash Course - Traversy Media", url: "https://youtu.be/w7ejDZ8SWv8", type: "video" },
      { title: "freeCodeCamp React Course", url: "https://youtu.be/bMknfKXIFA8", type: "video" },
      { title: "React Tutorial for Beginners - Programming with Mosh", url: "https://youtu.be/Ke90Tje7VS0", type: "video" },
      
      // Article/Tutorial Resources
      { title: "React Official Documentation", url: "https://react.dev/learn", type: "article" },
      { title: "W3Schools React Tutorial", url: "https://www.w3schools.com/react/", type: "article" },
      { title: "GeeksforGeeks React Tutorial", url: "https://www.geeksforgeeks.org/react-tutorial/", type: "article" },
      
      // Interactive Platforms
      { title: "Codecademy React Course", url: "https://www.codecademy.com/learn/react-101", type: "interactive" },
      { title: "React Challenges on Codewars", url: "https://www.codewars.com/kata/search/react", type: "interactive" },
      { title: "Scrimba React Course", url: "https://scrimba.com/learn/learnreact", type: "interactive" }
    ]
  };

  // Get resources for the subject, or return general resources
  const subjectResources = resourceDatabase[subject] || [
    { title: "Khan Academy - General Learning", url: "https://khanacademy.org", type: "video" },
    { title: "Coursera Free Courses", url: "https://www.coursera.org/courses?query=free", type: "article" },
    { title: "edX Free Courses", url: "https://www.edx.org/", type: "interactive" }
  ];

  // Create YouTube search link for the subject and level
  const youtubeSearchQuery = `${subject} ${level} tutorial`.replace(/\s+/g, '+');
  const youtubeSearchResource = {
    title: `YouTube: ${subject} ${level} Tutorials`,
    url: `https://www.youtube.com/results?search_query=${youtubeSearchQuery}`,
    type: "video"
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