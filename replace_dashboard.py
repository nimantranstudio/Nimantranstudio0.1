import sys
import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_target = "import styles from './dashboard.module.css';"
imports_replacement = "import styles from './dashboard.module.css';\nimport redesignStyles from './dashboard-redesign.module.css';\nimport { motion } from 'framer-motion';"
if imports_target in content and "dashboard-redesign" not in content:
    content = content.replace(imports_target, imports_replacement)

# Replace return block
return_marker = "    return (\n        <>\n        <div className={styles.dashboardContainer}>"
idx = content.find(return_marker)

if idx != -1:
    before = content[:idx]
    
    # Read the new JSX template from a file
    with open('src/app/dashboard/new-jsx.txt', 'r') as f:
        new_jsx = f.read()
        
    content = before + new_jsx
    
    with open('src/app/dashboard/page.tsx', 'w') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Could not find the return marker.")
