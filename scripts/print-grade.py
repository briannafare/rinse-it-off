"""The one warm print grade every raster image on the site gets (brief 2026-10-19, section 4b):
warmer (+~10), lifted blacks, ~5% fade toward warm paper, slightly reduced saturation, fine film grain.
Photos get the full grade; illustrations (--illo) get only the fade and grain.
Usage: python3 scripts/print-grade.py [--illo] in.png out.webp [width]
Self-check: python3 scripts/print-grade.py --demo"""
import sys, random
from PIL import Image, ImageEnhance, ImageChops

PAPER = (245, 237, 220)

def grade(im: Image.Image, illo=False) -> Image.Image:
    im = im.convert("RGB")
    if not illo:
        r, g, b = im.split()
        r = r.point(lambda v: min(255, int(v * 1.045 + 3)))
        b = b.point(lambda v: int(v * 0.93))
        im = Image.merge("RGB", (r, g, b))
        im = im.point(lambda v: int(16 + v * (233 / 255)))          # lift blacks, soften whites a touch
        im = ImageEnhance.Color(im).enhance(0.88)                    # slightly reduced saturation
    im = Image.blend(im, Image.new("RGB", im.size, PAPER), 0.05)    # ~5% fade toward paper
    random.seed(7)
    noise = Image.effect_noise(im.size, 18).convert("RGB")          # fine grain
    im = ImageChops.blend(im, ImageChops.overlay(im, noise), 0.12)
    return im

if __name__ == "__main__":
    a = sys.argv[1:]
    if a == ["--demo"]:
        t = Image.new("RGB", (64, 64), (0, 0, 0)); g = grade(t)
        assert min(g.getpixel((32, 32))) >= 10, "blacks lifted"
        w = grade(Image.new("RGB", (64, 64), (100, 100, 200))); r, _, b = w.getpixel((32, 32))
        assert r > 95 and b < 200, "warmer"
        print("ok"); sys.exit()
    illo = a[0] == "--illo"
    if illo: a = a[1:]
    src, dst = a[0], a[1]
    width = int(a[2]) if len(a) > 2 else None
    im = Image.open(src)
    if width and im.width > width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    grade(im, illo).save(dst, quality=80, method=5)
