const config = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transformIgnorePatterns: [
    'node_modules/(?!(unist-util-visit|unist-util-is|mdast-util-to-string|mdast-util-from-markdown|micromark|parse-entities|character-entities|unist-util-stringify-position))',
  ],

  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>'],
  // testRegex: '.e2e-spec.ts$',
  testMatch: ['**/*.spec.ts', '**/*.spec.js'],

  // setupFiles: ['<rootDir>/src/preRun.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

export default config;
