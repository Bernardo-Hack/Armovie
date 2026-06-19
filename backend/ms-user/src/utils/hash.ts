import bcrypt from "bcryptjs";

async function generateHash() {
	const password = "bernoca00";
	const hashedPassword = await bcrypt.hash(password, 10);
	console.log(hashedPassword);
}

generateHash();
