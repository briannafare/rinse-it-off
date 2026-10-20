"""The one treatment every raster image on the site gets (palette brief 2026-10-20): clean, neutral
colour with subtle fine film grain only. No warming, no fade, no lifted blacks, no sepia. The colour
itself comes from the generation prompt's grade sentence; real photos keep their honest colour.
Usage: python3 scripts/print-grade.py [--illo] in.png out.webp [width]
Self-check: python3 scripts/print-grade.py --demo"""
import sys, random
from PIL import Image, ImageEnhance, ImageChops

PAPER = (245, 237, 220)

def grade(im: Image.Image, illo=False) -> Image.Image:
    im = im.convert("RGB")
    noise = Image.effect_noise(im.size, 14).convert("RGB")          # subtle fine grain only
    return ImageChops.blend(im, ImageChops.overlay(im, noise), 0.06 if illo else 0.08)

if __name__ == "__main__":
    a = sys.argv[1:]
    if a == ["--demo"]:
        w = grade(Image.new("RGB", (64, 64), (200, 200, 200)))
        r, g, b = w.getpixel((32, 32)); assert abs(r - b) <= 6 and abs(r - g) <= 6, "neutral stays neutral"
        print("ok"); sys.exit()
    illo = a[0] == "--illo"
    if illo: a = a[1:]
    src, dst = a[0], a[1]
    width = int(a[2]) if len(a) > 2 else None
    im = Image.open(src)
    if width and im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    grade(im, illo).save(dst, quality=80, method=5)
