from deep_translator import GoogleTranslator

def translate_text(text: str, target_lang: str = "hi") -> str:
    """
    Translates text to target language code.
    Common Indian language codes: 
    'hi' (Hindi), 'kn' (Kannada), 'ta' (Tamil), 'te' (Telugu), 'mr' (Marathi)
    """
    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"Translation Error: {e}")
        return text  # Fallback to original text if translation fails