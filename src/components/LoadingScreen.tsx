
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = 'Carregando' }: LoadingScreenProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sportsIcons = [
    { icon: '⚽', animation: 'animate-spin', delay: 'animation-delay-0' },
    { icon: '🥇', animation: 'animate-bounce', delay: 'animation-delay-200' },
    { icon: '📢', animation: 'animate-pulse', delay: 'animation-delay-400' }
  ];

  return (
    <div className="fixed inset-0 bg-[#093758] flex flex-col items-center justify-center z-50">
      <div className="flex gap-6 mb-8">
        {sportsIcons.map((item, index) => (
          <div
            key={index}
            className={`text-4xl ${item.animation} ${item.delay}`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {item.icon}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {message}{dots}
        </h2>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#F35410] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
