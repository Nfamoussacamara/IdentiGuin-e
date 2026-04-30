import urllib.request
import re

url = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Africa_location_map_without_borders.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        svg_data = response.read().decode('utf-8')
        
        # Save the full downloaded SVG for reference
        with open('d:/IdentiGuinéeV2/backend/africa_map_full.svg', 'w', encoding='utf-8') as f:
            f.write(svg_data)
        
        # Extract just the <path> elements
        paths = re.findall(r'<path[^>]*>', svg_data)
        
        # We just want the main continent path, which is usually the largest or first
        # But this SVG might have many paths (islands).
        # We will wrap it in a <g> tag.
        
        print(f'Successfully downloaded Africa SVG. Found {len(paths)} paths.')
except Exception as e:
    print(f'Error: {e}')
