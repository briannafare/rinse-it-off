"""Share images (1200x630) for link previews: the page's own photo or illustration
on the left, a flat cream title block with the real logo on the right, and the
three-band livery stripe along the bottom. Output: public/og/*.jpg.

Run from the repo root:  python3 scripts/make-og-images.py
The logo is pasted as-is from public/logo-dark.png, never retyped."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
OUT = PUB / "og"
W, H, PANEL = 1200, 630, 430
CREAM, INK, MUTED = (251, 248, 242), (12, 18, 21), (91, 103, 112)
STRIPE = [(214, 51, 108), (98, 196, 235), (242, 182, 50)]
FUTURA = "/System/Library/Fonts/Supplemental/Futura.ttc"

# name -> (source image, label over the stripe)
PAGES = {
    "home": ("brand/retro/r6-07-pnw-glasswall-wfp.webp", "Homes and businesses"),
    "commercial": ("brand/retro/r6-11-com-office-entry.webp", "Commercial properties"),
    "services": ("brand/retro/mi-siding.webp", "Six cleaning methods"),
    "areas": ("brand/retro/neighborhood.webp", "Across the Portland metro"),
    "plan": ("brand/retro/i-home-wide.webp", "The yearly plan"),
    "blog": ("brand/retro/b4-shopping.webp", "Straight answers"),
    "service-roof-soft-wash": ("brand/retro/mi-roof.webp", "Roof soft washing"),
    "service-house-washing": ("brand/retro/mi-siding.webp", "House washing"),
    "service-concrete-surface-cleaning": ("brand/retro/mi-flatwork.webp", "Concrete cleaning"),
    "service-pure-water-window-cleaning": ("brand/retro/mi-glass.webp", "Window cleaning"),
    "service-hot-water-degreasing": ("brand/retro/mi-grease.webp", "Hot-water degreasing"),
    "service-brick-masonry-washing": ("brand/retro/mi-masonry.webp", "Brick and masonry"),
}


def cover(im: Image.Image, w: int, h: int) -> Image.Image:
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def font(size: int, index: int = 0):
    try:
        return ImageFont.truetype(FUTURA, size, index=index)
    except OSError:
        return ImageFont.load_default()


def make(name: str, src: str, label: str) -> None:
    canvas = Image.new("RGB", (W, H), CREAM)
    photo = cover(Image.open(PUB / src).convert("RGB"), W - PANEL, H - 14)
    canvas.paste(photo, (0, 0))

    logo = Image.open(PUB / "logo-dark.png").convert("RGBA")
    lw = PANEL - 110
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    lx = W - PANEL + (PANEL - lw) // 2
    canvas.paste(logo, (lx, 150), logo)

    d = ImageDraw.Draw(canvas)
    cx = W - PANEL // 2
    top = 150 + logo.height + 40
    small = font(24, 4)  # Futura Medium
    for i, line in enumerate([label.upper(), "PORTLAND, OREGON"]):
        f = small
        tw = d.textlength(line, font=f)
        d.text((cx - tw / 2, top + i * 40), line, font=f, fill=INK if i == 0 else MUTED)

    bw = W // 3
    for i, c in enumerate(STRIPE):
        d.rectangle([i * bw, H - 14, (i + 1) * bw if i < 2 else W, H], fill=c)

    OUT.mkdir(exist_ok=True)
    canvas.save(OUT / f"{name}.jpg", "JPEG", quality=84, optimize=True, progressive=True)


if __name__ == "__main__":
    for n, (s, l) in PAGES.items():
        make(n, s, l)
        print(f"public/og/{n}.jpg", (OUT / f"{n}.jpg").stat().st_size // 1024, "KB")
