module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js'],
  testMatch: ['**/*.test.js'],
  moduleDirectories: ['node_modules', 'src'],
}; 