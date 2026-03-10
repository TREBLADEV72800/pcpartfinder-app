"""Update prices incrementally."""
import asyncio
from typing import List, Dict, Any
from datetime import datetime
import asyncpg
from loguru import logger

from scraper.scrapers import PriceScraper
from scraper.config import config


class PriceUpdater:
    """Update component prices incrementally."""

    def __init__(self, db_url: str = None, region: str = "us"):
        """
        Initialize price updater.

        Args:
            db_url: Database connection URL
            region: Region for prices
        """
        self.db_url = db_url or config.database_url
        self.region = region
        self.pool = None
        self.scraper = PriceScraper(region=region)

    async def init_pool(self):
        """Initialize database connection pool."""
        if self.pool is None:
            self.pool = await asyncpg.create_pool(
                self.db_url,
                min_size=2,
                max_size=10
            )
            logger.info("Database connection pool initialized")

    async def close_pool(self):
        """Close connection pool."""
        if self.pool:
            await self.pool.close()

    async def update_all_prices(self, limit: int = None) -> int:
        """
        Update prices for all components.

        Args:
            limit: Maximum number of components to update

        Returns:
            Number of components updated
        """
        await self.init_pool()

        async with self.pool.acquire() as conn:
            # Get components to update
            query = """
                SELECT id, pcpp_url
                FROM components
                WHERE pcpp_url IS NOT NULL
                AND is_active = true
                ORDER BY updated_at ASC
                LIMIT $1
            """
            rows = await conn.fetch(query, limit or 1000)

            logger.info(f"Found {len(rows)} components to update")

            # Extract URLs
            urls = [row["pcpp_url"] for row in rows]
            component_ids = [row["id"] for row in rows]

        # Scrape prices
        prices_dict = await self.scraper.scrape(urls)

        # Update prices in database
        updated_count = 0
        async with self.pool.acquire() as conn:
            for i, (component_id, url) in enumerate(zip(component_ids, urls)):
                prices = prices_dict.get(url, [])

                if prices:
                    await self._update_component_prices(
                        conn,
                        component_id,
                        prices
                    )
                    updated_count += 1

                self.log_progress(i + 1, len(urls))

        logger.info(f"Updated prices for {updated_count} components")
        return updated_count

    async def _update_component_prices(
        self,
        conn: asyncpg.Connection,
        component_id: str,
        prices: List[Dict[str, Any]]
    ):
        """
        Update prices for a component.

        Args:
            conn: Database connection
            component_id: Component ID
            prices: List of price data
        """
        for price_data in prices:
            # Insert price
            await conn.execute("""
                INSERT INTO prices (
                    component_id, retailer, price, base_price,
                    shipping, tax, total, currency, url, in_stock
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (component_id, retailer) DO UPDATE
                SET price = EXCLUDED.price,
                    shipping = EXCLUDED.shipping,
                    tax = EXCLUDED.tax,
                    total = EXCLUDED.total,
                    in_stock = EXCLUDED.in_stock,
                    scraped_at = NOW()
            """, component_id,
                price_data.get("retailer"),
                price_data.get("price"),
                price_data.get("price"),  # base_price same as price
                price_data.get("shipping"),
                None,  # tax
                price_data.get("price"),  # total same as price for now
                price_data.get("currency", "USD"),
                price_data.get("url"),
                price_data.get("in_stock", True)
            )

            # Add to price history
            await conn.execute("""
                INSERT INTO price_history (
                    component_id, retailer, price, currency
                ) VALUES ($1, $2, $3, $4)
            """, component_id,
                price_data.get("retailer"),
                price_data.get("price"),
                price_data.get("currency", "USD")
            )

    def log_progress(self, current: int, total: int):
        """Log progress."""
        percentage = (current / total * 100) if total > 0 else 0
        logger.info(f"Updated: {current}/{total} ({percentage:.1f}%)")
