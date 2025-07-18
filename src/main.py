import os, time, threading, msvcrt
from abc import ABC, abstractmethod
from pyfiglet import figlet_format

def get_multiline_input(end_marker="END"):
    os.system('cls' if os.name == 'nt' else 'clear')
    print("พิมพ์ข้อความหลายบรรทัดที่คุณต้องการให้ Speeder อ่าน")
    print(f"(พิมพ์ '{end_marker}' เพื่อจบการป้อนข้อความ)\n")

    lines = []
    while True:
        line = input()
        if line.strip() == end_marker:
            break
        lines.append(line)
    return "\n".join(lines)


# ---------------- State Pattern ----------------

class SpeederState(ABC):
    @abstractmethod
    def handle(self, app):
        pass

class PlayingState(SpeederState):
    def handle(self, app):
        word = app.word_list[app.index]
        app.renderer.clear()
        app.renderer.display_word(word)
        app.renderer.display_progress(app.index, len(app.word_list), app.delay)
        time.sleep(app.delay)
        app.index += 1
        if app.index >= len(app.word_list):
            app.set_state(ExitState())

class PausedState(SpeederState):
    def handle(self, app):
        app.renderer.clear()
        app.renderer.display_pause()
        time.sleep(0.5)

class ExitState(SpeederState):
    def handle(self, app):
        app.renderer.clear()
        app.renderer.display_end()
        app.running = False

# ---------------- Renderer ----------------

class TerminalRenderer:
    def clear(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    def display_word(self, word):
        print("\n" * 10)
        print(f"\n\n\n\t\t\t\t\t\t{word}")
        print("\n" * 10)

    def display_progress(self, index, total, delay):
        elapsed = index * delay
        total_time = total * delay
        progress = int((index + 1) / total * 50)
        print(f"\n ({format_time(elapsed)} / {format_time(total_time)}) [{'#' * progress}{'.' * (50 - progress)}]")
        print(f"\n\t'p' : PAUSE \t 'r' : CONTINUE \t 'q' : EXIT \t '+' : SPEED DOWN \t '-' SPEED UP (delay: {delay:.1f}s)")

    def display_pause(self):
        art = figlet_format("PAUSE", font="banner3-D")
        print(art)
        print("\n  กด 'r' เพื่อเล่นต่อ | 'q' เพื่อออก")

    def display_end(self):
        art = figlet_format("Byee !", font="isometric1")
        print("\n" + art)

# ---------------- Strategy Pattern (Font style) ----------------
# Could be expanded for other uses

# ---------------- Observer (Key Listening) ----------------

class InputHandler(threading.Thread):
    def __init__(self, app):
        super().__init__(daemon=True)
        self.app = app

    def run(self):
        while self.app.running:
            if msvcrt.kbhit():
                key = msvcrt.getch().decode('utf-8').lower()
                if key == 'p':
                    self.app.set_state(PausedState())
                elif key == 'r':
                    self.app.set_state(PlayingState())
                elif key == 'q':
                    self.app.set_state(ExitState())
                elif key == '+':
                    self.app.delay = max(0.1, self.app.delay - 0.1)
                elif key == '-':
                    self.app.delay += 0.1
            time.sleep(0.05)

# ---------------- Controller ----------------

class SpeederApp:
    def __init__(self, word_list, delay=0.5):
        self.word_list = word_list
        self.delay = delay
        self.index = 0
        self.running = True
        self.renderer = TerminalRenderer()
        self.state = PlayingState()

    def set_state(self, state):
        self.state = state

    def run(self):
        input_handler = InputHandler(self)
        input_handler.start()
        while self.running:
            self.state.handle(self)

# ---------------- Utils ----------------

def format_time(seconds):
    mins = int(seconds) // 60
    secs = int(seconds) % 60
    return f"{mins:02d}:{secs:02d}"

# ---------------- Usage ----------------

from pythainlp.tokenize import word_tokenize

text = get_multiline_input(end_marker="END")

if text.strip() == "":
    print("คุณยังไม่ได้ใส่ข้อความใด ๆ")
else:
    list_text = word_tokenize(text, engine="newmm")
    SpeederApp(list_text, delay=0.6).run()