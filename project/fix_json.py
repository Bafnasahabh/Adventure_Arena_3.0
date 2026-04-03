import re

with open('clues_data.json', 'r', encoding='utf8') as f:
    text = f.read()

def repl(m):
    # group 1 is everything inside the quotes
    fixed_text = m.group(1).replace('\n', '\\n').replace('\r', '')
    return '"clue_text": "' + fixed_text + '"'

# Match "clue_text": " ... " where ... can be anything except another quote
new_text = re.sub(r'"clue_text":\s*"([^"]+)"', repl, text)

with open('clues_data.json', 'w', encoding='utf8') as f:
    f.write(new_text)
print("done!")
