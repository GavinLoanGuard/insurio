#!/usr/bin/env python3
"""
Insurio Website Auto-Update Script
Automatically applies all copy changes to HTML files
"""

import os
import sys
import re
from pathlib import Path

class InsurioUpdater:
    def __init__(self, repo_path):
        self.repo_path = Path(repo_path)
        self.changes_made = []
        self.errors = []
        
    def log_change(self, file, description):
        self.changes_made.append(f"✓ {file}: {description}")
        
    def log_error(self, file, description):
        self.errors.append(f"✗ {file}: {description}")
    
    def read_file(self, filepath):
        """Read file content"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            self.log_error(filepath, f"Failed to read: {e}")
            return None
    
    def write_file(self, filepath, content):
        """Write file content"""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            self.log_error(filepath, f"Failed to write: {e}")
            return False
    
    def update_footer_logo(self, filepath):
        """Update footer logo to use logo-white.webp"""
        content = self.read_file(filepath)
        if content is None:
            return False
        
        original = content
        
        # Replace both possible logo paths
        content = re.sub(
            r'<img src="\.\.\/images\/logo\.webp" alt="Insurio">',
            '<img src="/images/logo-white.webp" alt="Insurio" style="height:44px;width:auto">',
            content
        )
        content = re.sub(
            r'<img src="images\/logo\.webp" alt="Insurio">',
            '<img src="/images/logo-white.webp" alt="Insurio" style="height:44px;width:auto">',
            content
        )
        
        # Remove the filter style if it exists (it's in CSS, not inline)
        # This is just a safety check
        
        if content != original:
            if self.write_file(filepath, content):
                self.log_change(filepath, "Updated footer logo")
                return True
        else:
            self.log_error(filepath, "Footer logo pattern not found")
            return False
    
    def update_homepage(self):
        """Update homepage (index.html)"""
        filepath = self.repo_path / "index.html"
        content = self.read_file(filepath)
        if content is None:
            return False
        
        changes = 0
        
        # Update 1: Hero description
        old_hero = r'<p class="hero-description">Not the bank\. Get coverage that\'s portable, stays level, and pays your family directly—not the lender\'s balance sheet\. Exposed the truth about bank mortgage insurance\.</p>'
        new_hero = '<p class="hero-description">For Canadian homeowners with a mortgage, backed by Canada\'s leading insurers. Get coverage that\'s portable, stays level, and pays your family directly—not the lender\'s balance sheet.</p>'
        
        if re.search(old_hero, content):
            content = re.sub(old_hero, new_hero, content)
            changes += 1
        
        # Update 2: Add timing section after Trust Bar
        # Find the closing of trust-bar section followed by stats section
        trust_bar_pattern = r'(</section>\s*\n\s*<!-- Stats -->)'
        timing_section = '''</section>

        <!-- Why This Matters Now -->
        <section style="padding:60px 0;background:var(--slate-50)">
            <div class="container">
                <div style="max-width:800px;margin:0 auto;text-align:center">
                    <p style="font-size:17px;color:var(--slate-600);line-height:1.7">Most Canadians are offered mortgage insurance automatically when they get their mortgage—without being shown what else is available. Individual mortgage protection gives you ownership, portability, and control that bank insurance doesn't.</p>
                </div>
            </div>
        </section>

        <!-- Stats -->'''
        
        if re.search(trust_bar_pattern, content) and 'Why This Matters Now' not in content:
            content = re.sub(trust_bar_pattern, timing_section, content)
            changes += 1
        
        if changes > 0:
            if self.write_file(filepath, content):
                self.log_change("index.html", f"Made {changes} content updates")
                return True
        else:
            self.log_error("index.html", "Could not find patterns to update")
            return False
    
    def update_for_clients(self):
        """Update for-clients/index.html"""
        filepath = self.repo_path / "for-clients" / "index.html"
        if not filepath.exists():
            self.log_error(str(filepath), "File not found")
            return False
            
        content = self.read_file(filepath)
        if content is None:
            return False
        
        changes = 0
        
        # Update 1: Add coverage guidance
        coverage_pattern = r'(Most clients combine these coverages based on their mortgage amount, income, and family situation\.</p>\s*</div>\s*\n\s*<div class="problem-grid">)'
        coverage_addition = r'Most clients combine these coverages based on their mortgage amount, income, and family situation.</p>\n                </div>\n\n                <p style="font-size:17px;color:var(--slate-600);line-height:1.7;margin-bottom:32px;text-align:center">Most clients start with life insurance as the foundation and add disability or critical illness coverage based on their income, family situation, and existing coverage.</p>\n\n                <div class="problem-grid">'
        
        if re.search(coverage_pattern, content):
            content = re.sub(coverage_pattern, coverage_addition, content)
            changes += 1
        
        # Update 2: Update process description
        old_process = r'<p>We make it easy to understand your options and decide on your terms\.</p>'
        new_process = '<p>We make it easy to understand your options and decide on your terms. Quotes are personalized based on your age, health, and coverage amount—final pricing is confirmed after underwriting.</p>'
        
        if re.search(old_process, content):
            content = re.sub(old_process, new_process, content)
            changes += 1
        
        if changes > 0:
            if self.write_file(filepath, content):
                self.log_change("for-clients/index.html", f"Made {changes} content updates")
                return True
        else:
            self.log_error("for-clients/index.html", "Could not find patterns to update")
            return False
    
    def update_compare(self):
        """Update compare/index.html"""
        filepath = self.repo_path / "compare" / "index.html"
        if not filepath.exists():
            self.log_error(str(filepath), "File not found")
            return False
            
        content = self.read_file(filepath)
        if content is None:
            return False
        
        # Add disclaimer after comparison table
        table_end_pattern = r'(</table>\s*</div>\s*</div>\s*</div>\s*</section>\s*\n\s*<!-- Warning Section -->)'
        disclaimer = '''</table>
                </div>
                
                <p style="text-align:center;font-size:14px;color:var(--slate-500);margin-top:32px;max-width:800px;margin-left:auto;margin-right:auto">This comparison reflects typical bank creditor insurance structures. Specific terms and conditions vary by lender. Individual mortgage protection policies are underwritten by Canada's leading life insurers and subject to individual underwriting approval.</p>
            </div>
        </section>

        <!-- Warning Section -->'''
        
        if re.search(table_end_pattern, content) and 'typical bank creditor insurance structures' not in content:
            content = re.sub(table_end_pattern, disclaimer, content, count=1)
            if self.write_file(filepath, content):
                self.log_change("compare/index.html", "Added disclaimer after comparison table")
                return True
        else:
            self.log_error("compare/index.html", "Could not find pattern or already updated")
            return False
    
    def update_partners(self):
        """Update partners/index.html"""
        filepath = self.repo_path / "partners" / "index.html"
        if not filepath.exists():
            self.log_error(str(filepath), "File not found")
            return False
            
        content = self.read_file(filepath)
        if content is None:
            return False
        
        changes = 0
        
        # Update 1: Add de-risk section after hero
        hero_end_pattern = r'(</section>\s*\n\s*<section class="trust-bar">)'
        derisk_section = '''</section>

        <!-- De-Risk Message -->
        <section style="padding:48px 0;background:var(--navy-50)">
            <div class="container">
                <div style="max-width:900px;margin:0 auto;text-align:center">
                    <p style="font-size:17px;color:var(--slate-700);line-height:1.7">Insurio handles all licensing, compliance, carrier communication, and underwriting. You make the introduction—we take care of everything else.</p>
                </div>
            </div>
        </section>

        <section class="trust-bar">'''
        
        if re.search(hero_end_pattern, content) and 'De-Risk Message' not in content:
            content = re.sub(hero_end_pattern, derisk_section, content, count=1)
            changes += 1
        
        # Update 2: Add compensation structure box
        partner_types_pattern = r'(<p>If your clients need mortgage protection, we should be working together\.</p>\s*</div>)'
        compensation_box = r'<p>If your clients need mortgage protection, we should be working together.</p>\n                    <div style="max-width:800px;margin:24px auto 0;padding:20px 24px;background:var(--slate-50);border-radius:12px;border:1px solid var(--slate-200)">\n                        <p style="font-size:15px;color:var(--slate-700);line-height:1.7;margin:0"><strong>Compensation structure:</strong> Licensed insurance professionals may receive commission where permitted by their license and provincial regulations. Non-licensed referral partners receive a flat referral fee that is not contingent on policy approval or issuance.</p>\n                    </div>\n                </div>'
        
        if re.search(partner_types_pattern, content) and 'Compensation structure' not in content:
            content = re.sub(partner_types_pattern, compensation_box, content)
            changes += 1
        
        # Update 3: Add pilot program line before form
        form_pattern = r'(<div>\s*<div class="form-card">\s*<form id="partnerForm")'
        pilot_line = r'<div>\n                        <p style="font-size:15px;color:var(--slate-600);line-height:1.7;margin-bottom:24px;text-align:center">Insurio is currently onboarding a select group of referral partners as we expand the program across Canada.</p>\n                        \n                        <div class="form-card">\n                            <form id="partnerForm"'
        
        if re.search(form_pattern, content) and 'currently onboarding a select group' not in content:
            content = re.sub(form_pattern, pilot_line, content)
            changes += 1
        
        if changes > 0:
            if self.write_file(filepath, content):
                self.log_change("partners/index.html", f"Made {changes} content updates")
                return True
        else:
            self.log_error("partners/index.html", "Could not find patterns to update")
            return False
    
    def update_contact(self):
        """Update contact/index.html"""
        filepath = self.repo_path / "contact" / "index.html"
        if not filepath.exists():
            self.log_error(str(filepath), "File not found")
            return False
            
        content = self.read_file(filepath)
        if content is None:
            return False
        
        changes = 0
        
        # Update 1: Hero heading
        old_heading = r'<h1>Let\'s talk about <span class="highlight">protection</span></h1>'
        new_heading = '<h1>Questions about <span class="highlight">mortgage protection?</span></h1>'
        
        if re.search(old_heading, content):
            content = re.sub(old_heading, new_heading, content)
            changes += 1
        
        # Update 2: Hero description
        old_desc = r'<p class="hero-description" style="margin-left:auto;margin-right:auto">Get a personalized quote or ask us anything\. No obligation, fast response, real conversation\.</p>'
        new_desc = '<p class="hero-description" style="margin-left:auto;margin-right:auto">Request a personalized quote or ask us about coverage options. No obligation, fast response.</p>'
        
        if re.search(old_desc, content):
            content = re.sub(old_desc, new_desc, content)
            changes += 1
        
        if changes > 0:
            if self.write_file(filepath, content):
                self.log_change("contact/index.html", f"Made {changes} content updates")
                return True
        else:
            self.log_error("contact/index.html", "Could not find patterns to update")
            return False
    
    def run_all_updates(self):
        """Run all updates"""
        print("🚀 Starting Insurio Website Auto-Update\n")
        
        # Check if we're in the right directory
        if not (self.repo_path / "index.html").exists():
            print("❌ ERROR: index.html not found. Please run this script from your repo root.")
            print(f"   Current path: {self.repo_path}")
            sys.exit(1)
        
        print("📁 Repository found. Starting updates...\n")
        
        # Update all HTML files
        files_to_update = [
            ("index.html", self.update_homepage),
            ("for-clients/index.html", self.update_for_clients),
            ("compare/index.html", self.update_compare),
            ("partners/index.html", self.update_partners),
            ("contact/index.html", self.update_contact),
        ]
        
        # Update footer logos in all files
        print("🔄 Updating footer logos...")
        footer_files = [
            "index.html",
            "404.html",
            "for-clients/index.html",
            "compare/index.html",
            "partners/index.html",
            "contact/index.html",
            "privacy/index.html",
            "terms/index.html"
        ]
        
        for file in footer_files:
            filepath = self.repo_path / file
            if filepath.exists():
                self.update_footer_logo(filepath)
        
        print()
        
        # Update content in specific files
        print("✏️  Updating page content...")
        for filename, update_func in files_to_update:
            update_func()
        
        print()
        
        # Print summary
        print("=" * 60)
        print("📊 UPDATE SUMMARY")
        print("=" * 60)
        
        if self.changes_made:
            print(f"\n✅ Successfully made {len(self.changes_made)} changes:\n")
            for change in self.changes_made:
                print(f"   {change}")
        
        if self.errors:
            print(f"\n⚠️  Encountered {len(self.errors)} issues:\n")
            for error in self.errors:
                print(f"   {error}")
        
        print("\n" + "=" * 60)
        
        if not self.errors:
            print("✨ All updates completed successfully!")
            print("\n📝 Next steps:")
            print("   1. Review the changes: git diff")
            print("   2. Test locally if desired")
            print("   3. Upload images/logo-white.webp to your repo")
            print("   4. Commit: git add . && git commit -m 'Update copy for clarity and compliance'")
            print("   5. Push: git push origin [branch-name]")
        else:
            print("⚠️  Some updates had issues. Please review and fix manually.")
            print("   See COPY-PASTE-SNIPPETS.md for manual instructions.")
        
        return len(self.errors) == 0


def main():
    if len(sys.argv) > 1:
        repo_path = sys.argv[1]
    else:
        repo_path = os.getcwd()
    
    updater = InsurioUpdater(repo_path)
    success = updater.run_all_updates()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
