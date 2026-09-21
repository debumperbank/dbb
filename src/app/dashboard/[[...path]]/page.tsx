import { redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const aliases: Record<string, string> = {
    agenda: "appointments",
    klanten: "customers",
    voertuigen: "vehicles",
    werkorders: "work-orders",
    occasions: "listings",
    inkoop: "trade-ins",
  };
  redirect(
    "/admin/" +
      path
        .map((part, i) =>
          encodeURIComponent(i === 0 ? aliases[part] || part : part),
        )
        .join("/"),
  );
}
