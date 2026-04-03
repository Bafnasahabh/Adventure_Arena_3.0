import re
import json
import os

with open('extracted_clues.txt', 'r', encoding='utf-8') as f:
    text = f.read()

teams_data = {}

# We'll split by "Team X:"
team_blocks = re.split(r'Team\s+(\d+):?', text)
for i in range(1, len(team_blocks), 2):
    team_num = int(team_blocks[i])
    team_content = team_blocks[i+1].strip()
    
    clues = []
    riddle_blocks = re.split(r'Riddle\s+(\d+)\s*:\s*-?\s*\[(.*?)\]', team_content)
    
    # riddle_blocks will be: [preceding_text, seq, loc, text, seq, loc, text, ...]
    for r in range(1, len(riddle_blocks), 3):
        seq = int(riddle_blocks[r])
        loc = riddle_blocks[r+1].strip('_ \t\n')
        clue_text = riddle_blocks[r+2].strip()
        clues.append({
            "seq": seq,
            "loc": loc if loc else "Unknown",
            "clue": clue_text
        })
        
    teams_data[team_num] = clues

# Clean up empty
valid_teams = {}
for t, clist in teams_data.items():
    if len(clist) == 6:
        # Check if they're all mostly empty
        is_empty = all(c['loc'] == 'Unknown' and c['clue'] == '' for c in clist)
        if not is_empty:
            valid_teams[t] = clist

# 1) Generate the JavaScript replacement code
js_dict_str = "const specificTeamClues = {\n"
for t, clist in valid_teams.items():
    js_dict_str += f"    {t}: [\n"
    for c in clist:
        safe_clue = json.dumps(c['clue'])
        safe_loc = json.dumps(c['loc'])
        js_dict_str += f'        {{ seq: {c["seq"]}, clue: {safe_clue}, loc: {safe_loc} }},\n'
    js_dict_str += "    ],\n"
js_dict_str += "};"

with open('rebuild_json.mjs', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = re.sub(r'const specificTeamClues = \{.*?\};', lambda m: js_dict_str, js_content, flags=re.DOTALL)

with open('rebuild_json.mjs', 'w', encoding='utf-8') as f:
    f.write(js_content)


# 2) Generate the Python replacement code
py_dict_str = "specific_team_clues = {\n"
for t, clist in valid_teams.items():
    py_dict_str += f"    {t}: [\n"
    for c in clist:
        safe_clue = json.dumps(c['clue'])
        safe_loc = json.dumps(c['loc'])
        py_dict_str += f'        ({c["seq"]}, {safe_clue}, "", {safe_loc}),\n'
    py_dict_str += "    ],\n"
py_dict_str += "}"

with open('gen_mysql.py', 'r', encoding='utf-8') as f:
    py_content = f.read()

py_content = re.sub(r'specific_team_clues = \{.*?\}', lambda m: py_dict_str, py_content, flags=re.DOTALL)

with open('gen_mysql.py', 'w', encoding='utf-8') as f:
    f.write(py_content)

print("Updated rebuild_json.mjs and gen_mysql.py successfully!")
