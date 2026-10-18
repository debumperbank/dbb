import Image from "next/image";
export function BrandLogo({className = "w-56", priority = false, sizes = "(max-width: 639px) 176px, 260px"}: {className?: string; priority?: boolean; sizes?: string}) {
  return <Image src="/brand/de-bumperbank-service.svg" alt="De Bumperbank — Automotive service" width={1600} height={360} priority={priority} sizes={sizes} className={`block h-auto ${className}`} />;
}
