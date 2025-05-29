type patrocinadorProps = {
    id: string;
    nome: string;
    logo: string;
    categoria: string;
    redeSocial: string;
    
}

export class Patrocinador {
        private constructor(readonly props: patrocinadorProps) {}
    
        public static build(nome: string, logo: string, categoria: string, redeSocial: string) {
            const props: patrocinadorProps = {
                id: crypto.randomUUID(),
                nome,
                logo,
                categoria,
                redeSocial
            };
            return new Patrocinador(props);
        }
    
        public static assemble(props: patrocinadorProps) {
            return new Patrocinador(props);
        }
    
        public toJSON() {
            return this.props;
        }
}