import { prisma } from "@/lib/prisma";
import { OrderForm } from "@/components/admin/order-form";
import { createOrder } from "../actions";

export default async function NewOrderPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true, salePrice: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-black text-white">Novo Pedido</h1>
      <OrderForm action={createOrder} products={products} submitLabel="Criar Pedido" />
    </div>
  );
}
