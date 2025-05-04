export interface CreatePalestranteDTO {
    nome: string;
    descricao: string;
    foto: string;
    instagram?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
    site?: string | null;
  }
  
  
  export interface PalestranteDTO {
    id: string;
    nome: string;
    descricao: string;
    foto: string;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    site: string | null;
  }
  