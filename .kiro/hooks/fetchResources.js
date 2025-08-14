// .kiro/hooks/fetchResources.js

module.exports = async function fetchResources({ subject }) {
  console.log('Fetching resources for subject:', subject);

  const sampleResults = {
    JavaScript: [
      {
        title: 'JavaScript for Beginners',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
        description: 'An introductory guide from MDN.'
      },
      {
        title: 'JavaScript Course - freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Interactive JS curriculum.'
      },
      {
        title: 'JavaScript.info',
        url: 'https://javascript.info/',
        description: 'Deep dive into modern JS concepts.'
      }
    ],
    Python: [
      {
        title: "Intro to Python – FreeCodeCamp",
        url: "https://youtu.be/rfscVS0vtbw",
        description: "Great intro video"
      },
      {
        title: "Python Functions – W3Schools",
        url: "https://www.w3schools.com/python/python_functions.asp",
        description: "Beginner-friendly explanation"
      }
    ]
  };

  return {
    resources: sampleResults[subject] || [
      {
        title: "Khan Academy – General Resources",
        url: "https://khanacademy.org",
        description: "Fallback educational content"
      }
    ]
  };
};
