"""Scrape all component categories."""
import asyncio
import sys
from loguru import logger

from scraper.scrapers import CategoryScraper
from scraper.transformers import ComponentNormalizer, SpecParser, YearInferrer, ComponentDeduplicator
from scraper.loaders import DatabaseLoader
from scraper.config import config


async def main():
    """Main scraping function."""
    logger.info("Starting full scrape of all categories")

    # Initialize transformers
    normalizer = ComponentNormalizer()
    spec_parser = SpecParser()
    year_inferrer = YearInferrer()
    deduplicator = ComponentDeduplicator()

    # Initialize database loader
    db_loader = DatabaseLoader()

    all_components = []

    # Scrape each category
    for category in config.categories:
        logger.info(f"Scraping category: {category}")

        try:
            scraper = CategoryScraper(category, region="us")
            raw_components = await scraper.scrape(max_pages=3)

            # Normalize and process
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

            all_components.extend(processed)

        except Exception as e:
            logger.error(f"Failed to scrape category {category}: {e}")
            continue

    # Deduplicate
    logger.info(f"Deduplicating {len(all_components)} components")
    unique_components = deduplicator.deduplicate_by_part_number(all_components)

    # Load into database
    logger.info("Loading components into database")
    loaded = await db_loader.load_components(unique_components)

    logger.info(f"Scraping complete! Loaded {loaded} components")


if __name__ == "__main__":
    asyncio.run(main())
