#!/usr/bin/env python3
"""
Update navigation menus in all HTML files to add new pages.
Run this from your website's root directory (insurio-repo2).

Usage:
    python update_nav.py           # Dry run (preview changes)
    python update_nav.py --apply   # Apply changes
"""

import os
import re
import argparse


# New desktop navigation HTML
NEW_NAV_LINKS = '''<ul class="nav-links">
                    <li><a href="/for-clients/">For Clients</a></li>
                    <li><a href="/compare/">Compare</a></li>
                    <li><a href="/partners/">Partner Program</a></li>
                    <li><a href="/enterprise/">For Platforms</a></li>
                    <li><a href="/contact/">Contact</a></li>
                </ul>'''

# New mobile navigation HTML
NEW_MOBILE_NAV = '''<nav class="mobile-nav">
            <ul>
                <li><a href="/for-clients/">For Clients</a></li>
                <li><a href="/compare/">Compare</a></li>
                <li><a href="/partners/">Partner Program</a></li>
                <li><a href="/enterprise/">For Platforms</a></li>
                <li><a href="/integrate/">Integration & API</a></li>
                <li><a href="/contact/">Contact</a></li>
            </ul>
        </nav>'''


def update_html_file(file_path, dry_run=True):
    """
    Update navigation in a single HTML file.
    Returns: (was_modified, message)
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # Check if already updated (has /enterprise/ link)
    if '/enterprise/' in content and '/integrate/' in content:
        return False, f"✓ Already updated: {file_path}"
    
    # Update desktop nav (nav-links)
    nav_pattern = r'<ul class="nav-links">.*?</ul>'
    if re.search(nav_pattern, content, re.DOTALL):
        content = re.sub(nav_pattern, NEW_NAV_LINKS, content, flags=re.DOTALL)
        changes.append("desktop nav")
    
    # Update mobile nav
    mobile_pattern = r'<nav class="mobile-nav">.*?</nav>'
    if re.search(mobile_pattern, content, re.DOTALL):
        content = re.sub(mobile_pattern, NEW_MOBILE_NAV, content, flags=re.DOTALL)
        changes.append("mobile nav")
    
    if content == original_content:
        return False, f"⚠ No nav found: {file_path}"
    
    if dry_run:
        return True, f"→ Would update {', '.join(changes)}: {file_path}"
    else:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, f"✓ Updated {', '.join(changes)}: {file_path}"


def find_html_files(root_dir):
    """Find all HTML files in the directory tree."""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip directories that shouldn't be processed
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.venv', 'venv', 'js', 'images']]
        
        for file in files:
            if file.endswith(('.html', '.htm')):
                html_files.append(os.path.join(root, file))
    
    return sorted(html_files)


def main():
    parser = argparse.ArgumentParser(
        description='Update navigation menus in all HTML files.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python update_nav.py                    # Preview changes
    python update_nav.py --apply            # Apply changes
        """
    )
    parser.add_argument('--apply', action='store_true', 
                        help='Actually modify files (default is dry run)')
    parser.add_argument('--dir', type=str, default='.', 
                        help='Root directory of your website (default: current directory)')
    
    args = parser.parse_args()
    
    root_dir = os.path.abspath(args.dir)
    dry_run = not args.apply
    
    if not os.path.isdir(root_dir):
        print(f"Error: Directory not found: {root_dir}")
        return 1
    
    print(f"{'DRY RUN - ' if dry_run else ''}Scanning: {root_dir}\n")
    print("Adding new nav links:")
    print("  • /enterprise/ (For Platforms)")
    print("  • /integrate/ (Integration & API)\n")
    
    html_files = find_html_files(root_dir)
    
    if not html_files:
        print("No HTML files found.")
        return 0
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    for file_path in html_files:
        was_modified, message = update_html_file(file_path, dry_run)
        print(message)
        
        if was_modified:
            updated_count += 1
        elif message.startswith('✓'):
            skipped_count += 1
        else:
            error_count += 1
    
    print(f"\n{'=' * 50}")
    print(f"Summary:")
    print(f"  Total HTML files: {len(html_files)}")
    print(f"  {'Would update' if dry_run else 'Updated'}: {updated_count}")
    print(f"  Already updated: {skipped_count}")
    print(f"  No nav found: {error_count}")
    
    if dry_run and updated_count > 0:
        print(f"\nTo apply these changes, run:")
        print(f"  python update_nav.py --apply")
    elif not dry_run and updated_count > 0:
        print(f"\n✓ Navigation updated in all files!")
    
    return 0


if __name__ == '__main__':
    result = main()
    print("\n")
    input("Press Enter to close...")
    exit(result)
