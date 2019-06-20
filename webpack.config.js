const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const DEV_DIR = path.resolve(__dirname, 'dev');
const DIST_DIR = path.resolve(__dirname, 'dist');
const JS_DEV_DIR = path.resolve(DEV_DIR, 'js');

const config = {
	entry : `${JS_DEV_DIR}/app.ts`,
	output: {
		path    : DIST_DIR,
		filename: 'bundle.js'
	},
	resolve: { extensions: [ '.js', '.jsx', '.ts', '.tsx' ]},
	plugins: [
		new StyleLintPlugin({
			files      : '**/*.scss',
			configFile : 'stylelint.config.js',
			failOnError: true
		})
	],
	module: {
		rules: [
			{
				enforce: 'pre',
				test   : /\.jsx?|.tsx?/,
				include: JS_DEV_DIR,
				loader : 'eslint-loader',
				options: { failOnError: false }
			},
			{
				test   : /\.tsx?$/,
				include: JS_DEV_DIR,
				loader : 'ts-loader'
			},
			{
				test   : /\.jsx?/,
				include: JS_DEV_DIR,
				loader : 'babel-loader',
				options: { presets: [ '@babel/preset-env', '@babel/preset-react' ]}
			},
			{
				test   : /\.(png|jpg|gif|ico)$/,
				loader : 'url-loader',
				options: { limit: 200000 } // 200 KB
			},
			{
				test: /.scss$/,
				use : [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	devServer: { publicPath: '/dist/' }
};

module.exports = config;
