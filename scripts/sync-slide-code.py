#!/usr/bin/env python3
"""Keep the code on the slides identical to the code in the repo.

Every code block in presentation/index.html points at the file it came from:

    <pre class="code" data-src="tests/01-within.spec.ts#7-22"><code>…</code></pre>
    <pre class="code" data-src="demo-app/public/index.html#80,94-109"><code>…</code></pre>

  python3 scripts/sync-slide-code.py           copy the lines from the files into the slides
  python3 scripts/sync-slide-code.py --check   only check; exit 1 if anything is out of date

The check also makes sure that:
  - every code block has a data-src (no code on a slide without a file behind it),
  - the source file of every block is listed in its slide's data-files (the file chips),
  - every file in data-files exists.
"""
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECK = os.path.join(ROOT, 'presentation', 'index.html')
GAP = '// …'


def extract(path, ranges):
    lines = open(os.path.join(ROOT, path)).read().split('\n')
    spans = []
    for part in ranges.split(','):
        a, _, b = part.partition('-')
        a, b = int(a), int(b or a)
        if b < a or a < 1 or b > len(lines):
            raise ValueError(f'bad line range {part} in {path} ({len(lines)} lines)')
        spans.append((a, b))
    out = []
    for i, (a, b) in enumerate(spans):
        if i:
            skipped = lines[spans[i - 1][1]:a - 1]
            out.append(GAP if any(l.strip() for l in skipped) else '')
        out.extend(lines[a - 1:b])
    indent = min((len(l) - len(l.lstrip()) for l in out if l.strip() and l != GAP), default=0)
    return '\n'.join(l if l == GAP else l[indent:] for l in out)


def main(check):
    deck = open(DECK).read()
    problems = []

    # data-files of every slide, so blocks can be checked against their slide's file chips
    slides = [(m.start(), m.end(), m.group(1) or '') for m in
              re.finditer(r'<section class="slide[^"]*"(?:[^>]*?data-files="([^"]*)")?[^>]*>.*?</section>', deck, re.S)]
    for _, _, files in slides:
        for f in filter(None, files.split('|')):
            if not f.startswith('>') and not os.path.exists(os.path.join(ROOT, f)):
                problems.append(f'data-files points at a missing file: {f}')

    def slide_files(pos):
        for a, b, files in slides:
            if a <= pos < b:
                return [f for f in files.split('|') if f and not f.startswith('>')]
        return []

    out, pos, count = [], 0, 0
    for m in re.finditer(r'(<pre class="code[^"]*"[^>]*>)(\s*<code>)(.*?)(</code></pre>)', deck, re.S):
        tag = m.group(1)
        src = re.search(r'data-src="([^"#]+)#([^"]+)"', tag)
        if not src:
            problems.append(f'code block without data-src near: {html.unescape(re.sub("<[^>]+>", "", m.group(3)))[:60]!r}')
            continue
        path, ranges = src.groups()
        count += 1
        if not any(path == f or (f.endswith('/') and path.startswith(f)) for f in slide_files(m.start())):
            problems.append(f'{path} is shown on a slide but missing from that slide\'s data-files')
        try:
            fresh = html.escape(extract(path, ranges), quote=False)
        except ValueError as e:
            problems.append(str(e))
            continue
        if fresh != m.group(3):
            if check:
                problems.append(f'out of date: {path}#{ranges}')
            out.append(deck[pos:m.start(3)] + fresh)
            pos = m.end(3)
    out.append(deck[pos:])

    if not check:
        open(DECK, 'w').write(''.join(out))
    for p in problems:
        print('✘', p)
    print(f'{count} code blocks checked, {len(problems)} problem(s)')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
