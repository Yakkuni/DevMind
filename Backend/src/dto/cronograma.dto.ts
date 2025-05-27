export interface CreateCronogramaDTO {
    nome: string;
    descricao: string;
    horario: string; 
    local: string;
    tipo: string;
    conduzidoPor: string;
}

export interface CronogramaDTO extends CreateCronogramaDTO {
    id: string;
}
