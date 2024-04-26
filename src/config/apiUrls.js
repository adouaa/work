const config = { };

const testConfig = { };


// Global variables passed from the CORE PROGRAM
const urls = typeof window !== "undefined" && window['NODE_ENV'] && window['NODE_ENV'] === 'production'
? config 
: testConfig;

// node & browser
module.exports = urls;

