"""Category-specific scraper."""
from typing import List, Dict, Any
from loguru import logger

from .base_scraper import BaseScraper
from .pypartpicker_scraper import PyPartPickerScraper


class CategoryScraper(BaseScraper):
    """Scrape parts by category."""

    # Common search terms for each category
    CATEGORY_SEARCH_TERMS = {
        "cpu": ["ryzen 5", "ryzen 7", "ryzen 9", "intel i5", "intel i7", "intel i9"],
        "cpu-cooler": ["noctua nh-d15", "corsair h100i", "arctic freezer", "cooler master"],
        "motherboard": ["b550", "x570", "z690", "z790", "b650"],
        "memory": ["ddr4 16gb", "ddr4 32gb", "ddr5 16gb", "ddr5 32gb"],
        "internal-hard-drive": ["1tb nvme", "2tb ssd", "500gb nvme", "sata ssd"],
        "video-card": ["rtx 4070", "rtx 4080", "rtx 4090", "rx 7800", "rx 7900"],
        "case": ["atx case", "micro-atx case", "mini-itx case", "fractal design"],
        "power-supply": ["650w psu", "750w psu", "850w psu", "1000w psu"],
        "monitor": ["27 inch 144hz", "32 inch 4k", "ultrawide monitor"],
        "case-fan": ["120mm fan", "140mm fan", "rgb case fan"],
        "thermal-paste": ["thermal paste", "arctic mx-4", "noctua ntm1"],
    }

    def __init__(self, category: str, region: str = "us", config=None):
        """
        Initialize category scraper.

        Args:
            category: Category to scrape
            region: Region code
            config: Scraper configuration
        """
        super().__init__(config)
        self.category = category
        self.region = region
        self.pcpp_scraper = PyPartPickerScraper(region=region, config=config)

    async def _fetch(self, url: str, **kwargs) -> Any:
        """Delegate to pypartpicker scraper."""
        return await self.pcpp_scraper._fetch(url, **kwargs)

    async def scrape(self, max_pages: int = 3) -> List[Dict[str, Any]]:
        """
        Scrape all parts for the category.

        Args:
            max_pages: Maximum pages per search term

        Returns:
            List of part dictionaries
        """
        search_terms = self.CATEGORY_SEARCH_TERMS.get(self.category, [])

        if not search_terms:
            logger.warning(f"No search terms for category: {self.category}")
            return []

        logger.info(f"Scraping category '{self.category}' with {len(search_terms)} search terms")

        all_parts = await self.pcpp_scraper.scrape(search_terms, max_pages)

        # Add category to each part
        for part in all_parts:
            part["category"] = self.category

        logger.info(f"Scraped {len(all_parts)} parts for category '{self.category}'")
        return all_parts
