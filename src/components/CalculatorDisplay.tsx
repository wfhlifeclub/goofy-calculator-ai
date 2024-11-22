import React from 'react';
import { Sparkles, Timer } from 'lucide-react';

type DisplayProps = {
  display: string;
  message: string;
  score: number;
  timeLeft: number;
};

export const CalculatorDisplay: React.FC<DisplayProps> = ({ display, message, score, timeLeft }) => (
  <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 shadow-lg z-50">
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Goofy Calculator <Sparkles className="text-yellow-400" />
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="text-blue-400" />
            <span className={`text-xl ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="text-xl">Score: {score}</div>
        </div>
      </div>
      <div className="bg-gray-700 p-4 rounded-lg mb-2">
        <div className="text-right text-xl mb-2">{display}</div>
        <div className="text-green-400 text-sm">{message}</div>
      </div>
    </div>
  </div>
);