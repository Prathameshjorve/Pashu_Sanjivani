export default function Step({
  title,
  active = false,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${active ? "opacity-100" : "opacity-40"}`}>
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
        ${active ? "bg-white text-green-600" : "bg-green-400 text-white"}`}
      >
        ✓
      </div>

      <span className="font-medium">{title}</span>
    </div>
  );
}
