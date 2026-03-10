"""Import seed data from pc-part-dataset."""
import asyncio
from loguru import logger

from scraper.loaders import SeedLoader


async def main():
    """Import all seed data from GitHub."""
    logger.info("Starting seed data import from pc-part-dataset")

    loader = SeedLoader()

    try:
        total_loaded = await loader.load_all_categories()
        logger.info(f"Seed import complete! Loaded {total_loaded} components")
    except Exception as e:
        logger.error(f"Seed import failed: {e}")
        raise
    finally:
        await loader.db_loader.close_pool()


async def import_category(category: str):
    """
    Import a single category.

    Args:
        category: Category to import
    """
    logger.info(f"Importing category: {category}")

    loader = SeedLoader()

    try:
        loaded = await loader.load_category(category)
        logger.info(f"Imported {loaded} components for category {category}")
    finally:
        await loader.db_loader.close_pool()


async def import_from_file(file_path: str, category: str):
    """
    Import from local JSON file.

    Args:
        file_path: Path to JSON file
        category: Component category
    """
    logger.info(f"Importing from file: {file_path}")

    loader = SeedLoader()

    try:
        loaded = await loader.load_from_file(file_path, category)
        logger.info(f"Imported {loaded} components from file")
    finally:
        await loader.db_loader.close_pool()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "category" and len(sys.argv) > 2:
            category = sys.argv[2]
            asyncio.run(import_category(category))
        elif command == "file" and len(sys.argv) > 3:
            file_path = sys.argv[2]
            category = sys.argv[3]
            asyncio.run(import_from_file(file_path, category))
        else:
            print("Usage:")
            print("  python seed_from_dataset.py              # Import all categories")
            print("  python seed_from_dataset.py category <name>  # Import single category")
            print("  python seed_from_dataset.py file <path> <category>  # Import from file")
            sys.exit(1)
    else:
        asyncio.run(main())
