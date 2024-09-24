export default [
	{ 
		languageOptions: { 
			ecmaVersion: 2023
		}
 	},
	{
		rules: {
			'no-var': 'error',
			'capitalized-comments': 'error',
			'no-inline-comments': 'error',
			'multiline-comment-style': ['error', 'starred-block'],
			'max-len': ['error', { code: 120, tabWidth: 4 }],
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'brace-style': ['error', '1tbs', { allowSingleLine: false }],
			'keyword-spacing': ['error', { before: true, after: true }],
			'object-curly-spacing': ['error', 'always'],
			'comma-dangle': ['error', 'never'],
			'dot-notation': ['error', { allowKeywords: false }],
			'eqeqeq': 'error',
			'prefer-const': 'error',
			'no-prototype-builtins': 'off',
			'curly': 'error',
			'linebreak-style': ['error', 'unix'],
			'semi': ['error', 'always'],
			'space-before-blocks': ['error', 'always'],
			'space-in-parens': ['error', 'never'],
			'comma-spacing': ['error', { before: false, after: true }],
			'arrow-spacing': ['error', { 'before': true, 'after': true }],
			'no-empty': 'error',
			'space-infix-ops': 'error'
		},
		ignores: ['node_modules/']
	}
];