import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = [
    { name: "Arthur Veloso", email: "arthurveloso1225@gmail.com", password: "Oli@@2026" },
    { name: "Luiz Marques", email: "luizhmarques26@yahoo.com", password: "shopping@2025" },
  ];

  for (const admin of admins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { password: passwordHash, role: "ADMIN" },
      create: {
        name: admin.name,
        email: admin.email,
        password: passwordHash,
        role: "ADMIN",
      },
    });
  }

  const categories = await Promise.all(
    [
      { name: "Suplementos", slug: "suplementos" },
      { name: "Roupas Fitness", slug: "roupas-fitness" },
      { name: "Acessórios", slug: "acessorios" },
      { name: "Eletrônicos", slug: "eletronicos" },
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c }))
  );

  const brands = await Promise.all(
    [
      { name: "MaxPower", slug: "maxpower" },
      { name: "IronGear", slug: "irongear" },
      { name: "VoltTech", slug: "volttech" },
    ].map((b) => prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: b }))
  );

  const products = [
    {
      name: "Whey Protein Isolado 900g",
      slug: "whey-protein-isolado-900g",
      sku: "SL-WP-900",
      description: "Whey protein isolado de alta pureza, absorção rápida, sabor chocolate.",
      price: 189.9,
      salePrice: 159.9,
      stock: 42,
      categorySlug: "suplementos",
      brandSlug: "maxpower",
      featured: true,
    },
    {
      name: "Camiseta Dry-Fit Performance",
      slug: "camiseta-dry-fit-performance",
      sku: "SL-CM-001",
      description: "Camiseta esportiva com tecnologia dry-fit para alta performance.",
      price: 89.9,
      salePrice: null,
      stock: 120,
      categorySlug: "roupas-fitness",
      brandSlug: "irongear",
      featured: true,
    },
    {
      name: "Luvas de Treino Pro Grip",
      slug: "luvas-de-treino-pro-grip",
      sku: "SL-LV-010",
      description: "Luvas com aderência reforçada para levantamento de peso.",
      price: 69.9,
      salePrice: 54.9,
      stock: 75,
      categorySlug: "acessorios",
      brandSlug: "irongear",
      featured: false,
    },
    {
      name: "Fone Bluetooth Sport X3",
      slug: "fone-bluetooth-sport-x3",
      sku: "SL-FN-003",
      description: "Fone de ouvido sem fio resistente ao suor, ideal para treinos.",
      price: 249.9,
      salePrice: 199.9,
      stock: 30,
      categorySlug: "eletronicos",
      brandSlug: "volttech",
      featured: true,
    },
    {
      name: "Coqueteleira Premium 700ml",
      slug: "coqueteleira-premium-700ml",
      sku: "SL-CQ-007",
      description: "Coqueteleira com misturador de aço inox e compartimento extra.",
      price: 39.9,
      salePrice: null,
      stock: 200,
      categorySlug: "acessorios",
      brandSlug: "maxpower",
      featured: false,
    },
    {
      name: "Creatina Monohidratada 300g",
      slug: "creatina-monohidratada-300g",
      sku: "SL-CR-300",
      description: "Creatina pura monohidratada, 100% pura, sem sabor.",
      price: 79.9,
      salePrice: 69.9,
      stock: 88,
      categorySlug: "suplementos",
      brandSlug: "maxpower",
      featured: true,
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug)!;
    const brand = brands.find((b) => b.slug === p.brandSlug)!;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice ?? undefined,
        stock: p.stock,
        featured: p.featured,
        categoryId: category.id,
        brandId: brand.id,
        images: {
          create: [{ url: "/placeholder-product.svg", position: 0 }],
        },
      },
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
