import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Shopping Lander"
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover sl-red-glow"
        priority
      />
      <span className="flex items-center gap-2 text-lg font-black tracking-wide text-sl-white leading-none">
        <Image
          src="/paraguay-flag.png"
          alt="Paraguai"
          width={24}
          height={16}
          className="h-4 w-6 rounded-sm object-cover"
        />
        SHOPPING <span className="text-sl-red sl-glow-text">LANDER</span>
      </span>
    </Link>
  );
}
