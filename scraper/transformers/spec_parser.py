"""Parse and structure component specifications."""
from typing import Dict, Any, Optional
from loguru import logger


class SpecParser:
    """Parse raw component specs into structured data."""

    # Spec mappings by category
    SPEC_MAPPINGS = {
        "cpu": {
            "socket": "socket",
            "cores": "cores",
            "threads": "threads",
            "base_clock": "base_clock",
            "boost_clock": "boost_clock",
            "tdp": "tdp",
            "integrated_graphics": "integrated_graphics",
            "l3_cache": "l3_cache",
        },
        "cpu-cooler": {
            "type": "type",
            "fan_rpm": "fan_rpm",
            "noise_level": "noise_level",
            "height": "height_mm",
            "radiator_size": "radiator_mm",
            "sockets": "supported_sockets",
        },
        "motherboard": {
            "socket": "socket",
            "form_factor": "form_factor",
            "chipset": "chipset",
            "ram_slots": "ram_slots",
            "max_ram": "max_ram_gb",
            "memory_type": "memory_type",
            "m2_slots": "m2_slots",
            "sata_ports": "sata_ports",
        },
        "memory": {
            "type": "memory_type",
            "speed": "speed_mhz",
            "capacity": "capacity_gb",
            "modules": "modules",
            "cas_latency": "cas_latency",
        },
        "internal-hard-drive": {
            "type": "type",
            "capacity": "capacity_gb",
            "interface": "interface_type",
            "read_speed": "read_speed",
            "write_speed": "write_speed",
        },
        "video-card": {
            "chipset": "chipset",
            "vram": "vram_gb",
            "base_clock": "base_clock",
            "boost_clock": "boost_clock",
            "length": "length_mm",
            "tdp": "tdp",
            "outputs": "outputs",
        },
        "case": {
            "type": "type",
            "form_factor": "form_factor",
            "max_gpu_length": "max_gpu_length_mm",
            "max_cooler_height": "max_cooler_height_mm",
            "drive_bays_2.5": "drive_bays_25",
            "drive_bays_3.5": "drive_bays_35",
        },
        "power-supply": {
            "wattage": "wattage",
            "efficiency": "efficiency_rating",
            "modular": "modular_type",
            "form_factor": "form_factor",
        },
    }

    @classmethod
    def parse_specs(cls, category: str, raw_specs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse raw specs into structured format.

        Args:
            category: Component category
            raw_specs: Raw specification dictionary

        Returns:
            Parsed specs dictionary
        """
        if not raw_specs:
            return {}

        category_key = category.replace("-", "").replace("_", "")

        # Get mapping for this category
        mapping = cls.SPEC_MAPPINGS.get(category_key, {})

        parsed = {}
        for raw_key, value in raw_specs.items():
            # Find the mapped key
            mapped_key = mapping.get(raw_key.lower(), raw_key)

            # Parse value
            parsed_value = cls._parse_spec_value(value)
            parsed[mapped_key] = parsed_value

        return parsed

    @classmethod
    def _parse_spec_value(cls, value: Any) -> Any:
        """
        Parse individual spec value.

        Args:
            value: Raw spec value

        Returns:
            Parsed value
        """
        if isinstance(value, (int, float, bool)):
            return value

        if isinstance(value, str):
            value = value.strip()

            # Boolean values
            if value.lower() in ("yes", "true", "enabled"):
                return True
            if value.lower() in ("no", "false", "disabled"):
                return False

            # Numeric values
            numeric_match = __import__("re").search(r"([\d,]+\.?\d*)", value)
            if numeric_match:
                try:
                    return float(numeric_match.group(1).replace(",", ""))
                except ValueError:
                    pass

            # Lists (comma-separated)
            if "," in value:
                return [v.strip() for v in value.split(",")]

        return value
