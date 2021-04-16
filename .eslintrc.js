module.exports = {
    extends: [
        'eslint:recommended',
        'standard',
    ],
    plugins: [],
    env: {
        browser: true,
        es2020: true,
        node: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    rules: {
        indent: [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'always',
        ],
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
        }],
        'no-multiple-empty-lines': ['error', { max: 2 }],
    },
};
