module.exports = {
  devServer: {
    host: 'localhost',
  },
  // Packages whose published code uses syntax webpack 4 can't parse
  "transpileDependencies": [
    "vuetify"
  ]
}
