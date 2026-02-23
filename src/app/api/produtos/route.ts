import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Product = {
  nome: string;
  referencia: string;
  codigo: string;
  codigo_categoria: string;
  descricao: string;
  preco: number;
  imagem: string;
};

type PaginatedProductsResponse = {
  items: Product[];
  nextPage: number | null;
  hasMore: boolean;
};

const data: Product[] = [
  {
    codigo: "0001",
    nome: "Air Fryer Mondial AF-30",
    referencia: "MOND-AF30-3L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 229.9,
    descricao: "Air Fryer Mondial AF-30 3,5L 1400W Preta com Timer 60min",
  },
  {
    codigo: "0002",
    nome: "Air Fryer Philco Gourmet PFR15",
    referencia: "PHIL-PFR15-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 279.99,
    descricao: "Air Fryer Philco Gourmet 4L 1500W Preta Antiaderente",
  },
  {
    codigo: "0003",
    nome: "Air Fryer Britânia BFR21",
    referencia: "BRIT-BFR21-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 259.9,
    descricao:
      "Air Fryer Britânia BFR21 4L 1500W Preta com Controle de Temperatura",
  },
  {
    codigo: "0004",
    nome: "Air Fryer Arno Easy Fry",
    referencia: "ARNO-EF4L-127V",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 319.9,
    descricao: "Air Fryer Arno Easy Fry 4,2L 1500W Preta 127V",
  },
  {
    codigo: "0005",
    nome: "Air Fryer Electrolux EAF30",
    referencia: "ELEC-EAF30-5L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 349.9,
    descricao: "Air Fryer Electrolux EAF30 5L 1700W Preta com Painel Digital",
  },
  {
    codigo: "0006",
    nome: "Air Fryer Midea FRA42",
    referencia: "MIDE-FRA42-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 289.9,
    descricao: "Air Fryer Midea FRA42 4L 1500W Preta com 8 Funções",
  },
  {
    codigo: "0007",
    nome: "Air Fryer Oster OFRT520",
    referencia: "OSTR-520-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 369.9,
    descricao: "Air Fryer Oster OFRT520 4,6L 1500W Inox com Timer",
  },
  {
    codigo: "0008",
    nome: "Air Fryer Cadence Super Light",
    referencia: "CAD-SL25-3L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 219.9,
    descricao: "Air Fryer Cadence Super Light 3L 1250W Preta",
  },
  {
    codigo: "0009",
    nome: "Air Fryer Philips Walita Viva",
    referencia: "PHW-VIVA-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 799.9,
    descricao: "Air Fryer Philips Walita Viva Collection 4,1L 1400W Preta",
  },
  {
    codigo: "0010",
    nome: "Air Fryer Multilaser CE083",
    referencia: "MULT-CE083-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 239.9,
    descricao: "Air Fryer Multilaser CE083 4L 1500W Preta",
  },

  // 11 - 50

  {
    codigo: "0011",
    nome: "Air Fryer Mondial Family IV",
    referencia: "MOND-FAM4-5L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 329.9,
    descricao: "Air Fryer Mondial Family IV 5L 1500W Preta",
  },
  {
    codigo: "0012",
    nome: "Air Fryer Philco Oven 12L",
    referencia: "PHIL-OV12L-1800W",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 499.9,
    descricao: "Air Fryer Philco Oven 12L 1800W Preto com Função Forno",
  },
  {
    codigo: "0013",
    nome: "Air Fryer Britânia Bella Cuccina",
    referencia: "BRIT-BELLA-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 274.9,
    descricao: "Air Fryer Britânia Bella Cuccina 4L 1500W Preta",
  },
  {
    codigo: "0014",
    nome: "Air Fryer Arno Ultra",
    referencia: "ARNO-ULTRA-5L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 389.9,
    descricao: "Air Fryer Arno Ultra 5L 1700W Preta Digital",
  },
  {
    codigo: "0015",
    nome: "Air Fryer Electrolux Experience",
    referencia: "ELEC-EXP-4L",
    codigo_categoria: "22",
    imagem: "/lanterna.jpeg",
    preco: 359.9,
    descricao: "Air Fryer Electrolux Experience 4L 1400W Preta",
  },

  // Gerando até 50 mantendo padrão realista

  ...Array.from({ length: 35 }, (_, i) => {
    const index = i + 16;
    return {
      codigo: index.toString().padStart(4, "0"),
      nome: `Air Fryer Modelo Premium ${index}`,
      referencia: `PREM-${index}-4L-1500W`,
      codigo_categoria: "22",
      imagem: "/lanterna.jpeg",
      preco: Number((220 + Math.random() * 600).toFixed(2)),
      descricao: `Air Fryer Modelo Premium ${index} 4L 1500W Preta com Controle de Temperatura`,
    };
  }),
];

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const items = Array.isArray(data) ? data : Array.isArray(data) ? data : [];

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;
  const pagedItems = items.slice(start, end);
  const hasMore = end < items.length;

  const result: PaginatedProductsResponse = {
    items: pagedItems,
    nextPage: hasMore ? safePage + 1 : null,
    hasMore,
  };

  return NextResponse.json(result);
}
