import os
import re

bundle_dir = 'public/Image/bundle'
templates = [f for f in os.listdir(bundle_dir) if f.startswith('template-') and f.endswith('.html')]

for t in templates:
    filepath = os.path.join(bundle_dir, t)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine specific padding based on template name
    pad_top = "15%"
    pad_bottom = "10%"
    
    if "Mehendi" in t:
        pad_top = "30%"
        pad_bottom = "15%"
    elif "Wedding" in t:
        pad_top = "28%"
        pad_bottom = "15%"
    elif "Haldi" in t:
        pad_top = "28%"
        pad_bottom = "15%"
    elif "Reception" in t:
        pad_top = "22%"
        pad_bottom = "10%"
    elif "Save the date" in t:
        pad_top = "20%"
        pad_bottom = "10%"

    # Fix .content-safe-area styling
    content_safe_area_new = f'''        .content-safe-area {{
            position: absolute;
            inset: 0;
            padding-top: {pad_top};
            padding-bottom: {pad_bottom};
            padding-left: 10%;
            padding-right: 10%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2.5cqi;
            z-index: 10;
        }}'''
    content = re.sub(r'\.content-safe-area\s*\{[^}]+\}', content_safe_area_new, content)

    # Adjust ampersand size and margins to prevent overlap with script fonts
    content = re.sub(r'\.style-ampersand\s*\{([^}]+)\}', 
                     lambda m: '.style-ampersand {' + re.sub(r'font-size:\s*[\d.]+cqi;', 'font-size: 6.000cqi; margin-top: 1cqi; margin-bottom: 1cqi;', m.group(1)) + '}', content)

    # Adjust bride/groom font line height to be a bit more generous to prevent clipping
    content = re.sub(r'\.style-brideName\s*\{([^}]+)\}', 
                     lambda m: '.style-brideName {' + re.sub(r'line-height:\s*[\d.]+;', 'line-height: 1.6;', m.group(1)) + '}', content)
    content = re.sub(r'\.style-groomName\s*\{([^}]+)\}', 
                     lambda m: '.style-groomName {' + re.sub(r'line-height:\s*[\d.]+;', 'line-height: 1.6;', m.group(1)) + '}', content)

    # Make details (date/time/venue labels) smaller and more elegant
    for label in ['style-dateLabel', 'style-timeLabel', 'style-venueLabel']:
        content = re.sub(r'\.' + label + r'\s*\{([^}]+)\}', 
                         lambda m: '.' + label + ' {' + re.sub(r'margin-top:\s*[\d.]+cqi;', 'margin-top: 3.000cqi; font-size: 3.000cqi; opacity: 0.9;', m.group(1)) + '}', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied high-class styling tweaks.")
