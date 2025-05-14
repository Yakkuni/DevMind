import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
if (isNaN(SALT_ROUNDS) || SALT_ROUNDS <= 0) {
    throw new Error("SALT_ROUNDS must exist and be a positive number, check your .env file");
}

export class Cryptography {
    static async compareHash(
        senha: string,
        senhaCriptografada: string
    ): Promise<boolean> {
        return await bcrypt.compare(senha, senhaCriptografada);
    }

    static async hash(senha: string): Promise<string> {
        return await bcrypt.hash(senha, SALT_ROUNDS);
    }

}
