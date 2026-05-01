import os
import sys

# Simulation de settings.BASE_DIR
BASE_DIR = r"D:\IdentiGuinéeV2\backend"

def test_paths():
    base_public = os.path.join(BASE_DIR, '..', 'front', 'public')
    logo_path = os.path.join(base_public, "logo.png")
    
    print(f"Base Public: {os.path.abspath(base_public)}")
    print(f"Logo Path: {os.path.abspath(logo_path)}")
    
    if os.path.exists(logo_path):
        print("Logo SUCCESS: File found")
    else:
        print("Logo FAILURE: File NOT found")
        # List files in base_public
        if os.path.exists(base_public):
            print(f"Files in {base_public}:")
            print(os.listdir(base_public))
        else:
            print(f"Directory {base_public} NOT found")

if __name__ == "__main__":
    test_paths()
