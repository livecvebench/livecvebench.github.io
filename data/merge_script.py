import json
import datetime
import os

def merge_data():
    print("Reading task_stats.json...")
    try:
        with open('task_stats.json', 'r', encoding='utf-8') as f:
            task_stats = json.load(f)
    except Exception as e:
        print(f"Error reading task_stats.json: {e}")
        return

    print("Reading merged_results_v28.json...")
    try:
        with open('merged_results_v28.json', 'r', encoding='utf-8') as f:
            merged_results = json.load(f)
    except Exception as e:
        print(f"Error reading merged_results_v28.json: {e}")
        return

    print("Processing data...")
    new_results = []
    
    # Create a mapping for model/agent types from existing results for quick lookup
    existing_types = {}
    for res in merged_results.get('results', []):
        key = (res.get('agent'), res.get('model'))
        existing_types[key] = (res.get('agentType', 'unknown'), res.get('modelType', 'unknown'))

    for key, value in task_stats.items():
        parts = key.split('+')
        if len(parts) != 2:
            print(f"Skipping malformed key: {key}")
            continue
            
        agent_raw, model_raw = parts
        
        # Remap agent and model names
        agent = agent_raw
        model = model_raw
        
        if agent_raw == "mini-swe-agent":
            agent = "Mini-SWE-Agent"
        
        if model_raw == "Claude-4.5-Opus":
            model = "Claude Opus 4.5"
        elif model_raw == "Claude-4-Sonnet":
            model = "Claude Sonnet 4"
        elif model_raw == "Claude-4.5-Sonnet":
            model = "Claude Sonnet 4.5"
        elif model_raw == "MiniMax-M2":
            model = "MiniMax M2"
        elif model_raw == "DeepSeek-V3.1-Terminus":
            model = "DeepSeek V3.1-Terminus"
        elif model_raw == "DeepSeek-V3.2":
            model = "DeepSeek V3.2"
        elif model_raw == "Gemini-3-Pro":
            model = "Gemini 3 Pro"
        elif model_raw == "GPT-5.1-Codex":
            model = "GPT-5.1-Codex"
        elif model_raw == "Qwen3-Coder":
            model = "Qwen 3 Coder 480B"

        # Determine modelType and agentType
        # Default to 'unknown' if not found
        agent_type, model_type = existing_types.get((agent, model), ("unknown", "unknown"))
        
        # Fallback heuristic if still unknown (based on original script logic or common sense)
        if agent_type == "unknown":
             # Try to find just by agent name
             for res in merged_results.get('results', []):
                 if res.get('agent') == agent:
                     agent_type = res.get('agentType')
                     break
        
        if model_type == "unknown":
             for res in merged_results.get('results', []):
                 if res.get('model') == model:
                     model_type = res.get('modelType')
                     break

        new_entry = {
            "model": model,
            "agent": agent,
            "modelType": model_type if model_type else "unknown",
            "agentType": agent_type if agent_type else "unknown",
            "dataset": "patcheval-des-all",
            "instruction_type": "cve_description",
            "cve_results": value
        }
        new_results.append(new_entry)

    # Add the new results to the existing results
    merged_results['results'].extend(new_results)

    # Update metadata
    merged_results['generated_at'] = datetime.datetime.now().isoformat()
    merged_results['updated_at'] = datetime.datetime.now().isoformat()
    merged_results['total_experiments'] = len(merged_results['results'])

    print(f"Total experiments after merge: {merged_results['total_experiments']}")

    # Write to a new file
    output_filename = 'merged_results_v29.json'
    print(f"Writing to {output_filename}...")
    try:
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(merged_results, f, indent=2, ensure_ascii=False)
        print(f"Successfully created {output_filename}")
    except Exception as e:
        print(f"Error writing to file: {e}")

if __name__ == "__main__":
    merge_data()
