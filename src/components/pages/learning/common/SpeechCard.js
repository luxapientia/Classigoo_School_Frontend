'use client';

export default function SpeechCard({ 
  text, 
  isSelected, 
  onClick,
  textColor = 'text-blue-900',
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full aspect-[3/2] rounded-lg 
        flex items-center justify-center
        transition-all transform hover:scale-[1.02]
        text-2xl md:text-3xl font-serif font-bold
        relative overflow-hidden
        ${isSelected ? 'bg-rose-400 text-white' : 'bg-white hover:bg-gray-50'}
        shadow-md hover:shadow-lg
        ${className}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <span className={`text-center ${textColor}`}>
          {text}
        </span>
      </div>
      {/* Red corner triangle */}
      <div className="absolute bottom-0 left-0">
        <div className="w-6 h-6 bg-rose-400 transform rotate-45 translate-y-3 -translate-x-3" />
      </div>
    </button>
  );
} 