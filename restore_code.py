import json
import os

def restore(json_path, target_path):
    with open(json_path, 'r') as f:
        data = json.load(f)
        # The code is in tool_calls[0].args.CodeContent
        code = data['tool_calls'][0]['args']['CodeContent']
        with open(target_path, 'w') as out:
            out.write(code)

restore('/Users/pratik/Bits and Studios Website/maker_elements_restore.json', '/Users/pratik/Bits and Studios Website/src/components/MakerElements.jsx')
restore('/Users/pratik/Bits and Studios Website/hero_section_restore.json', '/Users/pratik/Bits and Studios Website/src/components/HeroSection.jsx')
