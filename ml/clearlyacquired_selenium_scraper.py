"""
Advanced scraper for ClearlyAcquired using Selenium to handle JavaScript
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import json
import time
import logging
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ClearlyAcquiredSeleniumScraper:
    def __init__(self, headless: bool = True):
        """Initialize the scraper with Selenium"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 20)
        self.base_url = "https://app.clearlyacquired.com"

    def scrape_listings(self) -> List[Dict]:
        """Scrape all business listings"""
        url = f"{self.base_url}/listings"
        logger.info(f"Opening {url}")

        try:
            self.driver.get(url)
            time.sleep(5)  # Wait for page to load

            # Save page source for debugging
            with open('clearlyacquired_page_source.html', 'w', encoding='utf-8') as f:
                f.write(self.driver.page_source)
            logger.info("Saved page source to clearlyacquired_page_source.html")

            listings = []

            # Try multiple selectors to find listings
            selectors = [
                "//div[contains(@class, 'listing')]",
                "//div[contains(@class, 'card')]",
                "//article",
                "//div[contains(@class, 'item')]",
                "//div[@data-testid='listing']",
                "//a[contains(@href, '/listing/')]",
            ]

            for selector in selectors:
                try:
                    elements = self.driver.find_elements(By.XPATH, selector)
                    if elements:
                        logger.info(f"Found {len(elements)} elements with selector: {selector}")
                        break
                except NoSuchElementException:
                    continue

            # If no specific listing elements found, try to extract all visible text
            if not elements:
                logger.warning("No listing elements found with standard selectors")
                logger.info("Extracting page structure...")
                body = self.driver.find_element(By.TAG_NAME, "body")
                logger.info(f"Page text preview:\n{body.text[:500]}")
                return listings

            # Parse each listing
            for element in elements:
                try:
                    listing = self.parse_listing_element(element)
                    if listing:
                        listings.append(listing)
                except Exception as e:
                    logger.error(f"Error parsing element: {e}")
                    continue

            logger.info(f"Successfully scraped {len(listings)} listings")
            return listings

        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return []
        finally:
            self.driver.quit()

    def parse_listing_element(self, element) -> Dict:
        """Parse a single listing element"""
        listing = {}

        try:
            # Try to extract text content
            listing['text'] = element.text.strip()

            # Try to extract link
            try:
                link = element.find_element(By.TAG_NAME, "a")
                listing['url'] = link.get_attribute('href')
            except NoSuchElementException:
                listing['url'] = element.get_attribute('href') if element.tag_name == 'a' else None

            # Try to extract data attributes
            for attr in ['data-id', 'data-title', 'data-price', 'data-location']:
                value = element.get_attribute(attr)
                if value:
                    listing[attr.replace('data-', '')] = value

            return listing if listing.get('text') or listing.get('url') else None

        except Exception as e:
            logger.error(f"Error parsing listing element: {e}")
            return None

    def save_to_json(self, listings: List[Dict], filename: str = "clearlyacquired_listings.json"):
        """Save listings to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(listings, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(listings)} listings to {filename}")


def main():
    logger.info("Starting ClearlyAcquired Selenium scraper...")

    scraper = ClearlyAcquiredSeleniumScraper(headless=False)  # Set to False to see browser
    listings = scraper.scrape_listings()

    if listings:
        logger.info(f"\nSuccessfully scraped {len(listings)} listings")
        scraper.save_to_json(listings)

        # Print first few listings
        for i, listing in enumerate(listings[:3], 1):
            logger.info(f"\nListing {i}:")
            for key, value in listing.items():
                logger.info(f"  {key}: {value[:100] if isinstance(value, str) and len(value) > 100 else value}")
    else:
        logger.warning("No listings found")
        logger.info("Check clearlyacquired_page_source.html to see what the page contains")


if __name__ == "__main__":
    main()
