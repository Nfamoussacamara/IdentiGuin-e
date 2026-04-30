
import sys
import os
import traceback

try:
    from weasyprint import HTML
    print("Import WeasyPrint SUCCESS")
    
    html_content = "<html><body><h1>Test WeasyPrint IdentiGuinée</h1></body></html>"
    HTML(string=html_content).write_pdf("simple_test.pdf")
    print(f"PDF Generation SUCCESS: {os.path.abspath('simple_test.pdf')}")
    
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    traceback.print_exc()
    sys.exit(1)
