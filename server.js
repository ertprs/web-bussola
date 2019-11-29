const express = require('express');

const app = express();

const path = require('path');

const compression = require('compression');

const zlib = require('zlib');

const fs = require('fs');
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file

require('dotenv').config();

function getEnvironmentVariable(key, _default = '') {
	return process.env[key] || _default;
}

const envConfigFile = {
	production: true,
	oauthBaseUrl: getEnvironmentVariable('API_OAUTH_SERVICE'),
	appApi: getEnvironmentVariable('APP_API'),
	storageUrl: getEnvironmentVariable('STORAGE_URL'),
	oauthClientId: getEnvironmentVariable('CLIENT_ID'),
	applicationId: getEnvironmentVariable('APPLICATION_ID')
};

fs.writeFile(
	`./dist/assets/data/appConfig.json`,
	JSON.stringify(envConfigFile),
	err => {
		if (err) {
			console.log(err);
		}
	}
);

app.use(express.static(__dirname + '/dist/bussola-pwa'));

app.disable('etag');

app.use(compression(zlib.Z_BEST_COMPRESSION));

app.listen(process.env.PORT || 4200);

// redirect traffic to index.html

app.get('*', function(req, res) {
	const index = __dirname + '/dist/bussola-pwa/index.html';
	res.sendFile(path.join(index));
});
