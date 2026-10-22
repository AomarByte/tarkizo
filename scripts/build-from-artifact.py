#!/usr/bin/env python3
"""Wrap the artifact source (page body only) into the full index.html of the website.
Usage: python3 scripts/build-from-artifact.py path/to/artifact-index.html
You normally don't need this: edit index.html in this repository directly."""
import sys, re, pathlib
src = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
src = re.sub(r'^<title>.*?</title>\s*', '', src, count=1, flags=re.S)
src = src.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
HEAD = '''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>TARKIZO</title>
<meta name="description" content="مؤقّت هادئ للدراسة والتركيز بأربع لغات، مع شاشة تركيز كاملة وأصوات طبيعية. A calm study and focus timer.">
<meta name="theme-color" content="#E7EDEB">
<meta name="color-scheme" content="light dark">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="TARKIZO">
<style>
/* base reset (the same base the preview used) */
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px system-ui,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
'''
# keep the page's own <link>/<style> in <head>, content in <body>
i = src.index('<canvas id="scene"')
out = HEAD + src[:i] + '</head>\n<body>\n' + src[i:] + '\n</body>\n</html>\n'
pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').write_text(out, encoding='utf-8')
print('index.html written')
