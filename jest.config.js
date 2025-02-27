module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'nodes/**/*.ts',
    '\!nodes/**/*.d.ts',
    '\!nodes/**/index.ts',
    '\!nodes/**/*.test.ts',
    '\!nodes/**/*.spec.ts',
  ],
  coverageReporters: ['text', 'lcov', 'clover'],
  moduleNameMapper: {
    '^n8n-workflow$': '<rootDir>/node_modules/n8n-workflow',
    '^n8n-core$': '<rootDir>/node_modules/n8n-core',
  },
};
