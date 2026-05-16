from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory

# Ensure consistent results
DetectorFactory.seed = 0

def translate_text(text, target_lang='en', source_lang='auto'):
    if not text or text.strip() == "":
        return text
    
    try:
        # If source is auto, we try to detect
        if source_lang == 'auto':
            try:
                source_lang = detect(text)
            except:
                source_lang = 'en'
        
        # If already in target language, return as is
        if source_lang == target_lang:
            return text
            
        translated = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def translate_dict(data, target_lang='en'):
    """
    Translates values in a dictionary to target language.
    """
    translated_data = {}
    for key, value in data.items():
        if isinstance(value, str):
            translated_data[key] = translate_text(value, target_lang)
        else:
            translated_data[key] = value
    return translated_data
