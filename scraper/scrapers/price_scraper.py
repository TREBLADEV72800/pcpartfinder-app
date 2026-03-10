"""Price-only scraper for incremental updates."""
from typing import List, Dict, Any
from datetime import datetime
from loguru import logger

from .base_scraper import BaseScraper
from .pypartpicker_scraper import PyPartPickerScraper


class PriceScraper(BaseScraper):
    """Scrape prices only, no full part data."""

    def __init__(self, region: str = "us", config=None):
        """
        Initialize price scraper.

        Args:
            region: Region code
            config: Scraper configuration
        """
        super().__init__(config)
        self.region = region
        self.pcpp_scraper = PyPartPickerScraper(region=region, config=config)

    async def _fetch(self, url: str, **kwargs) -> Any:
        """Delegate to pypartpicker scraper."""
        return await self.pcpp_scraper._fetch(url, **kwargs)

    async def scrape_part_prices(self, part_url: str) -> List[Dict[str, Any]]:
        """
        Scrape prices for a single part.

        Args:
            part_url: PCPartPicker part URL

        Returns:
            List of price dictionaries
        """
        try:
            part_data = await self.scrape_part(part_url)

            if not part_data:
                return []

            # Extract prices from part data
            prices = []
            cheapest_price = part_data.get("price")

            if cheapest_price:
                prices.append({
                    "retailer": cheapest_price.base_price.name if hasattr(cheapest_price.base_price, "name") else "Unknown",
                    "price": cheapest_price.base_price.value,
                    "shipping": cheapest_price.shipping.value if cheapest_price.shipping else None,
                    "currency": cheapest_price.base_price.currency,
                    "in_stock": True,
                    "url": cheapest_price.base_price.link if hasattr(cheapest_price.base_price, "link") else None,
                    "scraped_at": datetime.utcnow().isoformat(),
                })

            return prices

        except Exception as e:
            logger.error(f"Failed to scrape prices for {part_url}: {e}")
            return []

    async def scrape(self, part_urls: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Scrape prices for multiple parts.

        Args:
            part_urls: List of PCPartPicker part URLs

        Returns:
            Dictionary mapping URL to list of prices
        """
        results = {}

        for i, url in enumerate(part_urls):
            logger.info(f"Scraping prices for part {i + 1}/{len(part_urls)}")

            prices = await self.scrape_part_prices(url)
            results[url] = prices

            self.log_progress(i + 1, len(part_urls))

        logger.info(f"Scraped prices for {len(results)} parts")
        return results
