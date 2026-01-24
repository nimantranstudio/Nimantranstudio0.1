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

    # Debug: Print class attribute
    class_attr = features_section.get_attribute("class")
    print(f"Features section class: {class_attr}")

    features_section.scroll_into_view_if_needed()
    time.sleep(1)

    # 3. Screenshot Features
    print("Taking Features screenshot...")
    page.screenshot(path="verification/features_debug.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_home_page(page)
        finally:
            browser.close()
