const config = {
  // preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transformIgnorePatterns: [
    'node_modules/(?!(unist-util-visit|unist-util-is|mdast-util-to-string|mdast-util-from-markdown|micromark|parse-entities|character-entities|unist-util-stringify-position))',
  ],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.spec.js'],
};

export default config;
