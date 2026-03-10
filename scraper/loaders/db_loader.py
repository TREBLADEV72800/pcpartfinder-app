"""Load components into database."""
import asyncio
from typing import List, Dict, Any, Optional
import asyncpg
from loguru import logger

from scraper.config import config


class DatabaseLoader:
    """Load scraped components into PostgreSQL database."""

    def __init__(self, db_url: str = None):
        """
        Initialize database loader.

        Args:
            db_url: Database connection URL
        """
        self.db_url = db_url or config.database_url
        self.pool: Optional[asyncpg.Pool] = None

    async def init_pool(self):
        """Initialize connection pool."""
        if self.pool is None:
            self.pool = await asyncpg.create_pool(
                self.db_url,
                min_size=2,
                max_size=10,
                command_timeout=60
            )
            logger.info("Database connection pool initialized")

    async def close_pool(self):
        """Close connection pool."""
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed")

    async def load_components(
        self,
        components: List[Dict[str, Any]],
        batch_size: int = None
    ) -> int:
        """
        Load components into database.

        Args:
            components: List of component dictionaries
            batch_size: Batch size for inserts

        Returns:
            Number of components loaded
        """
        await self.init_pool()

        batch_size = batch_size or config.batch_size
        loaded_count = 0

        async with self.pool.acquire() as conn:
            for i in range(0, len(components), batch_size):
                batch = components[i:i + batch_size]

                for component in batch:
                    try:
                        await self._insert_component(conn, component)
                        loaded_count += 1
                    except Exception as e:
                        logger.error(f"Failed to insert component: {e}")

                self.log_progress(loaded_count, len(components))

        logger.info(f"Loaded {loaded_count}/{len(components)} components")
        return loaded_count

    async def _insert_component(
        self,
        conn: asyncpg.Connection,
        component: Dict[str, Any]
    ):
        """
        Insert a single component.

        Args:
            conn: Database connection
            component: Component data
        """
        query = """
            INSERT INTO components (
                name, brand, model, part_number, category,
                release_year, image_url, thumbnail_url, specs,
                socket, form_factor, chipset, memory_type, tdp,
                wattage, length_mm, height_mm, radiator_mm,
                capacity_gb, interface_type, is_active
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12, $13, $14,
                $15, $16, $17, $18,
                $19, $20, $21
            )
            ON CONFLICT (part_number) DO UPDATE
            SET name = EXCLUDED.name,
                specs = EXCLUDED.specs,
                updated_at = NOW()
        """

        await conn.execute(
            query,
            component.get("name"),
            component.get("brand"),
            component.get("model"),
            component.get("part_number"),
            component.get("category"),
            component.get("release_year"),
            component.get("image_url"),
            component.get("thumbnail_url"),
            component.get("specs", {}),
            component.get("socket"),
            component.get("form_factor"),
            component.get("chipset"),
            component.get("memory_type"),
            component.get("tdp"),
            component.get("wattage"),
            component.get("length_mm"),
            component.get("height_mm"),
            component.get("radiator_mm"),
            component.get("capacity_gb"),
            component.get("interface_type"),
            True,  # is_active
        )

        # Load prices if available
        if "prices" in component:
            await self._load_prices(conn, component)

    async def _load_prices(
        self,
        conn: asyncpg.Connection,
        component: Dict[str, Any]
    ):
        """
        Load prices for a component.

        Args:
            conn: Database connection
            component: Component with prices
        """
        # Get component ID (would need to fetch it first)
        # This is simplified - actual implementation would need
        # to handle fetching the component ID after insert
        pass

    def log_progress(self, current: int, total: int):
        """Log loading progress."""
        percentage = (current / total * 100) if total > 0 else 0
        logger.info(f"Loaded: {current}/{total} ({percentage:.1f}%)")
