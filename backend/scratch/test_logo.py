import os
import base64

def test_logo():
    path = r"D:\IdentiGuinéeV2\front\public\logo.png"
    print(f"Path: {path}")
    if os.path.exists(path):
        print("File exists")
        with open(path, "rb") as f:
            data = f.read()
            print(f"Size: {len(data)} bytes")
            encoded = base64.b64encode(data).decode()
            print(f"Base64 length: {len(encoded)}")
            print(f"Base64 start: {encoded[:50]}...")
    else:
        print("File NOT found")

if __name__ == "__main__":
    test_logo()
