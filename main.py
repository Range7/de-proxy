from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"status": "DE Proxy is running", "service": "defe-proxy"})

@app.route('/api', methods=['GET', 'POST', 'OPTIONS'])
def proxy():
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response

    target = 'https://slave.downloadeverythingfromeverywhere.com/'

    headers = {
        'User-Agent': request.headers.get('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://downloadeverythingfromeverywhere.com',
        'Referer': 'https://downloadeverythingfromeverywhere.com/',
        'DNT': '1',
    }

    try:
        resp = requests.post(target, headers=headers, data=request.get_data(), timeout=20)
        response = app.response_class(
            response=resp.text,
            status=resp.status_code,
            mimetype=resp.headers.get('Content-Type', 'application/json')
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
