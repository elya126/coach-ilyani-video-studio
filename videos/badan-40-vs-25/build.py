"""Build 'Badan 40 Tak Boleh Dilayan Macam Badan 25' reel (9:16, 30fps, silent).

Usage: python3 build.py <assets_dir> <out.mp4>
Assets: card_*.png (927x777 crops from the previous reel) + chibi.png (RGBA bust).
"""
import math
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ASSETS, OUT = sys.argv[1], sys.argv[2]
W, H, FPS = 1080, 1920, 30
LIME, YELLOW, WHITE, RED = (198, 255, 59), (247, 229, 124), (255, 255, 255), (235, 80, 80)
F = "/usr/share/fonts/opentype/inter/Inter-%s.otf"


def font(size, weight="ExtraBold"):
    return ImageFont.truetype(F % weight, size)


def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def ease_back(t):
    t = max(0.0, min(1.0, t))
    c = 1.70158
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2


# ---------------------------------------------------------------- scenes
# headline: list of lines, each a list of (text, color)
# subs: list of (chunk text, keyword) shown evenly across the scene
SCENES = [
    dict(dur=3.2, card="nasi",
         head=[[("Dulu makan banyak,", WHITE)], [("tetap ", WHITE), ("slim.", YELLOW)]],
         subs=[("Dulu makan banyak", "banyak"), ("tetap slim", "slim")]),
    dict(dur=3.8, card="plate", chibi=True, bubble="Kenapa ni?",
         head=[[("Sekarang makan ", WHITE), ("sikit", YELLOW)], [("pun naik.", WHITE)]],
         subs=[("Sekarang makan sikit pun naik", "sikit"), ("Wanita 30 ke atas ini untuk anda", "30")]),
    dict(dur=5.0, kind="ages",
         subs=[("30 ke atas otot susut", "otot"), ("35 hormon berubah", "hormon"), ("40 perimenopause", "perimenopause")]),
    dict(dur=3.2, card="kopi", chibi=True, bubble="Makan lagi sikit…",
         head=[[("Mereka buat apa?", WHITE)]],
         subs=[("Dan apa mereka buat", "buat"), ("Makan lagi sikit", "sikit")]),
    dict(dur=4.8, kind="strike", chibi=True, bubble="Eh, tak la…",
         head=[[("Mereka fikir…", WHITE)]],
         subs=[("Makan sikit otot makin hilang", "otot"), ("Badan makin susah turun", "susah")]),
    dict(dur=4.5, card="telur", chibi=True, bubble="Senang je!",
         head=[[("Jaga ", WHITE), ("otot", YELLOW), (" dulu.", WHITE)]],
         subs=[("Protein setiap kali makan", "protein"), ("sebesar tapak tangan", "tapak")]),
    dict(dur=4.5, kind="chair",
         subs=[("Duduk bangun dari kerusi", "kerusi"), ("10 kali 2 set", "10"), ("2 hari seminggu", "2")]),
    dict(dur=4.5, kind="quote",
         subs=[("Badan 40 tak boleh", "40"), ("dilayan macam badan 25", "25"), ("Diet wanita kena sabar", "sabar")]),
    dict(dur=5.0, card="telur", chibi=True, bubble="Jumpa dalam komen!", kind="cta",
         head=[[("Nak idea menu", WHITE)], [("protein", YELLOW), (" saya?", WHITE)]],
         subs=[("Komen MULA", "MULA"), ("saya share idea menu", "menu")]),
]

# ---------------------------------------------------------------- assets
cards = {k: Image.open(f"{ASSETS}/card_{k}.png").convert("RGB") for k in ("nasi", "plate", "kopi", "telur", "teh", "air")}
chibi_src = Image.open(f"{ASSETS}/chibi.png").convert("RGBA")
chibi_src = chibi_src.crop((0, 0, chibi_src.width, 430))  # straight waist cut
CH_SCALE = 1.15
CHIBI = chibi_src.resize((int(chibi_src.width * CH_SCALE), int(chibi_src.height * CH_SCALE)), Image.LANCZOS)

