"""PyPartPicker scraper wrapper."""
import pypartpicker
from typing import List, Dict, Any, Optional
from loguru import logger

from .base_scraper import BaseScraper, ScraperException, CloudflareException


class PyPartPickerScraper(BaseScraper):
    """Scraper using the pypartpicker library."""

    def __init__(self, region: str = "us", config: Any = None):
        """
        Initialize the PyPartPicker scraper.

        Args:
            region: Region code (us, uk, eu, etc.)
            config: Scraper configuration
        """
        super().__init__(config)
        self.region = region
        self.client: Optional[pypartpicker.Client] = None

    async def _init_client(self):
        """Initialize the pypartpicker client."""
        if self.client is None:
            try:
                self.client = pypartpicker.Client(region=self.region)
                logger.info(f"Initialized pypartpicker client for region: {self.region}")
            except Exception as e:
                logger.error(f"Failed to initialize pypartpicker client: {e}")
                raise ScraperException(f"Client init failed: {e}")

    async def _fetch(self, url: str, **kwargs) -> Any:
        """
        Fetch part data from PCPartPicker URL.

        Args:
            url: PCPartPicker part URL
            **kwargs: Additional arguments

        Returns:
            Part data
        """
        await self._init_client()

        try:
            part = self.client.get_part(url)
            return part
        except pypartpicker.CloudflareException as e:
            logger.error(f"Cloudflare blocked request to {url}")
            raise CloudflareException(f"Cloudflare block: {e}")
        except pypartpicker.RateLimitException as e:
            logger.warning(f"Rate limited while fetching {url}")
            raise ScraperException(f"Rate limited: {e}")
        except Exception as e:
            logger.error(f"Failed to fetch {url}: {e}")
            raise ScraperException(f"Fetch failed: {e}")

    async def scrape_part(self, part_url: str) -> Dict[str, Any]:
        """
        Scrape a single part.

        Args:
            part_url: PCPartPicker part URL

        Returns:
            Part data dictionary
        """
        try:
            part = await self._fetch(part_url)

            return {
                "name": part.name,
                "url": part_url,
                "specs": part.specs,
                "price": part.cheapest_price,
                "ratings": part.ratings,
                "images": part.images,
            }
        except Exception as e:
            logger.error(f"Failed to scrape part {part_url}: {e}")
            return {}

    async def search_parts(
        self,
        query: str,
        page: int = 1,
    ) -> List[Dict[str, Any]]:
        """
        Search for parts.

        Args:
            query: Search query
            page: Page number (starts at 1)

        Returns:
            List of part dictionaries
        """
        await self._init_client()

        try:
            result = self.client.get_part_search(query, region=self.region, page=page)

            parts = []
            for part in result.parts:
                parts.append({
                    "name": part.name,
                    "url": part.url,
                    "price": part.price,
                    "ratings": part.ratings,
                })

            logger.info(f"Found {len(parts)} parts for query '{query}' (page {page})")
            return parts

        except Exception as e:
            logger.error(f"Failed to search parts with query '{query}': {e}")
            return []

    async def scrape(self, queries: List[str], max_pages: int = 5) -> List[Dict[str, Any]]:
        """
        Scrape parts for multiple search queries.

        Args:
            queries: List of search queries
            max_pages: Maximum pages to fetch per query

        Returns:
            List of all part dictionaries
        """
        all_parts = []

        for query in queries:
            logger.info(f"Searching for parts: {query}")

            for page in range(1, max_pages + 1):
                parts = await self.search_parts(query, page)

                if not parts:
                    break

                all_parts.extend(parts)
                self.log_progress(len(all_parts), len(queries) * max_pages, f"Query: {query}")

        logger.info(f"Total parts scraped: {len(all_parts)}")
        return all_parts
