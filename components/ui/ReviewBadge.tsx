'use client';

interface ReviewBadgeProps {
  note?: string;
}

export default function ReviewBadge({ note = 'Pendiente de aprobación' }: ReviewBadgeProps) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed z-[9999] group" style={{ position: 'absolute', top: '10px', right: '10px' }}>
      <div className="w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center cursor-help text-lg shadow-lg animate-pulse">
        ?
      </div>
      <div className="absolute right-0 top-10 bg-yellow-500 text-black text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-body">
        <p className="font-bold mb-1">⚠️ REVISIÓN PENDIENTE</p>
        <p>{note}</p>
      </div>
    </div>
  );
}
