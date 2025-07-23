// .kiro/hooks/fetchResources.js

module.exports = async function fetchResources({ subject }) {
  const sampleResults = {
    JavaScript: [
      { title: "JavaScript Crash Course", url: "https://youtu.be/hdI2bqOjy3c" },
      { title: "DOM Manipulation Tutorial", url: "https://youtu.be/0ik6X4DJKCc" },
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
    ],
    Python: [
      { title: "Intro to Python – FreeCodeCamp", url: "https://youtu.be/rfscVS0vtbw" },
      { title: "Python Functions – W3Schools", url: "https://www.w3schools.com/python/python_functions.asp" }
    ]
  };

  return {
    resources: sampleResults[subject] || [
      { title: "Khan Academy – General Resources", url: "https://khanacademy.org" }
    ]
  };
};