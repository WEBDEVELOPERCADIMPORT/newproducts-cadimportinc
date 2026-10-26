export interface CompetidorDirecto {
  image: string;
  nombre: string;
  precio: string;
}

export interface ProductProposal {
  id: string;
  slug: string;
  image: string;
  tamao: string;
  procedencia: string;
  ingredientes: string[];
  minimo_compra: string;
  tiempo_de_vida: string;
  certificaciones: string;
  clase_categoria: string;
  margen_sugerido: string;
  cajas_por_paleta: string;
  cajas_por_unidad: string;
  rotacion_esperada: string;
  proveedor_fabricante: string;
  competidores_directos: CompetidorDirecto[];
  nivel_de_inversion_inicia: string;
  nombre_marca_del_producto: string;
  precio_sugerido_cajaunidad: string;
  precio_de_compra_al_proveedor: string;
  tiempo_de_produccin_entrega_estimado: string;
}

export interface NewProductsData {
  products: {
    es: ProductProposal[];
    en: ProductProposal[];
  };
}
