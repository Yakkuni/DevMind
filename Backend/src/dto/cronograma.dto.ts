export interface CreateCronogramaDTO {
    nome: string;
    descricao: string;
    horario: string; // string para facilitar entrada vinda do JSON
    local: string;
    tipo: 'Palestra' | 'Minicurso' | 'Outro';
    conduzidoPor: string;
}

export interface CronogramaDTO extends CreateCronogramaDTO {
    id: string;
}
