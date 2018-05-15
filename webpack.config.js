const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './front-end/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: ['./front-end/index.js', './front-end/styles/main.scss'],
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
				test: /\.css$/,
				use: [
					{
						loader: require.resolve('style-loader'),
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							ident: 'postcss',
							plugins: () => [
								require('postcss-flexbugs-fixes'),
								autoprefixer({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9',
									],
									flexbox: 'no-2009',
								}),
							],
						},
					},
				]
			},
      {
				test: /\.scss$/,
				use: [
					{
						loader: require.resolve('style-loader'),
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: require.resolve('sass-loader'),
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							ident: 'postcss',
							plugins: () => [
								require('postcss-flexbugs-fixes'),
								require('autoprefixer')({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9',
									],
									flexbox: 'no-2009',
								}),
							],
						},
					},
				]
			},
			{
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
  ]
}
