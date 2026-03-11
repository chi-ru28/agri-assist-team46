import sys

def read_output(filename):
    print(f"Reading {filename}...")
    try:
        # Try different encodings until one works
        for enc in ['utf-8', 'utf-16', 'cp1252', 'latin-1']:
            try:
                with open(filename, 'r', encoding=enc) as f:
                    content = f.read()
                    print(f"--- CONTENT (encoding={enc}) ---")
                    # Remove all non-ASCII characters for printing to avoid console errors
                    safe_content = "".join([c if ord(c) < 128 else ("\\u%04x" % ord(c)) for c in content])
                    print(safe_content)
                    return
            except UnicodeDecodeError:
                continue
        print("Could not decode file with any support encoding.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        read_output(sys.argv[1])
    else:
        read_output('test_output.txt')
