module.exports = {
    root: true,
    parser: 'typescript-eslint-parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true
        }
    },
    env: {
        browser: true,
        es6: true,
        jquery: true,
        jasmine: true
    },
    settings: {
        react: { version: 'latest' },
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    // We are using eslint's recommended rules (the ones with the check mark in the link)
    // plus some more we find out useful. Please read and refer to http://eslint.org/docs/rules/ for more info.
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:react/recommended'
    ],
    plugins: ['typescript'],
    rules  : {
        // Possible Errors (most of the recommended rules sit here)
        'no-extra-boolean-cast'    : ['off'], // disallow unnecessary boolean casts (it's one of the recommends). It's off because needs pair programming
        // Best Practices
        'curly'                    : ['error', 'all'], // enforce consistent brace style for all control statements
        'eqeqeq'                   : ['error', 'always'], // require the use of === and !== . It's off because needs pair programming
        'no-alert'                 : ['error'], // disallow the use of alert, confirm, and prompt
        'no-magic-numbers'         : ['off'], // disallow magic numbers
        'no-multi-spaces'          : ['error'], // disallow multiple spaces
        'no-multi-str'             : ['error'], // disallow multiline strings
        'yoda'                     : ['error'], // disallow “Yoda” conditions
        // Variables
        // Stylistic Issues
        'array-bracket-spacing'    : ['error', 'always', { 'objectsInArrays': false, 'arraysInArrays': false, 'singleValue': false }], // enforce consistent spacing inside array brackets
        'block-spacing'            : ['error'], // enforce consistent spacing inside single-line block
        'brace-style'              : ['error', '1tbs', { 'allowSingleLine': true }], // enforce consistent brace style for blocks
        'comma-spacing'            : ['error'], // enforce consistent spacing before and after commas (only after allowed)
        'comma-style'              : ['error'], // enforce consistent comma style
        'computed-property-spacing': ['error'], // enforce consistent spacing inside computed property brackets
        'indent'                   : ['error', 'tab', { 'SwitchCase': 1 }],  // enforce consistent indentation
        'key-spacing'              : ['error', { 'beforeColon': false, 'afterColon': true, 'align': 'colon' }], // enforce consistent spacing between keys and values in object literal properties
        'linebreak-style'          : ['error', 'unix'], // enforce consistent linebreak style
        'new-cap'                  : ['error'], // require constructor function names to begin with a capital letter
        'newline-after-var'        : ['error'], //require an empty line after var declarations
        'newline-before-return'    : ['error'], // require an empty line before return statements
        'newline-per-chained-call' : ['warn', { 'ignoreChainWithDepth': 3 }], // require a newline after each call in a method chain
        'no-bitwise'               : ['error', { 'allow': ['~'] } ], // disallow bitwise operators, but not ~
        'no-multiple-empty-lines'  : ['error', { 'max': 1 } ], // disallow multiple empty lines
        'object-curly-newline'     : ['error', {'ObjectExpression': { 'multiline': true, 'minProperties': 2 }, 'ObjectPattern': { 'multiline': true, 'minProperties': 2 }, 'ImportDeclaration': { 'multiline': true, 'minProperties': 2 }, 'ExportDeclaration': { 'multiline': true, 'minProperties': 2 }}], // enforce consistent line breaks inside braces
        'object-curly-spacing'     : ['error', 'always', { 'objectsInObjects': false, 'arraysInObjects': false }], // enforce consistent spacing inside braces
        'quotes'                   : ['error', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }], // enforce consistent use of single quotes
        'require-jsdoc'            : ['error', { 'require': { 'FunctionDeclaration': false, 'MethodDefinition': false, 'ClassDeclaration': false } }], // require JSDoc comments
        'semi'                     : ['error', 'always'], // enforce the use of semicolons
        'spaced-comment'           : ['error', 'always', { 'exceptions': ['*'] }], // enforce consistent spacing after the // or /* in a comment
        'complexity'               : ['error', 14], // limit the cyclomatic complexity (number of linearly independent paths),
        /* ES6 relevant */
        'jsx-quotes'               : ['error', 'prefer-single'],
        'no-var'                   : ['error'],
        'prefer-const'             : ['error', { 'destructuring': 'any', 'ignoreReadBeforeAssign': false }],
        'no-useless-constructor'   : ['error'],
        'prefer-template'          : ['error'],
        'arrow-parens'             : ['error', 'always', { 'requireForBlockBody': true }],
        'arrow-spacing'            : ['error'],
        'object-shorthand'         : ['error', 'methods'],
        'import/order'             : ['error', {'groups': [['builtin', 'external'], ['parent', 'sibling', 'internal'], 'index'], 'newlines-between': 'always'}],
        'import/named'             : ['never'],
        'template-curly-spacing'   : ['error', 'never'],
        'rest-spread-spacing'      : ['error'],
        'prefer-spread'            : ['error'],
        'prefer-rest-params'       : ['error'],
    },
    globals: {
        module   : false,
        require  : false,
        __dirname: false,
        ga       : false,
        exports  : false,
        process  : false,
        Buffer   : false
    },
    overrides: {
        files: ['**/*.ts', '**/*.tsx'],
        parser: 'typescript-eslint-parser',
        rules: {
            'no-undef': 'off',
            'no-unused-vars': 'off'
        }
    }
};
