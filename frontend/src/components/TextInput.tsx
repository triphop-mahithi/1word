import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap } from 'lucide-react';

interface TextInputProps {
  onStartReading: (text: string) => void;
  //onStartReading: (words: string[]) => void;
}

const TextInput = ({ onStartReading }: TextInputProps) => {
  const [text, setText] = useState('');

  //const handleSubmit = (e: React.FormEvent) => {
  //  e.preventDefault();
  //  if (text.trim()) {
  //    onStartReading(text.trim());
  //  }
  //};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!text.trim()) return;
  
  const res = await fetch('http://localhost:8000/api/tokenize/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  const data = await res.json();
  console.log("words - ",data)
  if (data.words) {
    onStartReading(data.words); // ส่งคำที่ตัดแล้วกลับไป
  }
};

  const sampleTexts = [
    'การอ่านเร็วเป็นทักษะที่สำคัญในยุคข้อมูลข่าวสาร เราสามารถฝึกฝนเพื่อเพิ่มความเร็วในการอ่านได้',
    'เทคโนโลยีสมัยใหม่ช่วยให้เราเรียนรู้ได้อย่างมีประสิทธิภาพมากขึ้น ด้วยเครื่องมือที่หลากหลายและน่าสนใจ',
    'ความรู้เป็นพลังที่สำคัญที่สุดในการพัฒนาตนเอง การเรียนรู้อย่างต่อเนื่องจะทำให้เราก้าวหน้าในชีวิต'
  ];

  return (
    <div className="min-h-screen bg-gradient-background font-thai">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground">Speeder</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            เพิ่มความเร็วในการอ่านของคุณ
          </p>
          <p className="text-muted-foreground">
            ฝึกอ่านเร็วด้วยเทคนิคการแสดงคำทีละคำ
          </p>
        </div>

        {/* Main Form */}
        <Card className="mb-8 bg-card border-border shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              พิมพ์ข้อความที่ต้องการอ่าน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="พิมพ์ข้อความที่ต้องการฝึกอ่านที่นี่... คุณสามารถใส่ข้อความยาวๆ ได้เลย"
                className="min-h-[200px] text-lg font-thai resize-none bg-input border-border focus:ring-primary"
                required
              />
              
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!text.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 text-lg shadow-glow animate-pulse-glow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  เริ่ม Speeder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sample Texts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">ข้อความตัวอย่าง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleTexts.map((sample, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setText(sample)}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {sample}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">เพิ่มความเร็ว</h3>
              <p className="text-sm text-muted-foreground">
                ฝึกอ่านเร็วขึ้นด้วยการควบคุมความเร็วที่เหมาะสม
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">เข้าใจดีขึ้น</h3>
              <p className="text-sm text-muted-foreground">
                การอ่านทีละคำช่วยเพิ่มสมาธิและความเข้าใจ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-glow transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary-foreground rounded-full" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">ฝึกฝนง่าย</h3>
              <p className="text-sm text-muted-foreground">
                ใช้งานง่าย ฝึกได้ทุกที่ทุกเวลา
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TextInput;