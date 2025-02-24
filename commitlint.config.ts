import type { UserConfig } from '@commitlint/types';

const Config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'revert']],
        'subject-case': [0],
    },
};

module.exports = Config;