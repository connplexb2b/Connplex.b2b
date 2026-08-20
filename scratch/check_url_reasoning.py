import json

filepath = r"C:\Users\admin\.gemini\antigravity\brain\f3f41ea2-c3bd-4885-a8b3-5fd0f742de88\.system_generated\logs\transcript_full.jsonl"
out_path = "scratch/url_reasoning.txt"

try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f, open(out_path, 'w', encoding='utf-8') as out:
        for line in f:
            data = json.loads(line)
            step = data.get('step_index')
            if step in (70, 71, 72, 73, 74, 75):
                out.write(f"Step {step} source {data.get('source')} type {data.get('type')}:\n")
                thinking = data.get('thinking', '')
                if thinking:
                    out.write("  [Thinking]\n")
                    out.write(thinking + "\n\n")
                tool_calls = data.get('tool_calls', [])
                if tool_calls:
                    out.write("  [Tool Calls]\n")
                    out.write(json.dumps(tool_calls, indent=2) + "\n\n")
    print("Success! Output written to scratch/url_reasoning.txt")
except Exception as e:
    print(f"Error: {e}")
