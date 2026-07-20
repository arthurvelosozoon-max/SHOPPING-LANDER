import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sl-red/60 bg-sl-black-soft sl-red-glow">
        <span className="text-sl-red font-black text-lg leading-none">S</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-wide text-sl-white">
          SHOPPING <span className="text-sl-red sl-glow-text">LANDER</span>
        </span>
      </span>
    </Link>
  );
}
