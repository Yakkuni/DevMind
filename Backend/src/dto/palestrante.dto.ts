import { IsString, IsNotEmpty } from 'class-validator';
export interface CreatePalestranteDTO {
    nome: string;
    descricao: string;
    foto: string;
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    site?: string | null;
  }
  

  
  export class PalestranteDTO {
      @IsNotEmpty()
      @IsString()  
      id!: string;

      @IsNotEmpty()
      @IsString()
      nome!: string;
      
      @IsString()
      @IsNotEmpty()
      descricao!: string;
      
      @IsNotEmpty()
      @IsString()
      foto!: string;

      instagram!: string | null;
      linkedin!: string | null;
      youtube!: string | null;
      site!: string | null;
  }
  