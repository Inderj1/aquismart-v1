"""
Scraper for ClearlyAcquired business listings
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ClearlyAcquiredScraper:
    def __init__(self):
        self.base_url = "https://app.clearlyacquired.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def fetch_page(self, url: str, max_retries: int = 3) -> Optional[str]:
        """Fetch a page with retry logic"""
        for attempt in range(max_retries):
            try:
                logger.info(f"Fetching {url} (attempt {attempt + 1}/{max_retries})")
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except requests.exceptions.RequestException as e:
                logger.error(f"Error fetching {url}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    return None
        return None

    def parse_listing(self, listing_element) -> Optional[Dict]:
        """Parse a single listing element"""
        try:
            listing = {}

            # Extract title
            title_elem = listing_element.find(['h2', 'h3', 'h4'], class_=lambda x: x and 'title' in x.lower())
            if title_elem:
                listing['title'] = title_elem.get_text(strip=True)

            # Extract location
            location_elem = listing_element.find(class_=lambda x: x and 'location' in x.lower())
            if location_elem:
                listing['location'] = location_elem.get_text(strip=True)

            # Extract price/revenue
            price_elem = listing_element.find(class_=lambda x: x and ('price' in x.lower() or 'revenue' in x.lower()))
            if price_elem:
                listing['price'] = price_elem.get_text(strip=True)

            # Extract industry/category
            category_elem = listing_element.find(class_=lambda x: x and ('category' in x.lower() or 'industry' in x.lower()))
            if category_elem:
                listing['category'] = category_elem.get_text(strip=True)

            # Extract link
            link_elem = listing_element.find('a', href=True)
            if link_elem:
                listing['url'] = link_elem['href']
                if not listing['url'].startswith('http'):
                    listing['url'] = self.base_url + listing['url']

            return listing if listing else None
        except Exception as e:
            logger.error(f"Error parsing listing: {e}")
            return None

    def scrape_listings(self, url: str = None) -> List[Dict]:
        """Scrape all listings from the page"""
        if url is None:
            url = f"{self.base_url}/listings"

        html = self.fetch_page(url)
        if not html:
            logger.error("Failed to fetch page")
            return []

        soup = BeautifulSoup(html, 'html.parser')

        # Try different common listing container patterns
        listing_containers = (
            soup.find_all('div', class_=lambda x: x and 'listing' in x.lower()) or
            soup.find_all('div', class_=lambda x: x and 'card' in x.lower()) or
            soup.find_all('article') or
            soup.find_all('div', class_=lambda x: x and 'item' in x.lower())
        )

        logger.info(f"Found {len(listing_containers)} potential listing containers")

        listings = []
        for container in listing_containers:
            listing = self.parse_listing(container)
            if listing:
                listings.append(listing)

        # Check if page has JSON data
        script_tags = soup.find_all('script', type='application/json')
        for script in script_tags:
            try:
                data = json.loads(script.string)
                logger.info(f"Found JSON data: {type(data)}")
                # Process JSON data if it contains listings
            except json.JSONDecodeError:
                pass

        return listings

    def save_to_json(self, listings: List[Dict], filename: str = "clearlyacquired_listings.json"):
        """Save listings to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(listings, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(listings)} listings to {filename}")


def main():
    scraper = ClearlyAcquiredScraper()

    logger.info("Starting ClearlyAcquired scraper...")
    listings = scraper.scrape_listings()

    if listings:
        logger.info(f"Successfully scraped {len(listings)} listings")
        scraper.save_to_json(listings)

        # Print first few listings
        for i, listing in enumerate(listings[:3], 1):
            logger.info(f"\nListing {i}:")
            for key, value in listing.items():
                logger.info(f"  {key}: {value}")
    else:
        logger.warning("No listings found. The page might be using JavaScript to load content.")
        logger.info("You may need to use Selenium or Playwright for JavaScript-rendered pages.")


if __name__ == "__main__":
    main()
