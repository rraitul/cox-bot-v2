const express = require('express')
const fs = require('node:fs');
const { config } = require('../../utility/utility');
const servers = config().servers

const app = express();
const PORT = servers.cox_server.tickets.logs.port;
const IP_ADDRESS = servers.cox_server.tickets.logs.ip;

app.get('/', (req, res) => {
	res.redirect('/events/ticket/logs');
});

app.get('/events/ticket/logs', (req, res) => {
	fs.readdir('./events/ticket/logs', (err, files) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading directory');
			return;
		}
		const links = files.map(file => `<a href="/events/tickets/logs/${file}">${file}</a>`);
		res.send(links.join('<br>'));
	});
});

app.get('/events/ticket/logs/:filename', (req, res) => {
	const filename = req.params.filename;
	fs.readFile(`./events/tickets/logs/${filename}`, 'utf-8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading file');
			return;
		}
		res.send(`<pre>${data}</pre>`);
	});
});

app.listen(PORT, IP_ADDRESS, () => {
	console.log(`Server running on http://${IP_ADDRESS}:${PORT}`);
});