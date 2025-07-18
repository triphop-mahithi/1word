from django.shortcuts import render
from pythainlp.tokenize import word_tokenize
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from pythainlp.tokenize import word_tokenize
import emoji
import re
# Create your views here.

def index(request):
    return render(request, 'speeder_app/index.html')

def play(request):
    if request.method == 'POST':
        text = request.POST.get('text', '')
        words = word_tokenize(text, engine="newmm")
        return render(request, 'speeder_app/play.html', {'words': words})
    return render(request, 'speeder_app/index.html')

@csrf_exempt
def tokenize_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')

            # 1. ลบ emoji และ whitespace เกินจำเป็น
            text = emoji.replace_emoji(text, replace='')
            text = re.sub(r'[^\u0E00-\u0E7Fa-zA-Z0-9\s.,!?()\[\]\'’“”\-]+', '', text)
            text = text.replace("“", "").replace("”", "").replace('"', '')
            text = re.sub(r'(\S)(ๆ|\?+|\.+)', r'\1\2', text)
            # 2. ตัดคำ
            tokens = word_tokenize(text, engine='newmm')

            # 3. รวมคำที่เป็น 'ๆ', '?', ',' เข้ากับคำหน้า
            cleaned_words = []
            for token in tokens:
                if token in ['ๆ', '?', ',', '.', '!', '…', '~', '"', "'", 'ฯ', 'ฯลฯ']:
                    if cleaned_words:
                        cleaned_words[-1] += token
                    else:
                        cleaned_words.append(token)
                elif token.strip() != '':
                    cleaned_words.append(token.strip())

            return JsonResponse({'words': cleaned_words})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)