import google.generativeai as genai

# Paste your actual Gemini API key here
genai.configure(api_key="AIzaSyBPhz29DlXubDj90iHljzYqVyd25_317SI")

model = genai.GenerativeModel("gemini-2.0-flash")
response = model.generate_content("What is urea fertilizer? Answer in 2 lines.")
print(response.text)