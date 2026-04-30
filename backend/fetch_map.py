import urllib.request

url = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/ECOWAS_map.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as response:
        svg_data = response.read().decode('utf-8')
        with open('d:/IdentiGuinéeV2/backend/ecowas_map.svg', 'w', encoding='utf-8') as f:
            f.write(svg_data)
        print("Success")
except Exception as e:
    print(f"Error: {e}")
