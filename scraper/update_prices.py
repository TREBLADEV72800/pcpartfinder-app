"""Update prices for existing components."""
import asyncio
import sys
from loguru import logger

from scraper.loaders import PriceUpdater


async def main(limit: int = None, region: str = "us"):
    """
    Update prices for components.

    Args:
        limit: Maximum number of components to update
        region: Region code
    """
    logger.info(f"Updating prices for region: {region}")

    updater = PriceUpdater(region=region)

    try:
        updated = await updater.update_all_prices(limit=limit)
        logger.info(f"Price update complete! Updated {updated} components")
    finally:
        await updater.close_pool()


if __name__ == "__main__":
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    region = sys.argv[2] if len(sys.argv) > 2 else "us"

    asyncio.run(main(limit, region))
