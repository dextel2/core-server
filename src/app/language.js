const i18next = require("i18next");
const i18nextMiddleware = require("i18next-express-middleware");
const Backend = require("i18next-node-fs-backend");

i18next
	.use(i18nextMiddleware.LanguageDetector)
	.use(Backend)
	.init({
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

module.exports = i18nextMiddleware.handle(i18next);
