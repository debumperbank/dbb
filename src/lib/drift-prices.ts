// Owner-approved retail alignment to official DRIFT website, checked 18 October 2026.
// Public retail prices only. Supplier costs and discount terms must never be added here.
export type CataloguePrice = {priceCents:number; includesVat:true; checkedOn:string; source:string; basis:"regular" | "package"; fromPrice:boolean; variants?:{label:string; priceCents:number}[]};
export const driftPriceQuotes: Record<string, CataloguePrice> = {
  "drift-snowfoampakket": {
    "priceCents": 3495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/snowfoampakket/",
    "basis": "package",
    "fromPrice": false,
    "variants": [
      {
        "label": "Tuinslang",
        "priceCents": 3495
      },
      {
        "label": "Hogedrukreiniger",
        "priceCents": 3495
      }
    ]
  },
  "drift-vaderdagpakket": {
    "priceCents": 3995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/car-essentials-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-dashboardpakket": {
    "priceCents": 3395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/dashboardpakket/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-velgenborstel": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/velgenborstel/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "Set van 2",
        "priceCents": 2995
      },
      {
        "label": "S - 35 cm",
        "priceCents": 1395
      },
      {
        "label": "L - 45 cm",
        "priceCents": 1695
      }
    ]
  },
  "drift-detailing-kwasten-3-stuks": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/detailing-kwasten-3-stuks-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-exterieurpakket": {
    "priceCents": 10995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/exterieurpakket/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-wasspons": {
    "priceCents": 395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wasspons-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-washandschoen": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/washandschoen-14/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-handschoenen-10-paar": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/handschoenen-10-paar-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-foam-cannon-handpomp": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/foam-cannon-handpomp-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-foam-cannon-tuinslang": {
    "priceCents": 3995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/foam-cannon-tuinslang-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-foam-cannon-hoge-druk": {
    "priceCents": 4995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/foam-cannon-hoge-druk-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wegwerpdoeken-50-stuks": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wegwerpdoeken-50-stuks-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-glasdoek": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/glasdoek-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-waxdoek": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/waxdoek-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-microvezeldoeken-2-stuks": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/microvezeldoeken-2-stuks-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-droogdoek-1600-gsm": {
    "priceCents": 2995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/droogdoek-1600-gsm-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-droogdoek-1200-gsm": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/droogdoek-1200-gsm-8/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-droogdoek-600-gsm": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/droogdoek-600-gsm-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-tweepuntsborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/tweepuntsborstel-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-detailing-borstel": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/detailing-borstel-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-haarborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/haarborstel-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-leerborstel": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/leerborstel-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-textielborstel": {
    "priceCents": 1195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/textielborstel-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wheel-woolie": {
    "priceCents": 895,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wheel-woolie-6/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "Set van 3",
        "priceCents": 2995
      },
      {
        "label": "S - 30 cm",
        "priceCents": 895
      },
      {
        "label": "M - 37 cm",
        "priceCents": 995
      },
      {
        "label": "L - 50 cm",
        "priceCents": 1295
      }
    ]
  },
  "drift-bandenborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bandenborstel-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-insectenspons": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/insectenspons-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wax-sealantpad-2-stuks": {
    "priceCents": 395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wax-sealantpad-2-stuks-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-rubberverzorgingspad-2-stuks": {
    "priceCents": 395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/rubberverzorgingspad-2-stuks-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-bandenapplicator-2-stuks": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bandenapplicator-2-stuks-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-trolley-voor-wasemmer": {
    "priceCents": 4495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/trolley-voor-wasemmer-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wasemmer-met-vuilrooster": {
    "priceCents": 1795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wasemmer-met-vuilrooster-7/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "13 liter",
        "priceCents": 1795
      },
      {
        "label": "20 liter",
        "priceCents": 2495
      }
    ]
  },
  "drift-clay-bar-100-gram": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/clay-bar-100-gram-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-anti-condens": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/anti-condens-5/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-luchtverfrisser": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/luchtverfrisser-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-geurverwijderaar": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/geurverwijderaar-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-anti-condens-30-ml": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/anti-condens-30-ml-3/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-anti-condens-100-ml": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/anti-condens-100-ml-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-stickerverwijderaar": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/stickerverwijderaar-7/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-insecten-teerverwijderaar": {
    "priceCents": 1195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/insecten-teerverwijderaar-5/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-scherm-lakreiniger": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scherm-lakreiniger-3/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-drivetrain-cleaner": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/drivetrain-cleaner-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-vizier-goggle-brillenreiniger": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/vizier-goggle-brillenreiniger-3/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-helm-vizierreiniger": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/helm-vizierreiniger-3/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-kettingreiniger": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kettingreiniger-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-kalk-en-algenverwijderaar": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kalk-en-algenverwijderaar-2/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-glass-protect": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/glass-protect-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-metal-cleaner": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/metal-cleaner-4/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-clay-lube": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/clay-lube-3/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-rubber-kunststofhersteller": {
    "priceCents": 1595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/rubber-kunststofhersteller-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-motorreiniger": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorreiniger-5/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-bandenzwart": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bandenzwart-3/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1495
      },
      {
        "label": "1000 ML",
        "priceCents": 2195
      }
    ]
  },
  "drift-wheel-cleaner-alkaline": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wheel-cleaner-alkaline-5/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1295
      },
      {
        "label": "1000 ML",
        "priceCents": 1795
      }
    ]
  },
  "drift-nano-wet-coat": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/nano-wet-coat-6/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wax-spray-ceramic": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wax-spray-ceramic-6/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1995
      },
      {
        "label": "1000 ML",
        "priceCents": 2795
      }
    ]
  },
  "drift-leather-care-package": {
    "priceCents": 3595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/leather-care-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-plastic-restorer-kit": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/plastic-restorer-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-bug-tar-glue-remover-kit": {
    "priceCents": 1795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bug-tar-glue-remover-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-wheel-chain-kit": {
    "priceCents": 2995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wheel-chain-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-bike-essentials-kit": {
    "priceCents": 6295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bike-essentials-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-bucketdeal": {
    "priceCents": 10995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bucketdeal-auto/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-doekreiniger": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/doekreiniger/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1495
      },
      {
        "label": "1000 ML",
        "priceCents": 1995
      }
    ]
  },
  "drift-caravanhoes-voor-buitengebruik": {
    "priceCents": 18995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/caravanhoes-buitengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "XXS (400-450 cm)",
        "priceCents": 18995
      },
      {
        "label": "XS (450-500 cm)",
        "priceCents": 19995
      },
      {
        "label": "S (500-550 cm)",
        "priceCents": 20995
      },
      {
        "label": "M (550-600 cm)",
        "priceCents": 21995
      },
      {
        "label": "L (600-650 cm)",
        "priceCents": 22995
      },
      {
        "label": "XL (650-700 cm)",
        "priceCents": 23995
      },
      {
        "label": "XXL (700-750 cm)",
        "priceCents": 24995
      },
      {
        "label": "XXXL (750-800 cm)",
        "priceCents": 25995
      }
    ]
  },
  "drift-camperhoes-voor-buitengebruik": {
    "priceCents": 19995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/camperhoes-buitengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "XXXS (400-450 cm)",
        "priceCents": 19995
      },
      {
        "label": "XXS (450-500 cm)",
        "priceCents": 20995
      },
      {
        "label": "XS (500-550 cm)",
        "priceCents": 21995
      },
      {
        "label": "S (550-600 cm)",
        "priceCents": 22995
      },
      {
        "label": "M (600-650 cm)",
        "priceCents": 23995
      },
      {
        "label": "L (650-700 cm)",
        "priceCents": 24995
      },
      {
        "label": "XL (700-750 cm)",
        "priceCents": 25995
      },
      {
        "label": "XXL (750-800 cm)",
        "priceCents": 26995
      },
      {
        "label": "XXL (800-850 cm)",
        "priceCents": 27995
      }
    ]
  },
  "drift-fietshoes-voor-buitengebruik": {
    "priceCents": 2995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fietshoes-buitengebruik/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-fietshoes-voor-binnengebruik": {
    "priceCents": 4995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fietshoes-binnengebruik/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-scooterhoes-voor-buitengebruik": {
    "priceCents": 5495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scooterhoes-buitengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "M · Zonder windscherm",
        "priceCents": 5495
      },
      {
        "label": "M · Met windscherm",
        "priceCents": 5995
      },
      {
        "label": "L · Zonder windscherm",
        "priceCents": 5495
      },
      {
        "label": "L · Met windscherm",
        "priceCents": 5995
      }
    ]
  },
  "drift-motorhoes-voor-buitengebruik": {
    "priceCents": 9995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorhoes-voor-buitengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "M",
        "priceCents": 9995
      },
      {
        "label": "L",
        "priceCents": 9995
      },
      {
        "label": "XL",
        "priceCents": 9995
      },
      {
        "label": "XXL",
        "priceCents": 9995
      }
    ]
  },
  "drift-motorhoes-voor-binnengebruik": {
    "priceCents": 6995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorhoes-binnengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "M",
        "priceCents": 6995
      },
      {
        "label": "L",
        "priceCents": 6995
      },
      {
        "label": "XL",
        "priceCents": 6995
      },
      {
        "label": "XXL",
        "priceCents": 6995
      }
    ]
  },
  "drift-autohoes-voor-buitengebruik": {
    "priceCents": 15995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/autohoes-voor-buitengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "Coupe/Sedan - S",
        "priceCents": 15995
      },
      {
        "label": "Coupe/Sedan - M",
        "priceCents": 15995
      },
      {
        "label": "Coupe/Sedan - L",
        "priceCents": 15995
      },
      {
        "label": "Coupe/Sedan - XL",
        "priceCents": 15995
      },
      {
        "label": "Coupe/Sedan - XXL",
        "priceCents": 15995
      },
      {
        "label": "Stationwagon - M",
        "priceCents": 16995
      },
      {
        "label": "Stationwagon - L",
        "priceCents": 16995
      },
      {
        "label": "SUV/Jeep - M",
        "priceCents": 17995
      },
      {
        "label": "SUV/Jeep - L",
        "priceCents": 17995
      },
      {
        "label": "SUV/Jeep - XL",
        "priceCents": 17995
      }
    ]
  },
  "drift-autohoes-voor-binnengebruik": {
    "priceCents": 14995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/autohoes-binnengebruik/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "Coupe/Sedan - S",
        "priceCents": 14995
      },
      {
        "label": "Coupe/Sedan - M",
        "priceCents": 14995
      },
      {
        "label": "Coupe/Sedan - L",
        "priceCents": 14995
      },
      {
        "label": "Coupe/Sedan - XL",
        "priceCents": 14995
      },
      {
        "label": "Coupe/Sedan - XXL",
        "priceCents": 14995
      },
      {
        "label": "Stationwagon - M",
        "priceCents": 15995
      },
      {
        "label": "Stationwagon - L",
        "priceCents": 15995
      },
      {
        "label": "SUV/Jeep - M",
        "priceCents": 16995
      },
      {
        "label": "SUV/Jeep - L",
        "priceCents": 16995
      },
      {
        "label": "SUV/Jeep - XL",
        "priceCents": 16995
      }
    ]
  },
  "drift-bike-brush-kit": {
    "priceCents": 3695,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bike-brush-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-visor-helmet-cleaning-kit": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/visor-helmet-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-rims-chain-package": {
    "priceCents": 8995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/rims-chain-package-bicycle/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-drivetrain-kit": {
    "priceCents": 3295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/drivetrain-kit-bicycle/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-drivetrain-package": {
    "priceCents": 2995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/drivetrain-package-motorcycle/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-scratch-swirl-package": {
    "priceCents": 2295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scratch-swirl-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-rvs-exhaust-kit": {
    "priceCents": 1595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/rvs-exhaust-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-engine-package": {
    "priceCents": 3295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/engine-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-fabric-refresh-package": {
    "priceCents": 2095,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fabric-refresh-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-ceramic-package": {
    "priceCents": 4395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/ceramic-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-roof-hood-package": {
    "priceCents": 3195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/roof-hood-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-interieurpakket": {
    "priceCents": 7995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/interieurpakket/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-wheel-package": {
    "priceCents": 5195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wheel-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-wax-package": {
    "priceCents": 1795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wax-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-glass-package": {
    "priceCents": 3295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/glas-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-leather-care-kit": {
    "priceCents": 4595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/leather-care-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-foam-package": {
    "priceCents": 2695,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/foam-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-clay-package": {
    "priceCents": 2695,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/clay-package/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-truck-package": {
    "priceCents": 18995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/truck-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-scooter-package": {
    "priceCents": 10995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scooter-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-motorcycle-starter-kit": {
    "priceCents": 5495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorcycle-starter-kit/",
    "basis": "package",
    "fromPrice": false
  },
  "drift-bicycle-package": {
    "priceCents": 16995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bicycle-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-rv-caravan-package": {
    "priceCents": 17995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/rv-caravan-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-boat-package": {
    "priceCents": 15995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/boat-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-microvezel-flosband": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/microvezel-flosband/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-car-package": {
    "priceCents": 13995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/car-package/",
    "basis": "package",
    "fromPrice": true
  },
  "drift-melamine-wonderspons-10-stuks": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/melamine-wonderspons-10-stuks/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-all-weather-lube": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/all-weather-lube-motor/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-all-weather-wax": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/all-weather-wax/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wet-weather-lube": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wet-weather-lube/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-dry-weather-lube": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/dry-weather-lube/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-impregneerspray": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/impregneerspray-boot/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-remreiniger": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/remreiniger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-organiser-voor-wasemmer": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/organiser-voor-wasemmer/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-deksel-voor-wasemmer": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/deksel-voor-wasemmer/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-garagezeep": {
    "priceCents": 595,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/garagezeep/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-washandschoen-wol": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/washandschoen-wol/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-handschoenen-1-paar": {
    "priceCents": 395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/handschoenen/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-telescopische-wasborstel": {
    "priceCents": 3995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/telescopische-wasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-silicone-blade": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/silicone-blade/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-motorkettingborstel": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kettingborstel-motor/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-fietskettingborstel": {
    "priceCents": 795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kettingborstel-fiets/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wax-sealantspons": {
    "priceCents": 295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wax-sealant-spons/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-scrubbing-pad-2-stuks": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scrubbing-pad/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-schuurpads": {
    "priceCents": 495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/schuurpads/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-wiel-en-componentborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/wiel-en-componentborstel-fiets/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-cassetteklauw-en-aandrijflijnborstel": {
    "priceCents": 695,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/cassetteklauw-aandrijflijnborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-banden-en-cassetteborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/banden-cassetteborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-truckwasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/truckwasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-bootwasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bootwasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-camper-caravanwasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/camper-caravan-wasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-fietswasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fietswasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-scooterwasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scooterwasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-motorwasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorwasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-autowasborstel": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/autowasborstel/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-kleihandschoen": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kleihandschoen-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-kleidoek": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/kleidoek-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-textielreiniger": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/textielreiniger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-interieurverzorger": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/interieurverzorger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-interieurreiniger": {
    "priceCents": 1195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/interieurreiniger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-leerverzorger": {
    "priceCents": 1895,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/leerverzorger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-leerreiniger": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/leerreiniger-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-watervlekverwijderaar": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/watervlekverwijderaar/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-scooter-cleaner": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scooter-cleaner/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-bike-cleaner": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bike-cleaner-motor/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-glass-cleaner": {
    "priceCents": 995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/glass-cleaner-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-sprayhood-cleaner": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/bootkapreiniger/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1495
      },
      {
        "label": "1000 ML",
        "priceCents": 1995
      }
    ]
  },
  "drift-krasverwijderaar": {
    "priceCents": 1995,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/krasverwijderaar-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-iron-remover": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/iron-remover-truck/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-waterless-wash": {
    "priceCents": 1195,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/waterless-wash-camper-caravan/",
    "basis": "regular",
    "fromPrice": false
  },
  "drift-truckshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/truck-shampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-bootshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/boot-shampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-camper-caravanshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/camper-caravan-shampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-fietsshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fietsshampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-scootershampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scootershampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-motorshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorshampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-truckshampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/truck-shampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-bootshampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/boot-shampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-fietsshampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/fiets-shampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-camper-caravanshampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/camper-caravan-shampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-scootershampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/scootershampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-motorshampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/motorshampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  },
  "drift-soft-top-cleaner": {
    "priceCents": 1495,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/soft-top-cleaner/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1495
      },
      {
        "label": "1000 ML",
        "priceCents": 1995
      }
    ]
  },
  "drift-autoshampoo-snowfoam": {
    "priceCents": 1395,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/autoshampoo-snowfoam/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML",
        "priceCents": 1395
      },
      {
        "label": "1000ML",
        "priceCents": 1895
      }
    ]
  },
  "drift-shampoo-ceramic": {
    "priceCents": 1795,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/shampoo-ceramic/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1795
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 2395
      }
    ]
  },
  "drift-shampoo": {
    "priceCents": 1295,
    "includesVat": true,
    "checkedOn": "2026-10-18",
    "source": "https://drift-ds.nl/autoshampoo/",
    "basis": "regular",
    "fromPrice": false,
    "variants": [
      {
        "label": "500 ML (30+ wasbeurten)",
        "priceCents": 1295
      },
      {
        "label": "1000 ML (60+ wasbeurten)",
        "priceCents": 1795
      }
    ]
  }
};
