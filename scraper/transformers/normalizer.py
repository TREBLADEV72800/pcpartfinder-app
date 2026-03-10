"""Normalize component data."""
import re
from typing import Dict, Any
from loguru import logger


class ComponentNormalizer:
    """Normalize component names, brands, and formats."""

    # Brand name mappings (common variations)
    BRAND_MAPPINGS = {
        "amd": "AMD",
        "intel": "Intel",
        "nvidia": "NVIDIA",
        "asus": "ASUS",
        "msi": "MSI",
        "gigabyte": "Gigabyte",
        "evga": "EVGA",
        "corsair": "Corsair",
        "western digital": "Western Digital",
        "wd": "Western Digital",
        "samsung": "Samsung",
        "crucial": "Crucial",
        "kingston": "Kingston",
        "seagate": "Seagate",
        "nzxt": "NZXT",
        "fractal design": "Fractal Design",
        "coolermaster": "Cooler Master",
        "noctua": "Noctua",
        "be quiet": "be quiet!",
        "arctic": "Arctic",
    }

    # Unit normalizations
    UNIT_MAPPINGS = {
        "gb": "GB",
        "tb": "TB",
        "mhz": "MHz",
        "ghz": "GHz",
        "mm": "mm",
        "w": "W",
        "v": "V",
        "a": "A",
    }

    @classmethod
    def normalize_brand(cls, name: str) -> str:
        """
        Normalize brand name from component name.

        Args:
            name: Component name

        Returns:
            Normalized brand name or "Unknown"
        """
        if not name:
            return "Unknown"

        name_lower = name.lower()

        for brand_variant, brand_canonical in cls.BRAND_MAPPINGS.items():
            if brand_variant in name_lower:
                return brand_canonical

        # Try to extract brand from start of name
        words = name.split()
        if words:
            first_word = words[0].title()
            return first_word

        return "Unknown"

    @classmethod
    def extract_model(cls, name: str) -> str:
        """
        Extract model name/number from component name.

        Args:
            name: Component name

        Returns:
            Model string or None
        """
        if not name:
            return None

        # Common model patterns (case-insensitive)
        model_patterns = [
            r"\b[A-Z]{2,}-?\d{3,}[A-Z]?\b",  # e.g., RTX-4070, NH-D15
            r"\b\d{4,}[A-Z]{0,2}\b",  # e.g., 3200MHz, 970 EVO
        ]

        for pattern in model_patterns:
            match = re.search(pattern, name, re.IGNORECASE)
            if match:
                return match.group(0).upper()

        return None

    @classmethod
    def normalize_spec_value(cls, value: Any) -> Any:
        """
        Normalize spec value to consistent format.

        Args:
            value: Raw spec value

        Returns:
            Normalized value
        """
        if isinstance(value, str):
            value = value.strip()

            # Normalize units
            for old_unit, new_unit in cls.UNIT_MAPPINGS.items():
                value = re.sub(
                    rf"\b{old_unit}\b",
                    new_unit,
                    value,
                    flags=re.IGNORECASE
                )

            # Extract numeric value if possible
            numeric_match = re.search(r"([\d,]+\.?\d*)", value)
            if numeric_match:
                numeric_str = numeric_match.group(1).replace(",", "")
                try:
                    return float(numeric_str)
                except ValueError:
                    pass

        return value

    @classmethod
    def normalize_component(cls, component: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize all component data.

        Args:
            component: Raw component data

        Returns:
            Normalized component data
        """
        if not component:
            return {}

        normalized = component.copy()

        # Normalize brand
        if "name" in component:
            normalized["brand"] = cls.normalize_brand(component["name"])

        # Extract model
        if "name" in component:
            normalized["model"] = cls.extract_model(component["name"])

        # Normalize specs
        if "specs" in component and isinstance(component["specs"], dict):
            normalized_specs = {}
            for key, value in component["specs"].items():
                normalized_specs[key] = cls.normalize_spec_value(value)
            normalized["specs"] = normalized_specs

        return normalized
