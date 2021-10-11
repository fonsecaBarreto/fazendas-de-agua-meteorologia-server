

module.exports = {
 

  testTimeout: 90000,
  
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  transform: {
    '.+\\.ts$': 'ts-jest'
  }

};
