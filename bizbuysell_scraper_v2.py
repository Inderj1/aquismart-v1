"""
Improved BizBuySell Scraper
Fixed to handle modern website structure
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import json
import csv
import requests
import os
import time
from datetime import datetime

class BizBuySellScraperV2:
    def __init__(self, download_images=True, headless=False):
        """Initialize the scraper"""
        self.download_images = download_images
        self.headless = headless
        self.listings = []

        # Create directories
        if download_images:
            os.makedirs('images', exist_ok=True)
        os.makedirs('output', exist_ok=True)

    def setup_driver(self):
        """Setup Chrome driver with options"""
        chrome_options = Options()

        if self.headless:
            chrome_options.add_argument('--headless=new')

        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)

        # Try to use webdriver-manager if available
        try:
            from webdriver_manager.chrome import ChromeDriverManager
            from selenium.webdriver.chrome.service import Service
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
        except:
            # Fallback to default Chrome driver
            driver = webdriver.Chrome(options=chrome_options)

        # Remove automation flags
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        return driver

    def download_image(self, url, filename):
        """Download an image from URL"""
        try:
            # Handle relative URLs
            if url.startswith('//'):
                url = 'https:' + url
            elif url.startswith('/'):
                url = 'https://www.bizbuysell.com' + url

            response = requests.get(url, timeout=10, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })

            if response.status_code == 200:
                filepath = os.path.join('images', filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"  ✓ Downloaded: {filename}")
                return filepath
            else:
                print(f"  ✗ Failed to download {filename}: Status {response.status_code}")
                return None

        except Exception as e:
            print(f"  ✗ Error downloading {filename}: {e}")
            return None

    def scrape_search_results(self, url, max_listings=10):
        """Scrape business listing URLs from search results"""
        print(f"\n{'='*60}")
        print(f"Scraping search results: {url}")
        print(f"{'='*60}\n")

        driver = self.setup_driver()
        listing_urls = []

        try:
            driver.get(url)
            print("Page loaded, waiting for content...")
            time.sleep(5)  # Give page time to load

            # Try multiple selector strategies
            selectors = [
                "a.result-title",
                "a[data-item-name]",
                "div.result a[href*='/business/']",
                "a[href*='/business/']",
                ".listing-link",
                "h3 a",
                "h2 a"
            ]

            links_found = False
            for selector in selectors:
                try:
                    links = driver.find_elements(By.CSS_SELECTOR, selector)
                    if links:
                        print(f"✓ Found {len(links)} links using selector: {selector}")
                        for link in links[:max_listings]:
                            href = link.get_attribute('href')
                            if href and '/business/' in href:
                                listing_urls.append(href)
                        links_found = True
                        break
                except Exception as e:
                    continue

            if not links_found:
                # Fallback: Get all links and filter
                print("Using fallback method: extracting all links...")
                all_links = driver.find_elements(By.TAG_NAME, 'a')
                print(f"Found {len(all_links)} total links on page")

                for link in all_links:
                    try:
                        href = link.get_attribute('href')
                        if href and '/business/' in href and 'bizbuysell.com' in href:
                            listing_urls.append(href)
                    except:
                        continue

            # Remove duplicates
            listing_urls = list(set(listing_urls))[:max_listings]

            print(f"\n✓ Found {len(listing_urls)} unique listing URLs")

            # Save screenshot for debugging
            driver.save_screenshot('output/search_results_screenshot.png')
            print("✓ Saved screenshot: output/search_results_screenshot.png")

            # Save page source for debugging
            with open('output/search_page_source.html', 'w', encoding='utf-8') as f:
                f.write(driver.page_source)
            print("✓ Saved page source: output/search_page_source.html")

        except Exception as e:
            print(f"✗ Error scraping search results: {e}")
        finally:
            driver.quit()

        return listing_urls

    def scrape_listing_detail(self, url, idx):
        """Scrape details from a single listing page"""
        print(f"\n[{idx}] Scraping: {url}")

        driver = self.setup_driver()

        try:
            driver.get(url)
            time.sleep(3)

            # Save screenshot
            driver.save_screenshot(f'output/listing_{idx}_screenshot.png')

            soup = BeautifulSoup(driver.page_source, 'html.parser')

            listing = {
                'id': str(idx),
                'url': url,
                'scraped_at': datetime.now().isoformat()
            }

            # Extract title - try multiple approaches
            title_selectors = ['h1', '.business-title', '.listing-title', '[class*="title"]']
            for selector in title_selectors:
                title = soup.select_one(selector)
                if title and title.get_text(strip=True):
                    listing['title'] = title.get_text(strip=True)
                    break

            # Extract all text content and look for patterns
            page_text = soup.get_text()

            # Look for price patterns
            import re
            price_patterns = [
                r'\$[\d,]+(?:\.\d{2})?(?:\s*(?:Million|M|K))?',
                r'Asking Price:?\s*\$?([\d,]+)',
                r'Price:?\s*\$?([\d,]+)'
            ]
            for pattern in price_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    listing['price'] = match.group(0)
                    break

            # Look for revenue
            revenue_patterns = [
                r'Revenue:?\s*\$?([\d,]+(?:\.\d+)?(?:\s*(?:Million|M|K))?)',
                r'Gross Revenue:?\s*\$?([\d,]+)'
            ]
            for pattern in revenue_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    listing['revenue'] = match.group(0)
                    break

            # Look for cash flow
            cf_patterns = [
                r'Cash Flow:?\s*\$?([\d,]+(?:\.\d+)?(?:\s*(?:Million|M|K))?)',
                r'SDE:?\s*\$?([\d,]+)',
                r'EBITDA:?\s*\$?([\d,]+)'
            ]
            for pattern in cf_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    listing['cash_flow'] = match.group(0)
                    break

            # Extract location
            location_patterns = [
                r'Location:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})',
                r'([A-Z][a-z]+,\s*[A-Z]{2})'
            ]
            for pattern in location_patterns:
                match = re.search(pattern, page_text)
                if match:
                    listing['location'] = match.group(1)
                    break

            # Extract description
            desc_selectors = ['.description', '.business-description', '[class*="description"]', 'p']
            for selector in desc_selectors:
                desc = soup.select_one(selector)
                if desc:
                    desc_text = desc.get_text(strip=True)
                    if len(desc_text) > 100:  # Only if substantial
                        listing['description'] = desc_text[:500]
                        break

            # Extract images
            images = soup.find_all('img')
            image_urls = []
            local_images = []

            for img_idx, img in enumerate(images[:5]):
                img_url = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
                if img_url and 'logo' not in img_url.lower() and img_url.startswith('http'):
                    image_urls.append(img_url)

                    if self.download_images and img_idx < 3:  # Download first 3
                        img_filename = f"listing_{idx}_img_{img_idx+1}.jpg"
                        local_path = self.download_image(img_url, img_filename)
                        if local_path:
                            local_images.append(local_path)

            listing['image_urls'] = image_urls
            listing['local_images'] = local_images

            # Extract industry/category
            category_patterns = [
                r'Category:?\s*([A-Za-z\s&-]+)',
                r'Industry:?\s*([A-Za-z\s&-]+)'
            ]
            for pattern in category_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    listing['industry'] = match.group(1).strip()
                    break

            print(f"  ✓ Title: {listing.get('title', 'N/A')[:50]}")
            print(f"  ✓ Price: {listing.get('price', 'N/A')}")
            print(f"  ✓ Location: {listing.get('location', 'N/A')}")
            print(f"  ✓ Images: {len(image_urls)}")

            return listing

        except Exception as e:
            print(f"  ✗ Error: {e}")
            import traceback
            traceback.print_exc()
            return None
        finally:
            driver.quit()

    def scrape(self, search_url, max_listings=10):
        """Main scraping method"""
        print("\n" + "="*60)
        print("BIZBUYSELL SCRAPER V2")
        print("="*60)

        # Step 1: Get listing URLs
        listing_urls = self.scrape_search_results(search_url, max_listings)

        if not listing_urls:
            print("\n⚠ No listing URLs found. Please check:")
            print("  1. The search URL is correct")
            print("  2. The website structure hasn't changed")
            print("  3. Check output/search_page_source.html for debugging")
            return []

        # Step 2: Scrape each listing
        print(f"\n{'='*60}")
        print(f"Scraping {len(listing_urls)} listing details...")
        print(f"{'='*60}")

        for idx, url in enumerate(listing_urls, 1):
            listing = self.scrape_listing_detail(url, idx)
            if listing:
                self.listings.append(listing)
            time.sleep(2)  # Be polite

        return self.listings

    def export_json(self, filename='output/bizbuysell_listings.json'):
        """Export listings to JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.listings, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Exported {len(self.listings)} listings to {filename}")

    def export_csv(self, filename='output/bizbuysell_listings.csv'):
        """Export listings to CSV"""
        if not self.listings:
            print("No listings to export")
            return

        csv_listings = []
        for listing in self.listings:
            flat_listing = listing.copy()
            flat_listing['image_urls'] = '; '.join(listing.get('image_urls', []))
            flat_listing['local_images'] = '; '.join(listing.get('local_images', []))
            csv_listings.append(flat_listing)

        keys = csv_listings[0].keys()
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(csv_listings)

        print(f"✓ Exported {len(self.listings)} listings to {filename}")

    def print_summary(self):
        """Print summary"""
        print(f"\n{'='*60}")
        print("SCRAPING COMPLETE")
        print(f"{'='*60}")
        print(f"Total listings scraped: {len(self.listings)}")

        if self.listings:
            with_price = sum(1 for l in self.listings if l.get('price'))
            with_location = sum(1 for l in self.listings if l.get('location'))
            with_images = sum(1 for l in self.listings if l.get('image_urls'))
            total_images = sum(len(l.get('local_images', [])) for l in self.listings)

            print(f"Listings with price: {with_price}")
            print(f"Listings with location: {with_location}")
            print(f"Listings with images: {with_images}")
            print(f"Total images downloaded: {total_images}")

        print(f"{'='*60}\n")


def main():
    """Main execution"""
    # Configuration
    SEARCH_URL = "https://www.bizbuysell.com/businesses-for-sale/"
    DOWNLOAD_IMAGES = True
    HEADLESS = False  # Set to True to run without browser window
    MAX_LISTINGS = 10

    # Initialize scraper
    scraper = BizBuySellScraperV2(
        download_images=DOWNLOAD_IMAGES,
        headless=HEADLESS
    )

    # Scrape listings
    listings = scraper.scrape(SEARCH_URL, max_listings=MAX_LISTINGS)

    # Export data
    if listings:
        scraper.export_json()
        scraper.export_csv()

    # Print summary
    scraper.print_summary()


if __name__ == "__main__":
    main()
