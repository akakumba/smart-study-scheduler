module.exports = async function fetchResources({ topic, learningStyle }) {
  const sampleResults = {
    JavaScript: {
      visual: [
        { title: "JavaScript Crash Course", url: "https://youtu.be/hdI2bqOjy3c" },
        { title: "DOM Manipulation Tutorial", url: "https://youtu.be/0ik6X4DJKCc" }
      ],
      reading: [
        { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
      ]
    }
  };

  return sampleResults[topic]?.[learningStyle] || [];
};