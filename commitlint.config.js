module.exports = {
    extends: ['@commitlint/cli', '@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat' /* when adding feature to the project */,
                'fix' /* when fixing some bugs */,
                'docs' /* When adding or editing docs */,
                'style' /* while adding or editing stylesheets like css files */,
                'refactor' /* while making changes to the codebase */,
                'perf' /* while making changes in the codebase for performance purpose */,
                'test' /* while writing test cases for the project */,
                'build' /* when changing in the build files */,
                'ci' /* For making changes on the CI/CD (Continuous Integration/Continuous Development) */,
                'chore' /* While updating some dependencies of the project */,
                'revert' /* When we have written some code mistakenly and we made changes to them */,
            ],
        ],
        'subject-case': [2, 'always', 'sentence-case'],
    },
};
