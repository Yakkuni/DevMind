// utils/seedAdmin.ts
import { UsuarioDao } from "../dao/usuario.dao";
import { Usuario } from "../model/Usuario";
import { Cryptography } from "./cryptography";

export async function seedAdmin() {
    const dao = new UsuarioDao();
    const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const adminSenha = process.env.ADMIN_PASSWORD || "admin123";


    const existente = await dao.findByEmail(adminEmail);
    if (!existente) {
        const senhaCriptografada = await Cryptography.hash(adminSenha);
        const admin = Usuario.build("Administrador", adminEmail, "admin", senhaCriptografada);
        await dao.create(admin);
        console.log("Usuário admin criado com sucesso.");
    } else {
        console.log("Usuário admin já existe.");
    }
}
