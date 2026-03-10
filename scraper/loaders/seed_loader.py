"""Load seed data from pc-part-dataset."""
import json
import requests
from pathlib import Path
from typing import List, Dict, Any
from loguru import logger

from .db_loader import DatabaseLoader
from scraper.transformers import ComponentNormalizer, SpecParser, YearInferrer


class SeedLoader:
    """Load seed data from GitHub pc-part-dataset repository."""

    DATASET_URL = "https://raw.githubusercontent.com/docyx/pc-part-dataset/master/data"

    def __init__(self, db_url: str = None):
        """
        Initialize seed loader.

        Args:
            db_url: Database connection URL
        """
        self.db_loader = DatabaseLoader(db_url)
        self.normalizer = ComponentNormalizer()
        self.spec_parser = SpecParser()
        self.year_inferrer = YearInferrer()

    async def load_all_categories(self) -> int:
        """
        Load all categories from the dataset.

        Returns:
            Total number of components loaded
        """
        categories = [
            "cpu",
            "cpu-cooler",
            "motherboard",
            "memory",
            "internal-hard-drive",
            "video-card",
            "case",
            "power-supply",
        ]

        total_loaded = 0
        for category in categories:
            logger.info(f"Loading category: {category}")
            loaded = await self.load_category(category)
            total_loaded += loaded

        logger.info(f"Total components loaded from seed: {total_loaded}")
        return total_loaded

    async def load_category(self, category: str) -> int:
        """
        Load a single category from the dataset.

        Args:
            category: Category name

        Returns:
            Number of components loaded
        """
        try:
            # Download JSON data
            url = f"{self.DATASET_URL}/{category}.json"
            response = requests.get(url, timeout=30)
            response.raise_for_status()

            data = response.json()

            if not isinstance(data, list):
                logger.error(f"Unexpected data format for category {category}")
                return 0

            # Process components
            processed = []
            for item in data:
                component = await self._process_component(category, item)
                if component:
                    processed.append(component)

            # Load into database
            loaded = await self.db_loader.load_components(processed)
            return loaded

        except Exception as e:
            logger.error(f"Failed to load category {category}: {e}")
            return 0

    async def _process_component(
        self,
        category: str,
        raw_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process raw component data.

        Args:
            category: Component category
            raw_data: Raw JSON data

        Returns:
            Processed component dictionary
        """
        try:
            # Normalize
            normalized = self.normalizer.normalize_component(raw_data)

            # Parse specs
            specs = self.spec_parser.parse_specs(
                category,
                raw_data.get("specs", {})
            )

            # Infer year
            year = self.year_inferrer.infer_year(
                raw_data.get("name", ""),
                specs
            )

            return {
                "name": raw_data.get("name"),
                "brand": normalized.get("brand"),
                "model": normalized.get("model"),
                "part_number": raw_data.get("partNumber"),
                "category": category.upper().replace("-", "_"),
                "release_year": year,
                "image_url": raw_data.get("imageUrl"),
                "thumbnail_url": raw_data.get("thumbnailUrl"),
                "specs": specs,
                "socket": specs.get("socket"),
                "form_factor": specs.get("form_factor"),
                "chipset": specs.get("chipset"),
                "memory_type": specs.get("memory_type"),
                "tdp": specs.get("tdp"),
                "wattage": specs.get("wattage"),
                "length_mm": specs.get("length_mm"),
                "height_mm": specs.get("height_mm"),
                "radiator_mm": specs.get("radiator_mm"),
                "capacity_gb": specs.get("capacity_gb"),
                "interface_type": specs.get("interface_type"),
            }

        except Exception as e:
            logger.error(f"Failed to process component: {e}")
            return None

    async def load_from_file(self, file_path: str, category: str) -> int:
        """
        Load from local JSON file.

        Args:
            file_path: Path to JSON file
            category: Component category

        Returns:
            Number of components loaded
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            if not isinstance(data, list):
                logger.error(f"Unexpected data format in {file_path}")
                return 0

            # Process components
            processed = []
            for item in data:
                component = await self._process_component(category, item)
                if component:
                    processed.append(component)

            # Load into database
            loaded = await self.db_loader.load_components(processed)
            return loaded

        except Exception as e:
            logger.error(f"Failed to load from file {file_path}: {e}")
            return 0
