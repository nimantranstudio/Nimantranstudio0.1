import os
import re

bundle_dir = 'public/Image/bundle'
templates = [f for f in os.listdir(bundle_dir) if f.startswith('template-') and f.endswith('.html')]

for t in templates:
    filepath = os.path.join(bundle_dir, t)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all transform: translate(...)
    content = re.sub(r'transform\s*:\s*translate\([^)]+\)', '', content)
    
    # Remove empty semicolons left behind
    content = re.sub(r';\s*\}', ' }', content)
    content = re.sub(r';\s*;', ';', content)

    # Fix .text-block styling
    text_block_new = '''        .text-block {
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-line;
            line-height: 1.4;
            text-shadow: 0px 2px 8px rgba(0,0,0,0.5);
            text-align: center;
        }'''
    content = re.sub(r'\.text-block\s*\{[^}]+\}', text_block_new, content)

    # Fix .content-safe-area styling
    content_safe_area_new = '''        .content-safe-area {
            position: absolute;
            inset: 0;
            padding-top: 15%;
            padding-bottom: 10%;
            padding-left: 5%;
            padding-right: 5%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2cqi;
            z-index: 10;
        }'''
    content = re.sub(r'\.content-safe-area\s*\{[^}]+\}', content_safe_area_new, content)

    # Fix line-heights in generated classes to be 1.4 or normal
    content = re.sub(r'line-height\s*:\s*1\.2', 'line-height: 1.4', content)
    
    # Increase ampersand size slightly and remove margins on it if any
    content = re.sub(r'\.style-ampersand\s*\{([^}]+)\}', 
                     lambda m: '.style-ampersand {' + re.sub(r'margin[^;]+;', '', m.group(1)) + '}', content)

    # Remove negative margins on names to avoid overlaps in flex stack
    content = re.sub(r'\.style-brideName\s*\{([^}]+)\}', 
                     lambda m: '.style-brideName {' + re.sub(r'margin[^;]+;', '', m.group(1)) + '}', content)
    content = re.sub(r'\.style-groomName\s*\{([^}]+)\}', 
                     lambda m: '.style-groomName {' + re.sub(r'margin[^;]+;', '', m.group(1)) + '}', content)
                     
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed templates successfully.")
