import subprocess
import sys

def run_test():
    print("Running test_ai_chatbot.py and capturing output...")
    try:
        # Run the command and capture output
        result = subprocess.run(
            [sys.executable, "backend/test_ai_chatbot.py"],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        
        # Write stdout and stderr to a file
        with open("test_full_log.txt", "w", encoding='utf-8') as f:
            f.write("--- STDOUT ---\n")
            f.write(result.stdout)
            f.write("\n--- STDERR ---\n")
            f.write(result.stderr)
            
        print("Done. Output saved to test_full_log.txt")
        print("STDOUT Preview:")
        print(result.stdout[:500])
        print("STDERR Preview:")
        print(result.stderr[:500])
        
    except Exception as e:
        print(f"Error running test: {e}")

if __name__ == "__main__":
    run_test()
