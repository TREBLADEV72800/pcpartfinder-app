"""Infer component release year from naming patterns."""
import re
from typing import Optional
from loguru import logger


class YearInferrer:
    """Infer release year from component name and specs."""

    # Common year patterns in product names
    YEAR_PATTERNS = [
        r"\b(20\d{2})\b",  # 20XX
        r"'(\d{2})\b",     # 'XX
    ]

    # Product generation/release year mappings
    GENERATION_YEARS = {
        # Intel CPUs
        "14th gen": 2024,
        "13th gen": 2023,
        "12th gen": 2022,
        "11th gen": 2021,
        "10th gen": 2020,
        # AMD Ryzen
        "9000 series": 2024,
        "8000 series": 2024,
        "7000 series": 2022,
        "6000 series": 2022,
        "5000 series": 2020,
        "3000 series": 2019,
        # NVIDIA GPUs
        "rtx 50": 2025,
        "rtx 40": 2022,
        "rtx 30": 2020,
        "rtx 20": 2018,
        "gtx 16": 2019,
        # AMD GPUs
        "rx 7000": 2022,
        "rx 6000": 2020,
        "rx 5000": 2019,
        # RAM
        "ddr5": 2021,
        "ddr4": 2015,
    }

    @classmethod
    def infer_year(cls, name: str, specs: dict = None) -> Optional[int]:
        """
        Infer release year from component name.

        Args:
            name: Component name
            specs: Optional specs for additional context

        Returns:
            Inferred year or None
        """
        if not name:
            return None

        name_lower = name.lower()

        # Check for explicit year in name
        for pattern in cls.YEAR_PATTERNS:
            match = re.search(pattern, name)
            if match:
                year_str = match.group(1)
                if len(year_str) == 2:
                    year = 2000 + int(year_str)
                else:
                    year = int(year_str)

                # Validate year range
                if 2010 <= year <= 2030:
                    return year

        # Check generation-based year
        for generation, year in cls.GENERATION_YEARS.items():
            if generation in name_lower:
                return year

        # Heuristics based on specs
        if specs:
            # DDR5 = 2021 or later
            if specs.get("memory_type") == "DDR5":
                return 2021
            # PCIe 5.0 = 2022 or later
            if "pcie 5" in name_lower:
                return 2022
            # AM5 socket = 2022 or later
            if specs.get("socket") == "AM5":
                return 2022
            # LGA 1700 = 2021 or later
            if specs.get("socket") == "LGA 1700":
                return 2021

        return None

    @classmethod
    def infer_batch(cls, components: list) -> None:
        """
        Infer years for a batch of components in place.

        Args:
            components: List of component dicts
        """
        for component in components:
            if "releaseYear" not in component or not component["releaseYear"]:
                name = component.get("name", "")
                specs = component.get("specs", {})
                year = cls.infer_year(name, specs)

                if year:
                    component["releaseYear"] = year
                    logger.debug(f"Inferred year {year} for: {name}")
