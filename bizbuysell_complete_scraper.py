"""
BizBuySell Complete Scraper with Images
This script requires Selenium and ChromeDriver to be installed locally

Installation:
    pip install selenium beautifulsoup4 requests pillow

    # For Chrome:
    Download ChromeDriver from https://chromedriver.chromium.org/
    
    # Or use webdriver-manager for automatic driver management:
    pip install webdriver-manager
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import csv
import requests
import os
import time
from datetime import datetime
from urllib.parse import urljoin

class BizBuySellScraper:
    def __init__(self, download_images=True, headless=True):
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
            chrome_options.add_argument('--headless')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        # Try to use webdriver-manager if available
        try:
            from webdriver_manager.chrome import ChromeDriverManager
            from selenium.webdriver.chrome.service import Service
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
        except:
            # Fallback to default Chrome driver
            driver = webdriver.Chrome(options=chrome_options)
        
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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            if response.status_code == 200:
                filepath = os.path.join('images', filename)
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"✓ Downloaded: {filename}")
                return filepath
            else:
                print(f"✗ Failed to download {filename}: Status {response.status_code}")
                return None
                
        except Exception as e:
            print(f"✗ Error downloading {filename}: {e}")
            return None
    
    def scrape_page(self, url, max_listings=None):
        """Scrape listings from a BizBuySell page"""
        print(f"\n{'='*60}")
        print(f"Scraping: {url}")
        print(f"{'='*60}\n")
        
        driver = self.setup_driver()
        
        try:
            # Load the page
            driver.get(url)
            print("Page loaded, waiting for content...")
            
            # Wait for listings to appear
            try:
                WebDriverWait(driver, 15).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/business/']"))
                )
                print("✓ Content loaded!")
            except:
                print("⚠ Timeout waiting for listings, proceeding anyway...")
            
            # Scroll to load more content
            print("Scrolling to load more listings...")
            for i in range(3):
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
            
            # Get page source
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            # Find all listing links
            listing_links = soup.find_all('a', href=lambda x: x and '/business/' in x)
            print(f"Found {len(listing_links)} potential listings")
            
            # Extract unique listing URLs
            listing_urls = list(set([
                urljoin('https://www.bizbuysell.com', link['href']) 
                for link in listing_links 
                if link.get('href')
            ]))
            
            if max_listings:
                listing_urls = listing_urls[:max_listings]
            
            print(f"\nProcessing {len(listing_urls)} unique listings...\n")
            
            # Scrape each listing
            for idx, listing_url in enumerate(listing_urls, 1):
                print(f"[{idx}/{len(listing_urls)}] Scraping: {listing_url}")
                listing_data = self.scrape_listing_detail(driver, listing_url, idx)
                if listing_data:
                    self.listings.append(listing_data)
                time.sleep(1)  # Be polite, don't hammer the server
            
        finally:
            driver.quit()
        
        return self.listings
    
    def scrape_listing_detail(self, driver, url, idx):
        """Scrape details from a single listing page"""
        try:
            driver.get(url)
            time.sleep(2)
            
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            listing = {
                'url': url,
                'scraped_at': datetime.now().isoformat()
            }
            
            # Extract title (try multiple selectors)
            title = (
                soup.find('h1') or 
                soup.find('h2', class_=lambda x: x and 'title' in x.lower()) or
                soup.find(class_=lambda x: x and 'business-name' in str(x).lower())
            )
            if title:
                listing['title'] = title.get_text(strip=True)
            
            # Extract price
            price = soup.find(string=lambda x: x and 'Asking Price' in x)
            if price:
                price_value = price.find_next()
                if price_value:
                    listing['price'] = price_value.get_text(strip=True)
            
            # Extract location
            location = soup.find(string=lambda x: x and 'Location' in x)
            if location:
                location_value = location.find_next()
                if location_value:
                    listing['location'] = location_value.get_text(strip=True)
            
            # Extract description
            description = soup.find('div', class_=lambda x: x and 'description' in str(x).lower())
            if description:
                listing['description'] = description.get_text(strip=True)[:500]
            
            # Extract revenue
            revenue = soup.find(string=lambda x: x and 'Revenue' in x)
            if revenue:
                revenue_value = revenue.find_next()
                if revenue_value:
                    listing['revenue'] = revenue_value.get_text(strip=True)
            
            # Extract cash flow / SDE
            cash_flow = soup.find(string=lambda x: x and 'Cash Flow' in x or x and 'SDE' in x)
            if cash_flow:
                cash_flow_value = cash_flow.find_next()
                if cash_flow_value:
                    listing['cash_flow'] = cash_flow_value.get_text(strip=True)
            
            # Extract images
            images = soup.find_all('img', src=lambda x: x and not x.endswith('.svg'))
            image_urls = []
            local_images = []
            
            for img_idx, img in enumerate(images[:5]):  # Limit to 5 images per listing
                img_url = img.get('src') or img.get('data-src')
                if img_url and 'logo' not in img_url.lower():
                    image_urls.append(img_url)
                    
                    if self.download_images:
                        img_filename = f"listing_{idx}_img_{img_idx+1}.jpg"
                        local_path = self.download_image(img_url, img_filename)
                        if local_path:
                            local_images.append(local_path)
            
            listing['image_urls'] = image_urls
            listing['local_images'] = local_images
            
            print(f"  ✓ Extracted: {listing.get('title', 'Untitled')}")
            
            return listing
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
            return None
    
    def export_json(self, filename='output/bizbuysell_listings_complete.json'):
        """Export listings to JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.listings, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Exported to {filename}")
    
    def export_csv(self, filename='output/bizbuysell_listings_complete.csv'):
        """Export listings to CSV"""
        if not self.listings:
            print("No listings to export")
            return
        
        # Flatten image arrays for CSV
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
        
        print(f"✓ Exported to {filename}")
    
    def print_summary(self):
        """Print summary statistics"""
        print(f"\n{'='*60}")
        print("SCRAPING COMPLETE")
        print(f"{'='*60}")
        print(f"Total listings scraped: {len(self.listings)}")
        print(f"Total images downloaded: {sum(len(l.get('local_images', [])) for l in self.listings)}")
        
        if self.listings:
            with_price = sum(1 for l in self.listings if l.get('price'))
            with_images = sum(1 for l in self.listings if l.get('image_urls'))
            print(f"Listings with price: {with_price}")
            print(f"Listings with images: {with_images}")
        
        print(f"{'='*60}\n")


def main():
    """Main execution"""
    # Configuration
    URL = "https://www.bizbuysell.com/businesses-for-sale/"
    DOWNLOAD_IMAGES = True
    HEADLESS = False  # Run with visible browser to see what's happening
    MAX_LISTINGS = 10  # Set to None for all listings
    
    # Initialize scraper
    scraper = BizBuySellScraper(
        download_images=DOWNLOAD_IMAGES,
        headless=HEADLESS
    )
    
    # Scrape listings
    listings = scraper.scrape_page(URL, max_listings=MAX_LISTINGS)
    
    # Export data
    scraper.export_json()
    scraper.export_csv()
    
    # Print summary
    scraper.print_summary()


if __name__ == "__main__":
    main()
