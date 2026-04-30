import urllib.request
import json

url = "https://en.wikipedia.org/w/api.php?action=query&titles=File:ECOWAS_map.svg&prop=imageinfo&iiprop=url&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode())
        pages = data['query']['pages']
        for page_id in pages:
            file_url = pages[page_id]['imageinfo'][0]['url']
            print(f"Found URL: {file_url}")
            
            # Download the SVG
            req2 = urllib.request.Request(file_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as r2:
                svg_data = r2.read().decode('utf-8')
                with open('d:/IdentiGuinéeV2/backend/ecowas_map.svg', 'w', encoding='utf-8') as f:
                    f.write(svg_data)
                print("Downloaded successfully!")
except Exception as e:
    print(f"Error: {e}")
