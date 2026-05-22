import requests
import json

url = 'http://localhost:8000/predict-disease'
payload = {
    "Animal_Type": "cow",
    "Symptom_1": "Fever",
    "Symptom_2": "Coughing",
    "Body_Temperature": 39.0,
    "Duration": "3 days",
    "lang": "mr"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    data = response.json()
    with open('test_result.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Wrote response to test_result.json successfully.")
except Exception as e:
    print("Error:", e)
