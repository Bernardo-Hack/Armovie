const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";

function timestamp() {
	return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export const logger = {
	info: (msg: string) =>
		console.log(
			`${GREEN}[INFO]${RESET} ${timestamp()} ${CYAN}${msg}${RESET}`,
		),
	warn: (msg: string) =>
		console.warn(`${YELLOW}[WARN]${RESET} ${timestamp()} ${msg}`),
	error: (msg: string) =>
		console.error(`${RED}[ERROR]${RESET} ${timestamp()} ${msg}`),
};
