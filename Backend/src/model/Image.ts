// src/model/Image.ts

type ImageProps = {
  id: string;              // será atribuído pelo banco (auto increment)
  filename: string;        // nome do arquivo físico
  originalName: string;    // nome original enviado
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
};

export class Image {
    private constructor(private readonly props: ImageProps) {}

    public static build(props: Omit<ImageProps, "id" | "createdAt">) {

        const fullProps: ImageProps = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...props,
        };
        return new Image(fullProps);
    }

    // Monta uma instância “completa”, usada ao ler do banco (que já tem id e createdAt).
    public static assemble(props: ImageProps) {
        return new Image(props);
    }

    // Converte em JSON puro para retornar pela API
    public toJSON() {
        return this.props;
    }

    // Getters (opcionais, caso queira pegar alguma prop isolada)
    public getId() {
        return this.props.id;
    }
    public getFilename() {
        return this.props.filename;
    }
    public getOriginalName() {
        return this.props.originalName;
    }
    public getMimeType() {
        return this.props.mimeType;
    }
    public getSize() {
        return this.props.size;
    }
    public getUrl() {
        return this.props.url;
    }
    public getCreatedAt() {
        return this.props.createdAt;
    }
}
