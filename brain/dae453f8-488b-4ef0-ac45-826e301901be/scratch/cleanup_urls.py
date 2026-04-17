import os
import re

directory = 'content/articles'
# Pattern to find (http://...) or (https://...) in the text
pattern = r'\((https?://[^\s)]+)\)'

for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it has Further Reading section to make sure we don't lose the URLs
        # But actually the user said they are already in the "Further Reading" section, 
        # just remove them from the body.
        
        # However, we only want to remove them if they are in the body, not if they are part of a markdown link [Title](URL)
        # Markdown links are [Title](URL) - we should NOT remove those.
        # Parenthesized URLs are just (URL) - we SHOULD remove those.
        
        # Regex to match (URL) that is NOT preceded by ]
        # Negative lookbehind: (?<!\])
        body_url_pattern = r'(?<!\])\((https?://[^\s)]+)\)'
        
        new_content = re.sub(body_url_pattern, '', content)
        
        if new_content != content:
            print(f"Cleaning up URLs in body for {filename}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
