import os
import re

bundle_dir = 'public/Image/bundle'
templates = [f for f in os.listdir(bundle_dir) if f.startswith('template-') and f.endswith('.html')]

for t in templates:
    filepath = os.path.join(bundle_dir, t)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove text-shadow
    content = re.sub(r'\s*text-shadow:\s*0px 2px 8px rgba\(0,0,0,0\.5\);', '', content)

    # 2. Fix order in Wedding template
    if "Wedding" in t:
        # Find the block of names
        pattern = r'(<div class="text-block style-groomName"[^>]*>\{\{groom_name\}\}</div>)\s*(<div class="text-block style-ampersand"[^>]*>[^<]*</div>)\s*(<div class="text-block style-brideName"[^>]*>\{\{bride_name\}\}</div>)\s*(<div class="text-block style-groomParents"[^>]*>\{\{groom_parents\}\}</div>)\s*(<div class="text-block style-brideParents"[^>]*>\{\{bride_parents\}\}</div>)'
        
        def reorder(m):
            groom = m.group(1)
            ampersand = m.group(2)
            bride = m.group(3)
            groom_parents = m.group(4)
            bride_parents = m.group(5)
            
            # Add some negative margin to parents so they tuck nicely under the name
            groom_parents = groom_parents.replace('style=""', 'style="margin-top: -1.5cqi; margin-bottom: 1cqi;"')
            bride_parents = bride_parents.replace('style=""', 'style="margin-top: -1.5cqi; margin-bottom: 1cqi;"')
            
            return f"{groom}\n            {groom_parents}\n            {ampersand}\n            {bride}\n            {bride_parents}"
            
        content = re.sub(pattern, reorder, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed shadow and name order successfully.")
