'use strict';

module.exports = {
  forbidden: [
    {
      name: 'no-inter-package-comm',
      comment: "Don't allow relations between code in component packages",
      severity: 'error',
      from: {
        path: '^packages/([^/]+)/.+'
      },
      to: {
        path: '^packages/([^/]+)/.+',
        pathNot: '^packages/$1/.+'
      }
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: ['\\.d\\.ts$', 'jest.config.js', 'dependency-cruiser-config.js', '\\.test\\.(js|ts|jsx|tsx)$', 'tools']
      },
      to: {}
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown']
      }
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true
      }
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: ['npm'],
        moreThanOneDependencyType: true
      }
    },
    {
      name: 'not-to-spec',
      severity: 'error',
      from: {},
      to: {
        path: '\\.test\\.(js|ts|jsx|tsx)$'
      }
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      from: {
        path: 'src/',
        pathNot: ['\\.test\\.(js|ts|jsx|tsx)$', 'infrastructure/src/']
      },
      to: {
        dependencyTypes: ['npm-dev'],
        moreThanOneDependencyType: false,
        pathNot: ['node_modules/@types/', '.d.ts$']
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules|dist/',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg']
    },
    exclude: {
      path: 'dist/'
    },
    moduleSystems: ['cjs', 'es6', 'tsd'],
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig-dc.json'
    },
    preserveSymlinks: false,
    combinedDependencies: true,
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
};
