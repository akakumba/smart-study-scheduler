// .kiro/testFetch.js

const fetchResources = require('./hooks/fetchResources');

(async () => {
  const subject = 'JavaScript'; // You can change this to 'Python' or anything
  const result = await fetchResources({ subject });
  console.log('Result:', JSON.stringify(result, null, 2));
})();