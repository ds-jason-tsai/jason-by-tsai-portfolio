import os
import re

directory = 'content/articles'
# Pattern to find a space followed by (http://...) or (https://...)
# We use a non-greedy match for the URL and stop at )
pattern = r' ?\((https?://[^\s)]+)\)'

for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        modified = False
        
        # We only want to process body lines, not the frontmatter or the "Further Reading" section
        # But wait, "Further Reading" sections usually have - [Title](URL)
        # Our regex `(?<!\])\((https?://[^\s)]+)\)` is better because it avoids markdown links.
        
        body_url_pattern = r'(?<!\])\((https?://[^\s)]+)\)'
        
        # Let's also handle the case where there is a space before the parenthesis
        body_url_pattern_with_space = r' ?(?<!\])\((https?://[^\s)]+)\)'

        for line in lines:
            # Skip lines that are likely part of a markdown link [Title](URL)
            # and skip the Further Reading section links: - [Title](URL)
            
            # The regex (?<!\]) handles the markdown link case.
            
            new_line = re.sub(body_url_pattern_with_space, '', line)
            if new_line != line:
                modified = True
            new_lines.append(new_line)
            
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
