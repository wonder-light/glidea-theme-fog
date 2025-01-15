module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    /*require('cssnano')({
      preset: 'default',
      autoprefixer: false, // 如果你已经有了autoprefixer，则不需要在这里再次包含
      plugins: {
        'postcss-unique-selectors': true, // 启用去重插件
      },
    }),*/
  ],
}