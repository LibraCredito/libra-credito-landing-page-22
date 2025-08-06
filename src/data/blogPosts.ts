export interface BlogPost {
  id?: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  slug: string;
  content: string;
  readTime: number;
  published: boolean;
  featuredPost: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Home Equity: O que é e como conseguir esse tipo de crédito',
    description: 'Guia completo sobre Home Equity - modalidade que permite usar seu imóvel como garantia para obter crédito com melhores condições.',
    category: 'home-equity',
    imageUrl: 'https://placehold.co/600x400?text=Blog+Image',
    slug: 'home-equity-o-que-e-como-conseguir',
    content: '<p>Conteúdo do post Home Equity: como conseguir crédito.</p>',
    readTime: 8,
    published: true,
    featuredPost: true,
    createdAt: '2024-03-25T00:00:00.000Z',
    updatedAt: '2024-03-25T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Home Equity: Guia Completo para Entender a Modalidade de Uma Vez por Todas',
    description: 'Tudo sobre crédito com garantia de imóvel: taxas desde 1,09% a.m., prazos até 15 anos e como funciona.',
    category: 'home-equity',
    imageUrl: 'https://placehold.co/600x400?text=Blog+Image',
    slug: 'home-equity-guia-completo-modalidade',
    content: '<p>Guia completo sobre a modalidade de Home Equity.</p>',
    readTime: 10,
    published: true,
    featuredPost: false,
    createdAt: '2024-03-25T00:00:00.000Z',
    updatedAt: '2024-03-25T00:00:00.000Z'
  }
];

export default BLOG_POSTS;
