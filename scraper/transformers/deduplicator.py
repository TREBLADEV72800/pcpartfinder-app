"""Deduplicate components."""
from typing import List, Dict, Any
from loguru import logger


class ComponentDeduplicator:
    """Deduplicate components by various attributes."""

    @classmethod
    def deduplicate_by_part_number(
        cls,
        components: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Deduplicate components by part number.

        Args:
            components: List of component dictionaries

        Returns:
            Deduplicated list
        """
        seen = {}
        deduplicated = []

        for component in components:
            part_number = component.get("partNumber")

            if not part_number:
                # No part number, use name+brand as fallback
                key = (
                    component.get("brand", ""),
                    component.get("name", "")
                )
            else:
                key = part_number

            if key not in seen:
                seen[key] = component
                deduplicated.append(component)
            else:
                logger.debug(f"Duplicate component: {key}")

        logger.info(f"Deduplicated {len(components)} -> {len(deduplicated)} components")
        return deduplicated

    @classmethod
    def deduplicate_by_name(
        cls,
        components: List[Dict[str, Any]],
        similarity_threshold: float = 0.9
    ) -> List[Dict[str, Any]]:
        """
        Deduplicate components by similar names.

        Args:
            components: List of component dictionaries
            similarity_threshold: Minimum similarity ratio

        Returns:
            Deduplicated list
        """
        seen = set()
        deduplicated = []

        for component in components:
            name = component.get("name", "").lower().strip()

            if not name:
                continue

            # Check if similar name exists
            is_duplicate = False
            for seen_name in seen:
                if cls._calculate_similarity(name, seen_name) >= similarity_threshold:
                    is_duplicate = True
                    logger.debug(f"Similar component: '{name}' ~ '{seen_name}'")
                    break

            if not is_duplicate:
                seen.add(name)
                deduplicated.append(component)

        logger.info(f"Deduplicated by name: {len(components)} -> {len(deduplicated)}")
        return deduplicated

    @classmethod
    def _calculate_similarity(cls, str1: str, str2: str) -> float:
        """
        Calculate similarity ratio between two strings.

        Args:
            str1: First string
            str2: Second string

        Returns:
            Similarity ratio (0-1)
        """
        # Simple implementation: check if one is substring of other
        if str1 in str2 or str2 in str1:
            return 1.0

        # Check word overlap
        words1 = set(str1.split())
        words2 = set(str2.split())

        if not words1 or not words2:
            return 0.0

        intersection = words1 & words2
        union = words1 | words2

        return len(intersection) / len(union)

    @classmethod
    def merge_duplicates(
        cls,
        components: List[Dict[str, Any]],
        prefer_newer: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Merge duplicate components, keeping preferred data.

        Args:
            components: List of component dictionaries
            prefer_newer: Prefer newer data when merging

        Returns:
            Merged list
        """
        groups = {}

        # Group by potential key
        for component in components:
            key = component.get("partNumber") or component.get("name", "")

            if key not in groups:
                groups[key] = []
            groups[key].append(component)

        merged = []
        for key, group in groups.items():
            if len(group) == 1:
                merged.append(group[0])
            else:
                # Merge group
                base = group[0] if prefer_newer else group[-1]

                # Merge prices from all versions
                all_prices = []
                for comp in group:
                    all_prices.extend(comp.get("prices", []))

                if all_prices:
                    base["prices"] = all_prices

                merged.append(base)

        logger.info(f"Merged {len(components)} -> {len(merged)} components")
        return merged
