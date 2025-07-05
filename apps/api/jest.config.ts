import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: false,
      tsconfig: './apps/api/tsconfig.json',
    }],
  },
moduleNameMapper: {
  '^@/src/(.*)$': '<rootDir>/src/$1',
  '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  '^@/(.*)$': '<rootDir>/src/$1',
  '^src/(.*)$': '<rootDir>/src/$1', // ← adiciona suporte se você usar `src/...`
},
  testMatch: ['**/*.spec.ts'],
};

export default config;
