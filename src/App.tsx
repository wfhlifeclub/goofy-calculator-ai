import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorButton } from './components/CalculatorButton';
import { CalculatorDisplay } from './components/CalculatorDisplay';

type Operation = '+' | '-' | '*' | '/';
const OPERATIONS: Operation[] = ['+', '-', '*', '/'];
const TARGET_RANGE = { min: 1, max: 100 };
const TIMER_RANGE = { min: 10, max: 30 };

type ButtonPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function App() {
  const [display, setDisplay] = useState('0');
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Get started!');
  const [buttonPositions, setButtonPositions] = useState<ButtonPosition[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const generateNewTarget = useCallback(() => {
    const newTarget = Math.floor(Math.random() * (TARGET_RANGE.max - TARGET_RANGE.min + 1)) + TARGET_RANGE.min;
    const newTime = Math.floor(Math.random() * (TIMER_RANGE.max - TIMER_RANGE.min + 1)) + TIMER_RANGE.min;
    setTarget(newTarget);
    setTimeLeft(newTime);
    setTimerActive(true);
    setMessage(`Get to ${newTarget}! Time left: ${newTime}s`);
  }, []);

  const generateRandomPositions = useCallback(() => {
    if (!containerRef) return;

    const containerWidth = containerRef.offsetWidth;
    const containerHeight = containerRef.offsetHeight;
    const positions: ButtonPosition[] = [];
    const buttons = 16;
    const minSize = 50;
    const maxSize = 80;
    const maxAttempts = 100;
    const margin = 10;

    const doesOverlap = (pos: ButtonPosition, positions: ButtonPosition[]) => {
      return positions.some(existing => {
        const horizontalOverlap = 
          pos.x + pos.width + margin > existing.x && 
          existing.x + existing.width + margin > pos.x;
        const verticalOverlap = 
          pos.y + pos.height + margin > existing.y && 
          existing.y + existing.height + margin > pos.y;
        return horizontalOverlap && verticalOverlap;
      });
    };

    const isWithinBounds = (pos: ButtonPosition) => {
      return (
        pos.x >= margin &&
        pos.y >= margin &&
        pos.x + pos.width <= containerWidth - margin &&
        pos.y + pos.height <= containerHeight - margin
      );
    };

    for (let i = 0; i < buttons; i++) {
      let attempts = 0;
      let position: ButtonPosition;

      do {
        const width = Math.floor(Math.random() * (maxSize - minSize) + minSize);
        const height = width;

        const x = Math.floor(Math.random() * (containerWidth - width - margin * 2) + margin);
        const y = Math.floor(Math.random() * (containerHeight - height - margin * 2) + margin);

        position = { x, y, width, height };
        attempts++;

        if (attempts > maxAttempts) {
          positions.length = 0;
          i = -1;
          break;
        }
      } while (!isWithinBounds(position!) || doesOverlap(position!, positions));

      if (positions.length === i) {
        positions.push(position!);
      }
    }

    setButtonPositions(positions);
  }, [containerRef]);

  useEffect(() => {
    generateNewTarget();
  }, [generateNewTarget]);

  useEffect(() => {
    if (containerRef) {
      generateRandomPositions();
    }
  }, [containerRef, generateRandomPositions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime > 0) {
            setMessage(`Get to ${target}! Time left: ${newTime}s`);
            return newTime;
          } else {
            setMessage("Time's up! Here's a new target!");
            setDisplay('0');
            generateNewTarget();
            generateRandomPositions();
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeLeft, target, generateNewTarget, generateRandomPositions]);

  const handleNumber = (num: number) => {
    setDisplay(prev => prev === '0' ? num.toString() : prev + num);
    generateRandomPositions();
  };

  const handleOperation = (op: Operation) => {
    setDisplay(prev => prev + op);
    generateRandomPositions();
  };

  const clear = () => {
    setDisplay('0');
    generateRandomPositions();
  };

  const calculateResult = (expression: string): number => {
    return Function(`'use strict'; return (${expression})`)();
  };

  const handleEquals = () => {
    try {
      const result = calculateResult(display);
      
      if (result === target) {
        setScore(prev => prev + 1);
        setMessage("🎉 Perfect! Here's a new target!");
        setTimerActive(false);
        generateNewTarget();
      } else {
        setMessage(`Try again! You got ${result}, but need ${target}`);
      }
      setDisplay('0');
      generateRandomPositions();
    } catch (error) {
      setMessage('Invalid expression!');
      setDisplay('0');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <CalculatorDisplay 
        display={display}
        message={message}
        score={score}
        timeLeft={timeLeft}
      />

      <div 
        ref={setContainerRef}
        className="mt-48 max-w-md mx-auto relative h-[500px] border-2 border-gray-700 rounded-lg"
      >
        {buttonPositions.length > 0 && (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => (
              <CalculatorButton
                key={`num${num}`}
                onClick={() => handleNumber(num)}
                position={buttonPositions[idx]}
                size={buttonPositions[idx]}
                gridArea=""
                color="bg-purple-600"
              >
                {num}
              </CalculatorButton>
            ))}
            
            {OPERATIONS.map((op, idx) => (
              <CalculatorButton
                key={op}
                onClick={() => handleOperation(op)}
                position={buttonPositions[10 + idx]}
                size={buttonPositions[10 + idx]}
                gridArea=""
                color="bg-blue-600"
              >
                {op}
              </CalculatorButton>
            ))}

            <CalculatorButton
              onClick={handleEquals}
              position={buttonPositions[14]}
              size={buttonPositions[14]}
              gridArea=""
              color="bg-green-600"
            >
              =
            </CalculatorButton>

            <CalculatorButton
              onClick={clear}
              position={buttonPositions[15]}
              size={buttonPositions[15]}
              gridArea=""
              color="bg-red-600"
            >
              C
            </CalculatorButton>
          </>
        )}
      </div>
    </div>
  );
}

export default App;