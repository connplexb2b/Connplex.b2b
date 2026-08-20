import urllib.request
import urllib.error

url = "https://lovable-uploads.s3.eu-west-1.amazonaws.com/a/v1/f8ce03f0-b475-480a-a910-0d23c56d0199/d3011f6c-b63a-4df5-b697-f38d6b50215c/gameplex-logo.png"

try:
    print(f"Requesting {url}...")
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as res:
        print("Success without redirect!")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
    print("Response headers:")
    for header, val in e.headers.items():
        print(f"  {header}: {val}")
    
    # Try reading the XML response body which often states the correct Endpoint
    try:
        xml_body = e.read().decode('utf-8')
        print("Response body:")
        print(xml_body)
    except Exception as body_err:
        print(f"Could not read body: {body_err}")
except Exception as e:
    print(f"Failed: {e}")
