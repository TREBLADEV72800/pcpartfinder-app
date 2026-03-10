"""Scraper configuration."""
from dataclasses import dataclass
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class ScraperConfig:
    """Configuration for the PCPartPicker scraper."""

    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/pcbuilder"
    )

    # Scraping regions
    regions: List[str] = None

    # Rate limiting
    min_delay: float = 2.0  # Minimum delay between requests (seconds)
    max_delay: float = 5.0  # Maximum delay between requests (seconds)
    max_retries: int = 3
    retry_delay: float = 10.0

    # Request timeout
    request_timeout: int = 30

    # Batch size for database operations
    batch_size: int = 100

    # Categories to scrape
    categories: List[str] = None

    # Year filter (None = all)
    min_year: int = None

    # Proxy settings (optional)
    use_proxy: bool = False
    proxy_list: List[str] = None

    # Logging
    log_level: str = "INFO"

    # Data source URLs
    pypartpicker_dataset_url: str = (
        "https://github.com/docyx/pc-part-dataset"
    )

    def __post_init__(self):
        """Set default values for lists."""
        if self.regions is None:
            self.regions = ["us", "uk", "eu"]
        if self.categories is None:
            self.categories = [
                "cpu",
                "cpu-cooler",
                "motherboard",
                "memory",
                "internal-hard-drive",
                "video-card",
                "case",
                "power-supply",
                "monitor",
                "case-fan",
                "thermal-paste",
            ]
        if self.proxy_list is None:
            self.proxy_list = []


# Default config instance
config = ScraperConfig()
