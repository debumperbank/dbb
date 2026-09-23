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
      width={1316}
      height={792}
      priority={priority}
      sizes="(max-width: 768px) 215px, 300px"
      className={`block h-auto object-contain ${className}`}
    />
  );
}
