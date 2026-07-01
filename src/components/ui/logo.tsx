import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="TITO CRM"
      width={36}
      height={36}
      className={className}
      priority
    />
  );
}
