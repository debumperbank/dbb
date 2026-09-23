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
      src="/logo-header.png"
      alt="De Bumperbank"
      width={1316}
      height={650}
      priority={priority}
      sizes="(max-width: 768px) 210px, 250px"
      className={`block h-auto object-contain ${className}`}
    />
  );
}
