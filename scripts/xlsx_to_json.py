"""Convert the accessories price list (xlsx) into data/products.json.

Usage: python3 scripts/xlsx_to_json.py data/product-list-accessories.xlsx
Licence products live in data/licenses.json and are merged at runtime.
"""
import json, re, sys
import openpyxl

CATEGORY_MAP = {
    "Marker": "markers",
    "Base, Band & Joint": "bases-bands-joints",
    "Rigid Body & Strap": "rigid-bodies-straps",
    "Suits & Gloves": "suits-gloves",
    "Active & VR Tracking": "active-vr-tracking",
    "Tape & Adhesive": "tape-adhesives",
    "Kit": "kits",
}

def slugify(s):
    s = s.lower().replace("®", "").replace('"', "in")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def price(v):
    if v is None or v == "" or float(v) <= 0:
        return None
    return round(float(v), 2)

def main(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    header = [h.strip() if isinstance(h, str) else h for h in rows[0]]
    idx = {h: i for i, h in enumerate(header)}
    products, seen = [], set()
    for r in rows[1:]:
        if not r[idx["Name"]]:
            continue
        name = str(r[idx["Name"]]).strip()
        handle = slugify(name)
        while handle in seen:
            handle += "-2"
        seen.add(handle)
        cat = CATEGORY_MAP.get(r[idx["Category"]], "kits")
        gbp, usd = price(r[idx["Price GBP"]]), price(r[idx["Price USD"]])
        notes = r[idx["Notes"]]
        products.append({
            "handle": handle,
            "sku": str(r[idx["Product Code"]]).strip(),
            "title": name,
            "description": (r[idx["Product Description"]] or name).strip(),
            "category": cat,
            "productType": r[idx["Product Type"]],
            "kind": "hardware",
            "price": {"GBP": gbp, "USD": usd},
            "needsReview": bool(notes),
            "reviewNote": notes,
        })
    json.dump(products, open("data/products.json", "w"), indent=2, ensure_ascii=False)
    print(f"Wrote {len(products)} products")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/product-list-accessories.xlsx")
