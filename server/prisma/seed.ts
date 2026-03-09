import { PrismaClient } from "@prisma/client";
import type { ComponentCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.buildItem.deleteMany();
  await prisma.build.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.price.deleteMany();
  await prisma.review.deleteMany();
  await prisma.component.deleteMany();
  await prisma.compatibilityResult.deleteMany();
  await prisma.compatibilityRule.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();

  console.log("✅ Cleared existing data");

  // Create compatibility rules
  const rules = [
    {
      name: "cpu-mobo-socket",
      description: "CPU socket must match motherboard socket",
      categoryA: "CPU" as ComponentCategory,
      categoryB: "MOTHERBOARD" as ComponentCategory,
      ruleType: "socket_match",
      severity: "ERROR",
      ruleLogic: { check: "socket_equality" },
    },
    {
      name: "mobo-ram-ddr",
      description: "Motherboard DDR type must match RAM DDR type",
      categoryA: "MOTHERBOARD" as ComponentCategory,
      categoryB: "MEMORY" as ComponentCategory,
      ruleType: "memory_type_match",
      severity: "ERROR",
      ruleLogic: { check: "ddr_type_equality" },
    },
    {
      name: "mobo-ram-slots",
      description: "RAM modules must fit in motherboard slots",
      categoryA: "MOTHERBOARD" as ComponentCategory,
      categoryB: "MEMORY" as ComponentCategory,
      ruleType: "slot_count",
      severity: "ERROR",
      ruleLogic: { check: "ram_slots_sufficient" },
    },
    {
      name: "mobo-case-ff",
      description: "Motherboard form factor must be supported by case",
      categoryA: "MOTHERBOARD" as ComponentCategory,
      categoryB: "CASE" as ComponentCategory,
      ruleType: "form_factor_check",
      severity: "ERROR",
      ruleLogic: { check: "form_factor_compatibility" },
    },
    {
      name: "gpu-case-len",
      description: "GPU length must fit in case",
      categoryA: "VIDEO_CARD" as ComponentCategory,
      categoryB: "CASE" as ComponentCategory,
      ruleType: "length_check",
      severity: "ERROR",
      ruleLogic: { check: "gpu_length_fits" },
    },
    {
      name: "cooler-case-h",
      description: "CPU cooler height must fit in case",
      categoryA: "CPU_COOLER" as ComponentCategory,
      categoryB: "CASE" as ComponentCategory,
      ruleType: "height_check",
      severity: "ERROR",
      ruleLogic: { check: "cooler_height_fits" },
    },
    {
      name: "cooler-cpu-socket",
      description: "CPU cooler must support CPU socket",
      categoryA: "CPU_COOLER" as ComponentCategory,
      categoryB: "CPU" as ComponentCategory,
      ruleType: "socket_support",
      severity: "ERROR",
      ruleLogic: { check: "cooler_socket_support" },
    },
    {
      name: "psu-wattage",
      description: "PSU wattage must be sufficient for system",
      categoryA: "POWER_SUPPLY" as ComponentCategory,
      categoryB: "CPU" as ComponentCategory,
      ruleType: "wattage_check",
      severity: "WARNING",
      ruleLogic: { check: "psu_wattage_sufficient" },
    },
  ];

  for (const rule of rules) {
    await prisma.compatibilityRule.upsert({
      where: { name: rule.name },
      update: {},
      create: rule,
    });
  }

  console.log(`✅ Created ${rules.length} compatibility rules`);

  // Sample components
  const sampleComponents = [
    // CPUs
    {
      name: "AMD Ryzen 5 7600",
      brand: "AMD",
      model: "7600",
      category: "CPU" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        socket: "AM5",
        cores: 6,
        threads: 12,
        base_clock: "3.8 GHz",
        boost_clock: "5.1 GHz",
        tdp: 65,
        integrated_graphics: "No",
        l3_cache: "32MB",
      },
      socket: "AM5",
      tdp: 65,
      isActive: true,
    },
    {
      name: "Intel Core i5-14400F",
      brand: "Intel",
      model: "i5-14400F",
      category: "CPU" as ComponentCategory,
      releaseYear: 2024,
      specs: {
        socket: "LGA 1700",
        cores: 10,
        threads: 16,
        base_clock: "2.5 GHz",
        boost_clock: "4.7 GHz",
        tdp: 65,
        integrated_graphics: "No",
        l3_cache: "20MB",
      },
      socket: "LGA 1700",
      tdp: 65,
      isActive: true,
    },
    // Motherboards
    {
      name: "ASUS TUF Gaming B650-Plus WiFi",
      brand: "ASUS",
      model: "TUF B650-Plus WiFi",
      category: "MOTHERBOARD" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        socket: "AM5",
        form_factor: "ATX",
        chipset: "B650",
        ram_slots: 4,
        max_ram_gb: 128,
        memory_type: "DDR5",
        m2_slots: 2,
        sata_ports: 4,
        pcie_slots: 2,
        wifi: true,
        usb_ports: 8,
      },
      socket: "AM5",
      formFactor: "ATX",
      chipset: "B650",
      memoryType: "DDR5",
      isActive: true,
    },
    {
      name: "MSI PRO B760M-A WiFi",
      brand: "MSI",
      model: "PRO B760M-A WiFi",
      category: "MOTHERBOARD" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        socket: "LGA 1700",
        form_factor: "MicroATX",
        chipset: "B760",
        ram_slots: 4,
        max_ram_gb: 128,
        memory_type: "DDR5",
        m2_slots: 2,
        sata_ports: 4,
        pcie_slots: 2,
        wifi: true,
        usb_ports: 6,
      },
      socket: "LGA 1700",
      formFactor: "MicroATX",
      chipset: "B760",
      memoryType: "DDR5",
      isActive: true,
    },
    // RAM
    {
      name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
      brand: "Corsair",
      model: "Vengeance DDR5",
      category: "MEMORY" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        memory_type: "DDR5",
        speed_mhz: 6000,
        capacity_gb: 32,
        modules: 2,
        cas_latency: 36,
        voltage: "1.35V",
      },
      memoryType: "DDR5",
      capacityGb: 32,
      isActive: true,
    },
    // GPU
    {
      name: "NVIDIA GeForce RTX 4070 Super",
      brand: "NVIDIA",
      model: "RTX 4070 Super",
      category: "VIDEO_CARD" as ComponentCategory,
      releaseYear: 2024,
      specs: {
        chipset: "AD104",
        vram_gb: 12,
        base_clock: "1980 MHz",
        boost_clock: "2475 MHz",
        length_mm: 267,
        tdp: 220,
        outputs: ["HDMI", "DisplayPort"],
        fans: 3,
        pcie_power_connectors: 1,
      },
      tdp: 220,
      lengthMm: 267,
      isActive: true,
    },
    {
      name: "AMD Radeon RX 7800 XT",
      brand: "AMD",
      model: "RX 7800 XT",
      category: "VIDEO_CARD" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        chipset: "RDNA3",
        vram_gb: 16,
        base_clock: "1295 MHz",
        boost_clock: "2430 MHz",
        length_mm: 267,
        tdp: 263,
        outputs: ["HDMI", "DisplayPort"],
        fans: 3,
        pcie_power_connectors: 2,
      },
      tdp: 263,
      lengthMm: 267,
      isActive: true,
    },
    // Case
    {
      name: "Fractal Design North ATX Case",
      brand: "Fractal Design",
      model: "North",
      category: "CASE" as ComponentCategory,
      releaseYear: 2022,
      specs: {
        type: "ATX",
        supported_form_factors: ["Mini-ITX", "MicroATX", "ATX"],
        max_gpu_length_mm: 355,
        max_cooler_height_mm: 169,
        drive_bays_25: 2,
        drive_bays_35: 2,
        fan_slots: 5,
        radiator_support: [240, 280],
      },
      formFactor: "ATX",
      isActive: true,
    },
    // PSU
    {
      name: "Corsair RM750e 750W 80+ Gold",
      brand: "Corsair",
      model: "RM750e",
      category: "POWER_SUPPLY" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        wattage: 750,
        efficiency_rating: "80+ Gold",
        modular_type: "fully",
        form_factor: "ATX",
        pcie_connectors: 4,
        eps_connectors: 2,
      },
      wattage: 750,
      isActive: true,
    },
    // Storage
    {
      name: "Samsung 990 Pro 1TB NVMe SSD",
      brand: "Samsung",
      model: "990 Pro",
      category: "STORAGE" as ComponentCategory,
      releaseYear: 2022,
      specs: {
        type: "NVMe",
        capacity_gb: 1024,
        interface_type: "PCIe 4.0 x4",
        read_speed: "7450 MB/s",
        write_speed: "6900 MB/s",
        form_factor: "M.2 2280",
      },
      capacityGb: 1024,
      interfaceType: "PCIe 4.0 x4",
      isActive: true,
    },
    // CPU Cooler
    {
      name: "Noctua NH-D15 chromax.black",
      brand: "Noctua",
      model: "NH-D15",
      category: "CPU_COOLER" as ComponentCategory,
      releaseYear: 2023,
      specs: {
        type: "air",
        fan_rpm: "1500",
        noise_level_db: 24.6,
        height_mm: 165,
        supported_sockets: ["AM4", "AM5", "LGA 1700", "LGA 1200"],
        max_tdp: 250,
      },
      heightMm: 165,
      tdp: 250,
      isActive: true,
    },
  ];

  for (const component of sampleComponents) {
    await prisma.component.upsert({
      where: { pcppId: component.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        ...component,
        pcppId: component.name.toLowerCase().replace(/\s+/g, "-"),
        imageUrl: `https://placeholder.com/${component.category}.png`,
      },
    });
  }

  console.log(`✅ Created ${sampleComponents.length} sample components`);

  // Add sample prices
  const components = await prisma.component.findMany();
  for (const component of components) {
    const basePrice = Math.floor(Math.random() * 500) + 50;
    await prisma.price.create({
      data: {
        componentId: component.id,
        retailer: "Amazon",
        price: basePrice,
        total: basePrice,
        currency: "USD",
        url: `https://amazon.com/dp/${component.pcppId}`,
        inStock: true,
      },
    });
  }

  console.log("✅ Created sample prices");

  // Create sample public build
  const { id: cpuId } = await prisma.component.findFirstOrThrow({
    where: { category: "CPU" },
  });
  const { id: moboId } = await prisma.component.findFirstOrThrow({
    where: { category: "MOTHERBOARD" },
  });
  const { id: ramId } = await prisma.component.findFirstOrThrow({
    where: { category: "MEMORY" },
  });
  const { id: gpuId } = await prisma.component.findFirstOrThrow({
    where: { category: "VIDEO_CARD" },
  });
  const { id: caseId } = await prisma.component.findFirstOrThrow({
    where: { category: "CASE" },
  });
  const { id: psuId } = await prisma.component.findFirstOrThrow({
    where: { category: "POWER_SUPPLY" },
  });
  const { id: storageId } = await prisma.component.findFirstOrThrow({
    where: { category: "STORAGE" },
  });

  const sampleBuild = await prisma.build.create({
    data: {
      name: "Sample Gaming Build 2024",
      description: "A balanced gaming PC for 1440p gaming",
      useCase: "GAMING",
      isPublic: true,
      totalPrice: 1850,
      totalWattage: 550,
      items: {
        create: [
          { componentId: cpuId, categorySlot: "CPU" },
          { componentId: moboId, categorySlot: "MOTHERBOARD" },
          { componentId: ramId, categorySlot: "MEMORY" },
          { componentId: gpuId, categorySlot: "VIDEO_CARD" },
          { componentId: storageId, categorySlot: "STORAGE" },
          { componentId: caseId, categorySlot: "CASE" },
          { componentId: psuId, categorySlot: "POWER_SUPPLY" },
        ],
      },
    },
  });

  console.log(`✅ Created sample build: ${sampleBuild.shareId}`);

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
