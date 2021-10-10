const i18next = require("i18next");
const middleware = require("i18next-express-middleware");

i18next.use(middleware.LanguageDetector).init({
	backend: {
		loadPath: __dirname + "/locales/{{lng}}/{{ns}}.json",
	},
	debug: false,
	detection: {
		order: ["querystring", "cookie"],
		caches: ["cookie"],
	},
	preload: ["en", "fr"],
	saveMissing: true,
	fallBackLng: ["en"],
});

module.exports = middleware.handle(i18next);
