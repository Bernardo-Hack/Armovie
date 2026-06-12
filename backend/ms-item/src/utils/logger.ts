function timestamp(): string {
	return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function line(level: string, msg: string): string {
	return `${timestamp()}  ${level.padEnd(5)}  [${process.env.MS_NAME}]  ${msg}`;
}

export const logger = {
	info: (msg: string) => console.log(line("INFO", msg)),
	warn: (msg: string) => console.warn(line("WARN", msg)),
	error: (msg: string) => console.error(line("ERROR", msg)),
};
