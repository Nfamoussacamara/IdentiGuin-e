import json
import urllib.request

url = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&titles=File:Blank_Map-Africa.svg&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode())
        pages = data['query']['pages']
        for page_id in pages:
            if 'revisions' in pages[page_id]:
                content = pages[page_id]['revisions'][0]['*']
                print(content[:500])
            else:
                print("No revisions found.")
except Exception as e:
    print(f"Error: {e}")
