import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

// DTO para ATUALIZAR um usuário (campos opcionais)
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password?: string;
    
    @IsOptional()
    @IsIn(['admin', 'comum'], { message: 'O cargo deve ser "admin" ou "comum".' })
    cargo?: 'admin' | 'comum';
}

// DTO para CRIAR um novo usuário (campos obrigatórios)
export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    @IsString()
    nome: string | undefined;

    @IsNotEmpty({ message: 'O email não pode ser vazio.' })
    @IsEmail({}, { message: 'O email fornecido não é válido.' })
    email: string | undefined;

    @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string | undefined;

    @IsNotEmpty({ message: 'O cargo não pode ser vazio.' })
    @IsIn(['admin', 'comum'], { message: 'O cargo deve ser "admin" ou "comum".' })
    cargo: 'admin' | 'comum' | undefined;
}