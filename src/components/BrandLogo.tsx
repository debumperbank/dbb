import Image from "next/image";

export function BrandLogo({
  className = "w-40",
  priority = false,
  sizes = "(max-width: 359px) 80px, (max-width: 639px) 112px, (max-width: 1023px) 208px, (max-width: 1535px) 238px, 180px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src="/logo-header.png"
      alt="De Bumperbank"
      width={1316}
      height={650}
      priority={priority}
      sizes={sizes}
      className={`block h-auto object-contain ${className}`}
    />
  );
}
