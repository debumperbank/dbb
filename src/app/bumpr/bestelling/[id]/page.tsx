import { OrderStatus } from "@/components/OrderStatus";
export const metadata = {
  title: "Je bestelling | BUMPR",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ id }, { token = "" }] = await Promise.all([params, searchParams]);
  return (
    <main className="px-5 py-16">
      <OrderStatus id={id} token={token} />
    </main>
  );
}
