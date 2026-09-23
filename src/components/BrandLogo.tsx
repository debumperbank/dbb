import Image from "next/image";
export function BrandLogo({
  className = "w-40",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="De Bumperbank"
      width={360}
      height={360}
      priority={priority}
      sizes="(max-width: 768px) 160px, 400px"
      className={`block h-auto object-contain ${className}`}
    />
  );
}
