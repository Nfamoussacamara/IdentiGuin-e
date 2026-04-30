import urllib.request

url = 'https://simplemaps.com/static/svg/africa/africa.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        svg_data = response.read().decode('utf-8')
        with open('d:/IdentiGuinéeV2/backend/africa_hq.svg', 'w', encoding='utf-8') as f:
            f.write(svg_data)
        print("Downloaded High-Quality Africa SVG")
except Exception as e:
    print(f'Error: {e}')
