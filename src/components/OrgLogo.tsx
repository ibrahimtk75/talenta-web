import { initials, hueFor } from '../data';

export default function OrgLogo({ name, size = 44 }: { name: string; size?: number }) {
  const h = hueFor(name);
  return (
    <div
      className="grid flex-shrink-0 place-items-center rounded-xl font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${h} 68% 52%), hsl(${(h + 42) % 360} 68% 42%))`,
      }}
    >
      {initials(name)}
    </div>
  );
}
