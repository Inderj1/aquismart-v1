"""
API-based scraper for ClearlyAcquired - captures network requests
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import json
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def scrape_clearlyacquired_api():
    """Scrape using network interception"""

    # Enable performance logging
    caps = DesiredCapabilities.CHROME
    caps['goog:loggingPrefs'] = {'performance': 'ALL'}

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=chrome_options, desired_capabilities=caps)

    try:
        url = "https://app.clearlyacquired.com/listings"
        logger.info(f"Loading {url}")
        driver.get(url)

        # Wait for page to load
        time.sleep(10)

        # Get network logs
        logs = driver.get_log('performance')

        api_calls = []
        for log in logs:
            message = json.loads(log['message'])['message']

            # Look for Network responses
            if message['method'] == 'Network.responseReceived':
                response_url = message['params']['response']['url']

                # Filter for API calls
                if 'api' in response_url or 'listing' in response_url.lower():
                    api_calls.append({
                        'url': response_url,
                        'status': message['params']['response']['status'],
                        'type': message['params']['response']['mimeType']
                    })
                    logger.info(f"Found API call: {response_url}")

        # Save API calls
        with open('clearlyacquired_api_calls.json', 'w') as f:
            json.dump(api_calls, f, indent=2)

        logger.info(f"Found {len(api_calls)} API calls")

        # Try to extract data from page
        page_source = driver.page_source

        # Look for JSON data in script tags
        if '__NUXT__' in page_source or '__INITIAL_STATE__' in page_source:
            logger.info("Found state data in page - Vue/Nuxt app")

            # Save for manual inspection
            with open('page_for_inspection.html', 'w', encoding='utf-8') as f:
                f.write(page_source)

        return api_calls

    finally:
        driver.quit()


if __name__ == "__main__":
    logger.info("Starting API scraper...")
    api_calls = scrape_clearlyacquired_api()

    if api_calls:
        logger.info("\nAPI Calls Found:")
        for call in api_calls[:10]:  # Show first 10
            logger.info(f"  {call['url']}")
    else:
        logger.warning("No API calls found - data may be embedded in page or requires authentication")
