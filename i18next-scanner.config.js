module.exports = {
    options: {
	removeUnusedKeys: true,
        debug: true,
        lngs: ['en','de','es','fr','it','pt'],
        defaultLng: 'en',
	func: {
		list: ['t'],
		extensions: ['.js','.jsx']
	},
        resource: {
            loadPath: 'src/lib/components/locales/{{lng}}/{{ns}}.json',
            savePath: 'src/lib/components/locales/{{lng}}/{{ns}}.json',
            jsonIndent: 4,
            lineEnding: '\n'
        },
    }
};
