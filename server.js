import http from 'http';
import fs from 'fs/promises';
import mime from 'mime';
import url from 'url';
import path from 'path';

const port = 8080;
const currentDirectory = './directory';

const handleError = (res, statusCode, message, mimeType) => {
	res.writeHead(statusCode, { 'Content-Type': mimeType || 'text/plain' });
	res.end(message);
};

const handleGet = async (filePath, mimeType, res) => {
	const stats = await fs.stat(filePath);
	if (stats.isDirectory()) {
		const files = await fs.readdir(filePath);
		handleError(res, 200, files.join('\n'));
	} else {
		const file = await fs.readFile(filePath, 'utf-8');
		handleError(res, 200, file, mimeType);
	}
};

const handlePut = async (filePath, req, res) => {
	let inputData = '';
	req.on('data', (chunk) => inputData += chunk);
	req.on('end', async () => {
		try {
			const dirPath = path.dirname(filePath);
			await fs.mkdir(dirPath, { recursive: true });
			await fs.writeFile(filePath, inputData);
			const mimeType = mime.getType(filePath);
			handleError(res, 201, 'File created', mimeType);
		} catch (err) {
			handleError(res, 500, `Internal Server Error: ${err.message}`);
		}
	});
};

const handleDelete = async (filePath, res) => {
	const deleteStats = await fs.stat(filePath);
	if (deleteStats.isDirectory()) {
		if (filePath === path.join(currentDirectory, '/')) {
			return handleError(res, 400, 'Bad request');
		} else {
			await fs.rm(filePath, { recursive: true });
		}
	} else {
		await fs.unlink(filePath);
	}
	handleError(res, 204, 'No content');
};

const httpServer = http.createServer(async (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const filePath = path.join(currentDirectory, parsedUrl.pathname);
	const mimeType = mime.getType(parsedUrl.pathname);
	try {
		switch (req.method) {
			case 'GET':
				try {
					await handleGet(filePath, mimeType, res);
				} catch (err) {
					handleError(res, 404, 'Resource not found');
				}
				break;
			case 'PUT':
				if (mimeType === null) {
					await fs.mkdir(filePath, { recursive: true });
					handleError(res, 201, 'Directory created');
				} else {
					await handlePut(filePath, req, res);
				}
				break;
			case 'DELETE':
				try {
					await handleDelete(filePath, res);
				} catch (err) {
					handleError(res, 404, 'Resource not found');
				}
				break;
			default:
				handleError(res, 405, 'Method not allowed');
		}
	} catch (err) {
		handleError(res, 500, `Internal Server Error: ${err.message}`);
	}
}).listen(port, () => {
	console.log(`Server is running at http://localhost:${port}/`);
});