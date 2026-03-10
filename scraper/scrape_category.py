"""Scrape a single component category."""
import asyncio
import sys
from loguru import logger

from scraper.scrapers import CategoryScraper
from scraper.transformers import ComponentNormalizer, SpecParser, YearInferrer, ComponentDeduplicator
from scraper.loaders import DatabaseLoader


async def main(category: str, max_pages: int = 3, region: str = "us"):
    """
    Scrape a single category.

    Args:
        category: Category to scrape
        max_pages: Maximum pages to fetch
        region: Region code
    """
    logger.info(f"Scraping category: {category}")

    # Initialize
    scraper = CategoryScraper(category, region=region)
    normalizer = ComponentNormalizer()
    spec_parser = SpecParser()
    year_inferrer = YearInferrer()
    deduplicator = ComponentDeduplicator()
    db_loader = DatabaseLoader()

    # Scrape
    raw_components = await scraper.scrape(max_pages=max_pages)

    logger.info(f"Scraped {len(raw_components)} raw components")

    # Process
    processed = []
    for component in raw_components:
        normalized = normalizer.normalize_component(component)
        parsed_specs = spec_parser.parse_specs(
            category,
            component.get("specs", {})
        )
        normalized["specs"] = parsed_specs

        year = year_inferrer.infer_year(
            component.get("name", ""),
            parsed_specs
        )
        if year:
            normalized["releaseYear"] = year

        processed.append(normalized)

    # Deduplicate
    unique = deduplicator.deduplicate_by_part_number(processed)

    # Load into database
    loaded = await db_loader.load_components(unique)

    logger.info(f"Complete! Loaded {loaded} components for category {category}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scrape_category.py <category> [max_pages] [region]")
        print("Example: python scrape_category.py cpu 3 us")
        sys.exit(1)

    category = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    region = sys.argv[3] if len(sys.argv) > 3 else "us"

    asyncio.run(main(category, max_pages, region))
