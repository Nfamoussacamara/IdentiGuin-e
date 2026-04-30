"""
Analyse précise des couleurs du fond de la carte d'identité guinéenne.
Utilise Pillow pour extraire les couleurs exactes par zones.
"""
from PIL import Image
import numpy as np
import sys

img_path = r"d:\IdentiGuinéeV2\front\public\reference.jpg"
img = Image.open(img_path).convert("RGB")
arr = np.array(img)

h, w = arr.shape[:2]
print(f"Image size: {w}x{h}")

# Définir des zones d'intérêt (en % de la taille)
zones = {
    "Header (haut blanc)":       (0.02, 0.02, 0.98, 0.22),
    "Body left (fond vert)":     (0.05, 0.25, 0.20, 0.75),  # Zone fond pur, à gauche de la photo
    "Body mid (fond vert)":      (0.25, 0.40, 0.45, 0.60),  # Milieu
    "Body right (watermark)":    (0.60, 0.30, 0.90, 0.70),  # Zone sombre watermark Afrique
    "Bottom (fond clair)":       (0.25, 0.80, 0.75, 0.97),
    "Top left (guilloché)":      (0.02, 0.25, 0.10, 0.50),  # Bord gauche guilloché
}

print("\n=== ANALYSE COULEURS PAR ZONE ===")
for name, (x1r, y1r, x2r, y2r) in zones.items():
    x1, y1 = int(x1r * w), int(y1r * h)
    x2, y2 = int(x2r * w), int(y2r * h)
    region = arr[y1:y2, x1:x2]
    
    mean_r = int(region[:,:,0].mean())
    mean_g = int(region[:,:,1].mean())
    mean_b = int(region[:,:,2].mean())
    hex_color = f"#{mean_r:02X}{mean_g:02X}{mean_b:02X}"
    
    # Min/Max pour voir la plage
    min_r, max_r = region[:,:,0].min(), region[:,:,0].max()
    min_g, max_g = region[:,:,1].min(), region[:,:,1].max()
    min_b, max_b = region[:,:,2].min(), region[:,:,2].max()
    
    print(f"\n[Zone] {name}")
    print(f"   Couleur moyenne: {hex_color}  (R:{mean_r} G:{mean_g} B:{mean_b})")
    print(f"   Plage R: {min_r}-{max_r}  G: {min_g}-{max_g}  B: {min_b}-{max_b}")

# Analyse du guilloché : chercher les pixels les plus clairs et les plus foncés dans la zone verte
print("\n=== ANALYSE GUILLOCHÉ (zone fond pur) ===")
x1, y1 = int(0.02 * w), int(0.25 * h)
x2, y2 = int(0.15 * w), int(0.60 * h)
region = arr[y1:y2, x1:x2]

# Luminosité
lum = 0.299 * region[:,:,0] + 0.587 * region[:,:,1] + 0.114 * region[:,:,2]

# Pixels les plus clairs (fond)
light_mask = lum > np.percentile(lum, 80)
light_pixels = region[light_mask]
if len(light_pixels) > 0:
    print(f"Fond clair (80e percentile):  #{int(light_pixels[:,0].mean()):02X}{int(light_pixels[:,1].mean()):02X}{int(light_pixels[:,2].mean()):02X}")

# Pixels les plus foncés (lignes du guilloché)
dark_mask = lum < np.percentile(lum, 20)
dark_pixels = region[dark_mask]
if len(dark_pixels) > 0:
    print(f"Lignes foncées (20e percentile): #{int(dark_pixels[:,0].mean()):02X}{int(dark_pixels[:,1].mean()):02X}{int(dark_pixels[:,2].mean()):02X}")

# Analyse watermark Africa (zone droite sombre)
print("\n=== ANALYSE WATERMARK AFRIQUE ===")
x1, y1 = int(0.58 * w), int(0.28 * h)
x2, y2 = int(0.88 * w), int(0.72 * h)
region = arr[y1:y2, x1:x2]
lum = 0.299 * region[:,:,0] + 0.587 * region[:,:,1] + 0.114 * region[:,:,2]

dark_mask = lum < np.percentile(lum, 30)
dark_pixels = region[dark_mask]
if len(dark_pixels) > 0:
    dr = int(dark_pixels[:,0].mean())
    dg = int(dark_pixels[:,1].mean())
    db = int(dark_pixels[:,2].mean())
    print(f"Couleur ombre watermark: #{dr:02X}{dg:02X}{db:02X}  (R:{dr} G:{dg} B:{db})")

all_mean_r = int(region[:,:,0].mean())
all_mean_g = int(region[:,:,1].mean())
all_mean_b = int(region[:,:,2].mean())
print(f"Couleur moyenne zone watermark: #{all_mean_r:02X}{all_mean_g:02X}{all_mean_b:02X}")

print("\n=== TERMINÉ ===")
