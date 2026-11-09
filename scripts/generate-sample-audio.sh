#!/usr/bin/env bash
# Generates simple, royalty-free PLACEHOLDER audio with FFmpeg so the sample
# videos have sound out of the box. Replace with your own licensed music for
# real posts. Usage: npm run audio:samples
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/music public/sfx
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# --- Soft ambient pad: 4 gentle chords (Cmaj7 → Am7 → Fmaj7 → G6), 4s each, looped to 64s
chord() { # name f1 f2 f3 f4
  ffmpeg -loglevel error -y -f lavfi -i \
    "aevalsrc='0.18*sin(2*PI*$2*t)+0.14*sin(2*PI*$3*t)+0.12*sin(2*PI*$4*t)+0.10*sin(2*PI*$5*t)+0.05*sin(2*PI*($2/2)*t)':s=44100:d=4" \
    -af "afade=t=in:d=0.8,afade=t=out:st=3.0:d=1.0,tremolo=f=0.4:d=0.25" "$TMP/$1.wav"
}
chord c 261.63 329.63 392.00 493.88
chord a 220.00 261.63 329.63 392.00
chord f 174.61 220.00 261.63 329.63
chord g 196.00 246.94 293.66 329.63
printf "file '%s'\n" "$TMP"/{c,a,f,g}.wav "$TMP"/{c,a,f,g}.wav "$TMP"/{c,a,f,g}.wav "$TMP"/{c,a,f,g}.wav > "$TMP/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" \
  -af "aecho=0.8:0.85:120|260:0.35|0.22,lowpass=f=2400,volume=0.9,loudnorm=I=-14:TP=-1.5" \
  -ar 44100 -ac 2 -b:a 128k public/music/calm-ambient.mp3

# --- Whoosh: filtered noise sweep (for scene transitions)
ffmpeg -loglevel error -y -f lavfi -i "anoisesrc=d=0.7:c=pink:a=0.6" \
  -af "highpass=f=400,lowpass=f=3500,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.35,volume=0.6" \
  -ac 2 -b:a 128k public/sfx/whoosh.mp3

# --- Pop: short soft click (for text appearing)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.6*sin(2*PI*(900-700*t*8)*t)*exp(-30*t)':s=44100:d=0.18" \
  -ac 2 -b:a 128k public/sfx/pop.mp3

# --- Chime: gentle bell (for end card / highlights)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.3*sin(2*PI*1318.5*t)*exp(-3*t)+0.2*sin(2*PI*1975.5*t)*exp(-4*t)+0.15*sin(2*PI*2637*t)*exp(-6*t)':s=44100:d=1.6" \
  -af "aecho=0.8:0.7:90:0.3" -ac 2 -b:a 128k public/sfx/chime.mp3

echo "Sample audio created in public/music and public/sfx"
