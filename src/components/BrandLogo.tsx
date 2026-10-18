import Image from "next/image";
export function BrandLogo({className = "w-56", priority = false, sizes = "(max-width: 359px) 188px, (max-width: 639px) 230px, (max-width: 1023px) 260px, 280px"}: {className?: string; priority?: boolean; sizes?: string}) {
  return <span className={`relative block overflow-hidden aspect-[2172/410] ${className}`}>
    <Image src="/brand/de-bumperbank-webshop.png" alt="De Bumperbank — Automotive webshop" width={2172} height={724} priority={priority} sizes={sizes} className="absolute left-0 top-1/2 block h-auto w-full -translate-y-1/2" />
  </span>;
}
