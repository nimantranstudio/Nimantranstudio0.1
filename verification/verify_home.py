from playwright.sync_api import Page, expect, sync_playwright
import time

def test_home_page(page: Page):
    # 1. Arrange: Go to the home page.
    print("Navigating to home page...")
    page.goto("http://localhost:3000")

    # 2. Act: Scroll to Features and Pricing sections.
    # Features Section
    print("Locating Features section...")
    features_section = page.locator("section").filter(has_text="Designed for the Indian Wedding")
    expect(features_section).to_be_visible()
    features_section.scroll_into_view_if_needed()
    # Wait for animation if any
    time.sleep(1)

    # 3. Screenshot Features
    print("Taking Features screenshot...")
    page.screenshot(path="verification/features.png")

    # Pricing Section
    print("Locating Pricing section...")
    pricing_section = page.locator("section").filter(has_text="Choose what fits your celebration")
    expect(pricing_section).to_be_visible()
    pricing_section.scroll_into_view_if_needed()
    # Wait for animation if any
    time.sleep(1)

    # 4. Screenshot Pricing
    print("Taking Pricing screenshot...")
    page.screenshot(path="verification/pricing.png")

    # Full page screenshot
    # page.screenshot(path="verification/home_full.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_home_page(page)
        finally:
            browser.close()
