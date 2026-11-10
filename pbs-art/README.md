# PBS-ART Receipt Metadata

On-chain metadata root for PBS-1 Patronage Bundle receipts (PBS1WrapperV2).

The wrapper's `tokenURI(id)` resolves to:

    https://wisestake.consulting/pbs-art/{CATEGORY}/{bundleId}.json

- `{CATEGORY}` is the bundle's on-chain category (uppercase): SECURITY, MUSIC, DONOR, LOYALTY, TITHE, ART, MERCHANT, BUSINESS, ENS. The registry is extensible on-chain (`addCategory`) - when a new category is added, create its folder here and add its art.
- `img/` holds one artwork per category (the engraved PBS-ART set, WSC owl). LOYALTY shares MERCHANT's artwork.
- Files are pre-generated for bundle ids 1-50. When bundle 51 mints, add its JSON (copy a neighbor, bump the number) - or ask Bird Dog to extend the bank.

## Adding a category (web UI)

1. Create the art PNG and upload it to `pbs-art/img/<category>.png` (Add file -> type the path).
2. Create folder `pbs-art/<CATEGORY>/` with the id JSONs (same shape as neighbors).
3. On-chain: owner calls `addCategory(bytes32)` with the right-padded label.
