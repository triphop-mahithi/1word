import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Plus, Minus, RotateCcw } from 'lucide-react';

interface SpeedReaderProps {
  words: string[]; // รับจาก props ตรงๆ เลย ไม่ต้องแปลงจาก text
  onBack: () => void;
}

const SpeedReader = ({ words, onBack }: SpeedReaderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // milliseconds per word
  const [isComplete, setIsComplete] = useState(false);
  console.log('SpeedReader word - ',words)
  useEffect(() => {
    setCurrentIndex(0);
    setIsComplete(false);
    setIsPlaying(false);
  }, [words]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && currentIndex < words.length) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= words.length) {
            setIsPlaying(false);
            setIsComplete(true);
            return prev;
          }
          return next;
        });
      }, speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, currentIndex, words]);

  const togglePlayPause = useCallback(() => {
    if (isComplete) {
      setCurrentIndex(0);
      setIsComplete(false);
    }
    setIsPlaying((prev) => !prev);
  }, [isComplete]);

  const increaseSpeed = useCallback(() => {
    setSpeed((prev) => Math.max(100, prev - 100));
  }, []);

  const decreaseSpeed = useCallback(() => {
    setSpeed((prev) => prev + 100);
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
  }, []);

  const currentWord =
    Array.isArray(words) && words.length > 0 && currentIndex < words.length
      ? words[currentIndex]
      : 'กำลังเริ่ม...';

  const progress =
    words.length > 0
      ? ((currentIndex + (isComplete ? 1 : 0)) / words.length) * 100
      : 0;

  const wordsPerMinute = Math.round(60000 / speed);

  return (
    <div className="min-h-screen bg-gradient-background font-thai">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            ← กลับ
          </Button>
          <h1 className="text-2xl font-bold text-primary">Speeder</h1>
          <div className="text-sm text-muted-foreground">
            {wordsPerMinute} คำ/นาที
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>
              {currentIndex + (isComplete ? 1 : 0)} / {words.length} คำ
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Main Word Display */}
        <div className="flex items-center justify-center mb-12">
          <div className="text-center p-8 bg-card border border-border rounded-2xl shadow-glow min-h-[200px] flex items-center justify-center w-full max-w-2xl">
            <div
              key={currentIndex}
              className="text-6xl md:text-8xl font-bold text-foreground animate-word-appear"
            >
              {isComplete
                ? 'เสร็จสิ้น!'
                : (!isPlaying && currentIndex === 0)
                ? 'เริ่ม'
                : currentWord}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={togglePlayPause}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow animate-pulse-glow"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 mr-2" />
            ) : (
              <Play className="w-6 h-6 mr-2" />
            )}
            {isComplete ? 'เริ่มใหม่' : isPlaying ? 'หยุด' : 'เล่น'}
          </Button>

          <Button
            onClick={restart}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            รีเซ็ต
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={decreaseSpeed}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="text-center px-4">
            <div className="text-sm text-muted-foreground">ความเร็ว</div>
            <div className="text-lg font-semibold text-foreground">
              {wordsPerMinute} คำ/นาที
            </div>
          </div>

          <Button
            onClick={increaseSpeed}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Message */}
        {isComplete && (
          <div className="text-center mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-primary font-medium">
              เยี่ยมมาก! คุณอ่านครบ {words.length} คำแล้ว
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedReader;
