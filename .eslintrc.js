/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	root: true,
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
			plugins: ["@typescript-eslint"],
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
			],
			rules: {
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-misused-promises": [
					"error",
					{
						checksVoidReturn: false,
					},
				],
			},
		},
	],
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"prettier",
	],
	env: {
		browser: true,
		node: true,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
