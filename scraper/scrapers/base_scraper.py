"""Base scraper with retry logic and error handling."""
import asyncio
import random
from abc import ABC, abstractmethod
from typing import Any, Optional, List
from loguru import logger
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

from scraper.config import config


class ScraperException(Exception):
    """Base exception for scraper errors."""
    pass


class RateLimitException(ScraperException):
    """Raised when rate limit is hit."""
    pass


class CloudflareException(ScraperException):
    """Raised when Cloudflare blocks the request."""
    pass


class BaseScraper(ABC):
    """Base class for all scrapers with retry logic."""

    def __init__(self, config: Any = None):
        """
        Initialize the scraper.

        Args:
            config: Scraper configuration (uses default if None)
        """
        self.config = config or config

    async def _delay(self):
        """Add random delay between requests to avoid rate limiting."""
        delay = random.uniform(
            self.config.min_delay,
            self.config.max_delay
        )
        logger.debug(f"Delaying for {delay:.2f} seconds")
        await asyncio.sleep(delay)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((RateLimitException, asyncio.TimeoutError)),
    )
    async def _fetch_with_retry(self, url: str, **kwargs) -> Any:
        """
        Fetch URL with retry logic.

        Args:
            url: URL to fetch
            **kwargs: Additional arguments for the fetch method

        Returns:
            Fetch result

        Raises:
            ScraperException: If all retries are exhausted
        """
        await self._delay()

        try:
            result = await self._fetch(url, **kwargs)
            return result
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            raise

    @abstractmethod
    async def _fetch(self, url: str, **kwargs) -> Any:
        """
        Actual fetch implementation to be provided by subclasses.

        Args:
            url: URL to fetch
            **kwargs: Additional arguments

        Returns:
            Fetch result
        """
        pass

    @abstractmethod
    async def scrape(self, **kwargs) -> List[Any]:
        """
        Main scraping method.

        Args:
            **kwargs: Scraping parameters

        Returns:
            List of scraped items
        """
        pass

    def log_progress(self, current: int, total: int, message: str = ""):
        """
        Log scraping progress.

        Args:
            current: Current item count
            total: Total item count
            message: Optional message to log
        """
        percentage = (current / total * 100) if total > 0 else 0
        logger.info(
            f"Progress: {current}/{total} ({percentage:.1f}%)"
            + (f" - {message}" if message else "")
        )
