const http = require("http");
const fs = require("fs");
const path = require("path");
const queryString = require("querystring");
const GET = "GET";
const POST = "POST";

const PORT = process.env.port||80

const headers = {
	"Access-Control-Allow-Origin": "*",
};

const arraydb = [
	{ type: "autoplay", result: 30 },
	{ type: "single", result: 30 },
	{ type: "versus", result: 30 },
];
const loadResult = async (pathUrl) => {
	const data = fs.readFileSync(pathUrl, "utf-8");
	return data;
};

const writeResult = async (pathUrl, obj) => {
	const data = fs.writeFileSync(pathUrl, JSON.stringify(obj));
	return data;
};

http
	.createServer(async (req, res) => {
		const pathUrl = path.join("db", `${req.url}.json`);
		let readReq;
		if (req.method === GET) {
			const pathUrl = path.join("db", `${req.url}.json`);
			console.log(pathUrl);
			readReq = await loadResult(pathUrl);
			console.log("ответ отправляется");
			res.writeHead(200, headers);
			res.end(readReq);
		}

		if (req.method === POST) {
			console.log("куку");
			let body = "";
			let result;
			req.on("data", (chunk) => (body += chunk.toString()));
			req.on("end", async () => {
				await writeResult(pathUrl,JSON.parse(body));
				res.writeHead(200, headers);
				res.end(result);
			});
		}
		if (req.method === "OPTIONS") {
			res.header({
				"Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
			});
			res.send();
		}
	})
	.listen(PORT, () => {
		console.log("сервер запущен");
	});