CARD_W = 880
CARD_H = int(CARD_W * 777 / 927)
CARD_X, CARD_Y = (W - CARD_W) // 2, 500
SUB_Y = 1335
CH_X, CH_Y = W - CHIBI.width - 24, H - CHIBI.height


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255)
    return m


CARD_MASK = rounded_mask(CARD_W, CARD_H, 36)


def make_bg(card_key):
    """Blurred, darkened card as backdrop (same look as previous reel)."""
    if card_key is None:
        base = Image.new("RGB", (W, H), (34, 52, 36))
        src = cards["air"].resize((W, H))
        base = Image.blend(base, src.filter(ImageFilter.GaussianBlur(60)), 0.25)
    else:
        src = cards[card_key]
        s = max(W / src.width, H / src.height)
        base = src.resize((int(src.width * s), int(src.height * s))).filter(ImageFilter.GaussianBlur(45))
        base = base.crop(((base.width - W) // 2, (base.height - H) // 2, (base.width - W) // 2 + W, (base.height - H) // 2 + H))
        base = Image.blend(base, Image.new("RGB", (W, H), (20, 18, 12)), 0.55)
    # vertical vignette: darker at top and bottom for text
    grad = Image.new("L", (1, H))
    for y in range(H):
        d = abs(y - H * 0.45) / (H * 0.55)
        grad.putpixel((0, y), int(255 * min(1, d ** 1.6) * 0.75))
    base.paste(Image.new("RGB", (W, H), (8, 8, 6)), (0, 0), grad.resize((W, H)))
    return base


# ---------------------------------------------------------------- text helpers
def rich_width(d, parts, f):
    return sum(d.textlength(t, font=f) for t, _ in parts)


def draw_rich_line(img, parts, f, cy, alpha=1.0, dy=0, scale=1.0):
    """Draw one centered multi-colour line. Renders to a layer for alpha/scale."""
    d = ImageDraw.Draw(img)
    w = rich_width(d, parts, f)
    asc, desc = f.getmetrics()
    lh = asc + desc
    layer = Image.new("RGBA", (int(w) + 20, lh + 20), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    x = 10
    for t, c in parts:
        ld.text((x, 10), t, font=f, fill=c + (255,))
        x += ld.textlength(t, font=f)
    if scale != 1.0:
        layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.LANCZOS)
    if alpha < 1.0:
        a = layer.getchannel("A").point(lambda v: int(v * alpha))
        layer.putalpha(a)
    img.alpha_composite(layer, (int(W / 2 - layer.width / 2), int(cy - layer.height / 2 + dy)))


def draw_headline(img, lines, t, top=250, size=80):
    f = font(size)
    p = ease_out(t / 0.35)
    for i, parts in enumerate(lines):
        pi = ease_out((t - i * 0.12) / 0.35)
        draw_rich_line(img, parts, f, top + i * (size + 18), alpha=pi, dy=(1 - pi) * 30)
    return p


def draw_watermark(img):
    d = ImageDraw.Draw(img)
    f = font(30, "Bold")
    tw = d.textlength("Coach Ilyani", font=f)
    d.rounded_rectangle((36, 52, 36 + tw + 44, 104), 26, fill=(0, 0, 0, 110), outline=LIME + (255,), width=3)
    d.text((58, 60), "Coach ", font=f, fill=WHITE)
    d.text((58 + d.textlength("Coach ", font=f), 60), "Ilyani", font=f, fill=YELLOW)
    f2 = font(26, "Bold")
    w1 = d.textlength("Get Fit ", font=f2)
    w2 = d.textlength("Now", font=f2)
    x = W - 40 - w1 - w2
    d.text((x, 64), "Get Fit ", font=f2, fill=(235, 235, 235))
    d.text((x + w1, 64), "Now", font=f2, fill=LIME)


def draw_subs(img, subs, t, dur):
    seg = dur / len(subs)
    idx = min(int(t / seg), len(subs) - 1)
    text, kw = subs[idx]
    words = text.split()
    lt = t - idx * seg
    cur = min(int(lt / (seg * 0.85) * len(words)), len(words) - 1)
    f = font(58)
    d = ImageDraw.Draw(img)
    gap = 18
    f_kw = font(64)
    is_kws = [w.lower().strip(".,") == kw.lower() for w in words]
    widths = [d.textlength(w, font=f_kw if k else f) for w, k in zip(words, is_kws)]
    total = sum(widths) + gap * (len(words) - 1)
    # wrap to two lines if too wide
    lines = [list(range(len(words)))]
    if total > W - 120:
        half = len(words) // 2 + len(words) % 2
        lines = [list(range(half)), list(range(half, len(words)))]
    for li, ids in enumerate(lines):
        lw = sum(widths[i] for i in ids) + gap * (len(ids) - 1)
        x = W / 2 - lw / 2
        y = SUB_Y + li * 72 - (len(lines) - 1) * 36
        for i in ids:
            w = words[i]
            is_kw = is_kws[i]
            col = LIME if i == cur else (YELLOW if is_kw else WHITE)
            sz = 64 if (is_kw and i <= cur) else 58
            ff = font(sz) if sz != 58 else f
            bounce = -6 * math.sin(min(1, (lt - i * seg * 0.85 / len(words)) / 0.15) * math.pi) if (is_kw and i == cur) else 0
            d.text((x, y - (sz - 58) / 2 + bounce - 30), w, font=ff, fill=col + (255,),
                   stroke_width=3, stroke_fill=(0, 0, 0, 160))
            x += widths[i] + gap


def draw_card(img, key, t, dur, dim=0.0):
    p = ease_back(t / 0.45)
    a = ease_out(t / 0.3)
    zoom = 1.0 + 0.05 * (t / dur)  # slow Ken Burns
    src = cards[key]
    cw, chh = int(CARD_W * zoom), int(CARD_H * zoom)
    im = src.resize((cw, chh), Image.BILINEAR)
    im = im.crop(((cw - CARD_W) // 2, (chh - CARD_H) // 2, (cw - CARD_W) // 2 + CARD_W, (chh - CARD_H) // 2 + CARD_H))
    if dim:
        im = Image.blend(im, Image.new("RGB", im.size, (10, 10, 10)), dim)
    card = Image.new("RGBA", (CARD_W + 12, CARD_H + 12), (0, 0, 0, 0))
    ImageDraw.Draw(card).rounded_rectangle((0, 0, CARD_W + 11, CARD_H + 11), 42, fill=(255, 255, 255, 200))
    card.paste(im, (6, 6), CARD_MASK)
    s = 0.9 + 0.1 * p
    if s != 1.0:
        card = card.resize((int(card.width * s), int(card.height * s)), Image.BILINEAR)
    if a < 1:
        card.putalpha(card.getchannel("A").point(lambda v: int(v * a)))
    img.alpha_composite(card, (int(W / 2 - card.width / 2), int(CARD_Y + CARD_H / 2 - card.height / 2)))


def draw_chibi(img, t, bubble):
    p = ease_back((t - 0.15) / 0.4)
    if p <= 0:
        return
    bob = math.sin(t * 2.6) * 6
    c = CHIBI
    if p < 0.999:
        c = c.resize((max(1, int(c.width * p)), max(1, int(c.height * p))), Image.BILINEAR)
    img.alpha_composite(c, (int(CH_X + (CHIBI.width - c.width) / 2), int(CH_Y + (CHIBI.height - c.height) + bob)))
    if bubble and t > 0.55:
        bp = ease_back((t - 0.55) / 0.3)
        f = font(40, "ExtraBold")
        d = ImageDraw.Draw(img)
        tw = d.textlength(bubble, font=f)
        bw, bh = int(tw + 52), 76
        layer = Image.new("RGBA", (bw + 30, bh + 30), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.rounded_rectangle((0, 0, bw, bh), 30, fill=(255, 255, 255, 245))
        ld.polygon([(bw - 70, bh - 2), (bw - 30, bh - 2), (bw - 20, bh + 26)], fill=(255, 255, 255, 245))
        ld.text((26, 14), bubble, font=f, fill=(25, 30, 25))
        s = max(0.01, bp)
        layer = layer.resize((max(1, int(layer.width * s)), max(1, int(layer.height * s))), Image.BILINEAR)
        bx = CH_X + 40 - bw
        by = CH_Y + 40 + bob
        img.alpha_composite(layer, (int(bx + (bw + 30) * (1 - s)), int(by + (bh + 30) * (1 - s))))


# ---------------------------------------------------------------- special scenes
def scene_ages(img, t):
    rows = [("30+", "Otot susut"), ("35+", "Hormon berubah"), ("40+", "Perimenopause")]
    fnum, ftxt = font(120, "Black"), font(70)
    for i, (n, txt) in enumerate(rows):
        start = i * 1.5
        p = ease_back((t - start) / 0.4)
        if p <= 0:
            continue
        a = ease_out((t - start) / 0.25)
        cy = 560 + i * 250
        layer = Image.new("RGBA", (W, 200), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.rounded_rectangle((90, 10, W - 90, 190), 34, fill=(10, 14, 10, 170), outline=(255, 255, 255, 40), width=2)
        ld.text((130, 28), n, font=fnum, fill=YELLOW)
        ld.text((420, 58), txt, font=ftxt, fill=WHITE)
        s = 0.85 + 0.15 * p
        layer = layer.resize((int(W * s), int(200 * s)), Image.BILINEAR)
        if a < 1:
            layer.putalpha(layer.getchannel("A").point(lambda v: int(v * a)))
        img.alpha_composite(layer, (int(W / 2 - layer.width / 2), int(cy - layer.height / 2)))
    draw_rich_line(img, [("Badan wanita ", WHITE), ("berubah", YELLOW)], font(64), 290,
                   alpha=ease_out(t / 0.3))


def scene_strike(img, t):
    box = Image.new("RGBA", (860, 300), (0, 0, 0, 0))
    bd = ImageDraw.Draw(box)
    bd.rounded_rectangle((0, 0, 859, 299), 36, fill=(12, 18, 12, 215))
    f = font(92)
    l1, l2 = "Makan sikit =", "kurus"
    bd.text((430 - bd.textlength(l1, font=f) / 2, 40), l1, font=f, fill=WHITE)
    x2 = 430 - bd.textlength(l2, font=f) / 2
    w2 = bd.textlength(l2, font=f)
    bd.text((x2, 155), l2, font=f, fill=LIME if t < 1.4 else (160, 160, 160))
    sp = ease_out((t - 1.4) / 0.4)
    if sp > 0:
        bd.line((x2 - 20, 212, x2 - 20 + (w2 + 40) * sp, 204), fill=RED, width=12)
    a = ease_out(t / 0.3)
    if a < 1:
        box.putalpha(box.getchannel("A").point(lambda v: int(v * a)))
    img.alpha_composite(box, ((W - 860) // 2, 560))
    if t > 2.2:
        pa = ease_back((t - 2.2) / 0.35)
        draw_rich_line(img, [("Otot ", YELLOW), ("makin hilang.", WHITE)], font(70), 990, alpha=min(1, pa), scale=0.8 + 0.2 * pa)


def scene_chair(img, t):
    draw_rich_line(img, [("Duduk-bangun", WHITE)], font(72), 330, alpha=ease_out(t / 0.3))
    draw_rich_line(img, [("dari ", WHITE), ("kerusi", YELLOW)], font(72), 420, alpha=ease_out((t - 0.12) / 0.3))
    p = ease_back((t - 0.5) / 0.45)
    if p > 0:
        draw_rich_line(img, [("10×", YELLOW)], font(300, "Black"), 720, alpha=min(1, p), scale=0.6 + 0.4 * p)
    p2 = ease_back((t - 1.6) / 0.4)
    if p2 > 0:
        draw_rich_line(img, [("2 set", LIME), ("  ·  ", WHITE), ("2 hari", LIME), (" seminggu", WHITE)],
                       font(66), 1000, alpha=min(1, p2), scale=0.85 + 0.15 * p2)


def scene_quote(img, t):
    f = font(96, "Black")
    lines = [[("Badan ", WHITE), ("40", YELLOW)], [("tak boleh dilayan", WHITE)], [("macam badan ", WHITE), ("25.", YELLOW)]]
    for i, parts in enumerate(lines):
        p = ease_out((t - i * 0.35) / 0.4)
        if p > 0:
            draw_rich_line(img, parts, f, 540 + i * 120, alpha=p, dy=(1 - p) * 40)
    if t > 2.4:
        p = ease_back((t - 2.4) / 0.4)
        draw_rich_line(img, [("Diet wanita kena ", WHITE), ("sabar.", LIME)], font(64), 1000,
                       alpha=min(1, p), scale=0.85 + 0.15 * p)


def draw_cta_button(img, t):
    p = ease_back((t - 0.3) / 0.45)
    if p <= 0:
        return
    pulse = 1 + 0.035 * math.sin(max(0, t - 0.8) * 5)
    f = font(96, "Black")
    bw, bh = 700, 170
    layer = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((0, 0, bw - 1, bh - 1), 40, fill=LIME + (255,))
    tw = ld.textlength("Komen MULA", font=f)
    ld.text(((bw - tw) / 2, 30), "Komen MULA", font=f, fill=(15, 25, 10))
    s = max(0.01, p * pulse)
    layer = layer.resize((int(bw * s), int(bh * s)), Image.BILINEAR)
    img.alpha_composite(layer, (int(W / 2 - layer.width / 2), int(CARD_Y + 230 - layer.height / 2)))


# ---------------------------------------------------------------- render
def main():
    bgs = [make_bg(s.get("card")) for s in SCENES]
    total = sum(s["dur"] for s in SCENES)
    nframes = int(round(total * FPS))
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", OUT]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    starts = []
    acc = 0.0
    for s in SCENES:
        starts.append(acc)
        acc += s["dur"]
    prev_frame = None
    for n in range(nframes):
        gt = n / FPS
        si = max(i for i, st in enumerate(starts) if st <= gt + 1e-9)
        s, t = SCENES[si], gt - starts[si]
        img = bgs[si].convert("RGBA")
        kind = s.get("kind")
        if s.get("card"):
            draw_card(img, s["card"], t, s["dur"], dim=0.35 if kind == "cta" else 0.0)
        if kind == "ages":
            scene_ages(img, t)
        elif kind == "strike":
            scene_strike(img, t)
        elif kind == "chair":
            scene_chair(img, t)
        elif kind == "quote":
            scene_quote(img, t)
        elif kind == "cta":
            draw_cta_button(img, t)
        if s.get("head"):
            draw_headline(img, s["head"], t)
        if s.get("chibi"):
            draw_chibi(img, t, s.get("bubble"))
        draw_subs(img, s["subs"], t, s["dur"])
        draw_watermark(img)
        frame = img.convert("RGB")
        # 5-frame crossfade at scene start
        if prev_frame is not None and t < 5 / FPS and si > 0:
            frame = Image.blend(prev_frame, frame, (t * FPS + 1) / 6)
        if t + 1 / FPS >= s["dur"] - 1e-6:
            prev_frame = frame
        proc.stdin.write(frame.tobytes())
        if n % 150 == 0:
            print(f"frame {n}/{nframes}", flush=True)
    proc.stdin.close()
    proc.wait()
    print("done", OUT, total, "s")


if __name__ == "__main__":
    main()
