(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- crayon doodles: flowers, butterflies, bees ---------------- */
  var CRAYON = { pink: '#ff6fb3', blue: '#5cc4d0', green: '#b3cc2e', yellow: '#f7a1c8' };
  var CENTER_FILL = '#f4ec8c';
  var COLORS = ['pink', 'blue', 'green', 'yellow'];

  // one shared SVG filter that roughens edges and adds wax-crayon grain
  (function () {
    var defs = document.createElement('div');
    defs.setAttribute('aria-hidden', 'true');
    defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    defs.innerHTML =
      '<svg width="0" height="0"><defs>' +
      '<filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="3" result="wobble"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="wobble" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="rough"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="8" result="grain"/>' +
        '<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="grainMask"/>' +
        '<feComposite in="rough" in2="grainMask" operator="in"/>' +
      '</filter>' +
      // edges only (no grain) for the hand-lettered name
      '<filter id="pen" x="-5%" y="-10%" width="110%" height="120%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="11" result="w"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="w" scale="4.5" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
      '</defs></svg>';
    document.body.appendChild(defs);
  })();

  // loopy-petal flower with a spiral in each petal and a soft yellow centre
  function flower(color, cx, cy, r, petals) {
    petals = petals || 6;
    var c = CRAYON[color], k = r / 38, out = '';
    out += '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')" filter="url(#crayon)" ' +
           'fill="none" stroke-linecap="round" stroke-linejoin="round">';
    for (var i = 0; i < petals; i++) {
      var a = (360 / petals) * i + [0, 6, -4, 3, -6, 2][i % 6];
      var len = 1 + [0, .06, -.04, .08, -.02, .03][i % 6];
      out += '<g transform="rotate(' + a + ') scale(1 ' + len + ')">' +
        '<path d="M0 -8 C -15 -12, -15 -36, 0 -38 C 15 -36, 15 -12, 0 -8" fill="#fff" stroke="' + c + '" stroke-width="5.5"/>' +
        '<path d="M1 -16 C -6 -17, -7 -29, 0 -30 C 5 -29, 6 -22, 0 -21" stroke="' + c + '" stroke-width="4"/>' +
        '</g>';
    }
    out += '<circle r="11" fill="' + CENTER_FILL + '"/>' +
           '<path d="M-1 -4 C 4 -4, 4 3, 0 3 C -3 3, -3 0, -1 -1" stroke="#fffbe3" stroke-width="2"/>';
    return out + '</g>';
  }

  // yellow butterfly with pink spots and a pink body
  function butterfly(cx, cy, r) {
    var k = r / 44, wing = '#f8da4c', spot = '#ff79b8';
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ') rotate(14)" filter="url(#crayon)">' +
      '<path d="M-2 -4 C -10 -42, -42 -40, -36 -12 C -32 2, -14 4, -2 -4Z" fill="' + wing + '"/>' +
      '<path d="M-2 2 C -22 2, -36 14, -28 27 C -20 35, -6 22, -2 2Z" fill="' + wing + '"/>' +
      '<path d="M2 -4 C 14 -32, 38 -30, 34 -10 C 30 3, 14 4, 2 -4Z" fill="' + wing + '"/>' +
      '<path d="M2 2 C 17 4, 29 14, 23 25 C 17 33, 4 21, 2 2Z" fill="' + wing + '"/>' +
      '<ellipse cx="-22" cy="-20" rx="5" ry="6.5" fill="' + spot + '"/>' +
      '<ellipse cx="20" cy="-14" rx="6" ry="5" fill="' + spot + '" transform="rotate(-25 20 -14)"/>' +
      '<ellipse cx="-20" cy="18" rx="4.5" ry="3.5" fill="' + spot + '"/>' +
      '<ellipse cx="14" cy="20" rx="3" ry="4.5" fill="' + spot + '"/>' +
      '<g fill="none" stroke="' + spot + '" stroke-linecap="round">' +
        '<path d="M-6 28 C -2 10, 2 -10, 5 -24" stroke-width="6.5"/>' +
        '<path d="M4 -22 C 2 -32, -1 -38, -3 -44" stroke-width="4.5"/>' +
        '<path d="M6 -22 C 10 -30, 13 -34, 16 -38" stroke-width="4.5"/>' +
      '</g></g>';
  }

  // round smiley bumblebee with see-through blue wings
  function bee(cx, cy, r) {
    var k = r / 46, brown = '#4b3526';
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')" filter="url(#crayon)">' +
      '<ellipse cx="6" cy="-30" rx="8" ry="17" fill="#b9def5" opacity=".9" transform="rotate(18 6 -30)"/>' +
      '<ellipse cx="18" cy="-28" rx="9" ry="17" fill="#cfe9f9" opacity=".9" transform="rotate(36 18 -28)"/>' +
      '<path d="M35 -3 L47 2 L35 8Z" fill="' + brown + '"/>' +
      '<ellipse cx="0" cy="0" rx="37" ry="27" fill="#f7da68"/>' +
      '<path d="M4 -26.5 C 9 -27, 16 -25, 21 -22 C 23 -6, 18 8, 21 22 C 15 25, 9 27, 4 26.5 C 8 8, 2 -8, 4 -26.5Z" fill="' + brown + '"/>' +
      '<ellipse cx="-25" cy="-6" rx="3.2" ry="3.8" fill="' + brown + '"/>' +
      '<ellipse cx="-15" cy="-6" rx="3.2" ry="3.8" fill="' + brown + '"/>' +
      '<g fill="none" stroke="' + brown + '" stroke-linecap="round">' +
        '<path d="M-26 4 C -23 9, -16 9, -14 4" stroke-width="2.2"/>' +
        '<path d="M-22 -24 C -26 -33, -32 -35, -36 -33" stroke-width="2.6"/>' +
        '<path d="M-13 -26 C -13 -35, -9 -39, -5 -39" stroke-width="2.6"/>' +
        '<path d="M-18 25 L-22 31 M-6 27 L-7 33 M14 26 L15 32 M24 22 L28 27" stroke-width="2.6"/>' +
      '</g></g>';
  }

  // white kitty with pastel stained-glass butterfly wings (the site mascot)
  var catId = 0;
  function fairyCat(cx, cy, r) {
    var k = r / 58, id = 'cw' + (catId++), line = '#231f22';
    var glass = { pink: '#fbd3df', yellow: '#fbf3b4', blue: '#cfe9fb', green: '#d3f2c4', lilac: '#dcd8fb', peach: '#fcd9cc', lime: '#ecf7c8' };
    var upper = 'M-10 -6 L-46 -34 C -52 -38, -60 -34, -60 -26 L-60 6 C -60 12, -56 14, -50 14 L-12 8 Z';
    var lower = 'M-10 8 C -28 6, -44 14, -47 27 C -49 37, -40 42, -30 39 L -10 24 Z';
    function wing() {
      return '<g class="cat-wing">' +
        '<g clip-path="url(#' + id + 'u)">' +
          '<polygon points="-62,-40 -8,-40 -8,-12 -62,-22" fill="' + glass.pink + '"/>' +
          '<polygon points="-62,-22 -8,-12 -8,-2 -62,-8" fill="' + glass.yellow + '"/>' +
          '<polygon points="-62,-8 -8,-2 -8,6 -62,4" fill="' + glass.blue + '"/>' +
          '<polygon points="-62,4 -8,6 -8,16 -62,16" fill="' + glass.green + '"/>' +
          '<path d="M-62 -22 L-8 -12 M-62 -8 L-8 -2 M-62 4 L-8 6 M-44 4 L-38 16" stroke="' + line + '" stroke-width="2.6" fill="none"/>' +
        '</g>' +
        '<path d="M-38 -16 C -38 -20, -34 -22, -28 -21 L-18 -18 C -14 -17, -14 -4, -18 -3 L-32 -3 C -38 -3, -40 -10, -38 -16Z" fill="' + glass.lime + '" stroke="' + line + '" stroke-width="2.6"/>' +
        '<path d="' + upper + '" fill="none" stroke="' + line + '" stroke-width="3.6" stroke-linejoin="round"/>' +
        '<g clip-path="url(#' + id + 'l)">' +
          '<polygon points="-50,4 -8,4 -8,14 -50,18" fill="' + glass.peach + '"/>' +
          '<polygon points="-50,18 -8,14 -8,22 -50,28" fill="' + glass.blue + '"/>' +
          '<polygon points="-50,28 -8,22 -8,44 -50,44" fill="' + glass.yellow + '"/>' +
          '<polygon points="-36,30 -24,26 -20,44 -36,44" fill="' + glass.pink + '"/>' +
          '<path d="M-50 18 L-8 14 M-50 28 L-8 22 M-24 26 L-20 44" stroke="' + line + '" stroke-width="2.6" fill="none"/>' +
        '</g>' +
        '<path d="' + lower + '" fill="none" stroke="' + line + '" stroke-width="3.6" stroke-linejoin="round"/>' +
      '</g>';
    }
    var body = 'M-10 52 C -14 34, -15 14, -13 -2 C -18 -6, -20 -14, -20 -22 L -18 -44 L -6 -33 ' +
               'C -2 -34, 4 -34, 8 -33 L 18 -46 L 20 -22 C 20 -14, 18 -6, 14 -2 C 16 14, 16 34, 12 52 ' +
               'C 9 55, 4 55, 3 51 C 2 45, -2 45, -3 51 C -4 55, -8 55, -10 52 Z';
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')" filter="url(#crayon)" stroke-linecap="round">' +
      '<defs><clipPath id="' + id + 'u"><path d="' + upper + '"/></clipPath>' +
      '<clipPath id="' + id + 'l"><path d="' + lower + '"/></clipPath></defs>' +
      '<g class="cat-wings">' + wing() + '<g transform="scale(-1 1)">' + wing() + '</g></g>' +
      '<path d="' + body + '" fill="#fff" stroke="' + line + '" stroke-width="3.6" stroke-linejoin="round"/>' +
      '<ellipse cx="-8" cy="-21" rx="2" ry="2.8" fill="' + line + '"/>' +
      '<ellipse cx="9" cy="-21" rx="2" ry="2.8" fill="' + line + '"/>' +
      '<path d="M-1 -15 L2 -15 M0.5 -15 C 0.5 -12, -2 -11, -4 -12.5 M0.5 -15 C 0.5 -12, 3 -11, 5 -12.5" fill="none" stroke="' + line + '" stroke-width="1.8"/>' +
      '<path d="M-8 4 L-8 14 C -8 18, -5 18, -5 14 M8 4 L8 14 C 8 18, 5 18, 5 14" fill="none" stroke="' + line + '" stroke-width="2.8"/>' +
    '</g>';
  }

  /* ---- more cute crayon doodles ---- */
  var INK = '#4b3526';
  function wrap(cx, cy, r, inner) {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + (r / 46) + ')" filter="url(#crayon)" stroke-linecap="round" stroke-linejoin="round">' + inner + '</g>';
  }
  function face(x, y, s, cheeks) {
    s = s || 1;
    var out = '<ellipse cx="' + (x - 6 * s) + '" cy="' + y + '" rx="' + 2.2 * s + '" ry="' + 2.8 * s + '" fill="' + INK + '"/>' +
              '<ellipse cx="' + (x + 6 * s) + '" cy="' + y + '" rx="' + 2.2 * s + '" ry="' + 2.8 * s + '" fill="' + INK + '"/>' +
              '<path d="M' + (x - 3 * s) + ' ' + (y + 5 * s) + ' C ' + (x - 1.5 * s) + ' ' + (y + 8 * s) + ', ' + (x + 1.5 * s) + ' ' + (y + 8 * s) + ', ' + (x + 3 * s) + ' ' + (y + 5 * s) + '" fill="none" stroke="' + INK + '" stroke-width="' + 1.8 * s + '"/>';
    if (cheeks) out += '<ellipse cx="' + (x - 11 * s) + '" cy="' + (y + 4 * s) + '" rx="' + 3.5 * s + '" ry="' + 2.2 * s + '" fill="#ff9cc2" opacity=".8"/>' +
                       '<ellipse cx="' + (x + 11 * s) + '" cy="' + (y + 4 * s) + '" rx="' + 3.5 * s + '" ry="' + 2.2 * s + '" fill="#ff9cc2" opacity=".8"/>';
    return out;
  }
  function ladybug(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M-10 -26 C -14 -36, -20 -40, -24 -40 M10 -26 C 14 -36, 20 -40, 24 -40" fill="none" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<ellipse cx="0" cy="-20" rx="16" ry="12" fill="' + INK + '"/>' +
      '<ellipse cx="0" cy="6" rx="30" ry="28" fill="#ff7b93"/>' +
      '<path d="M0 -20 L0 33" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<circle cx="-14" cy="-2" r="5" fill="' + INK + '"/><circle cx="15" cy="0" r="5.5" fill="' + INK + '"/>' +
      '<circle cx="-16" cy="18" r="4" fill="' + INK + '"/><circle cx="14" cy="20" r="4.5" fill="' + INK + '"/>' +
      '<circle cx="-5" cy="-21" r="2" fill="#fff"/><circle cx="5" cy="-21" r="2" fill="#fff"/>');
  }
  function snail(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M-42 26 C -44 14, -36 6, -26 8 L -24 -14 M-30 9 L-34 -12" fill="none" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="-24" cy="-16" r="3" fill="' + INK + '"/><circle cx="-34" cy="-14" r="3" fill="' + INK + '"/>' +
      '<path d="M-44 28 C -40 18, -30 14, -20 20 L 34 22 C 42 24, 42 32, 34 32 L -40 32 C -46 32, -46 30, -44 28Z" fill="#f7e9a0"/>' +
      '<circle cx="8" cy="0" r="24" fill="#f6a8cc"/>' +
      '<path d="M8 0 C 14 0, 14 8, 8 8 C 0 8, -2 -4, 8 -6 C 20 -8, 22 10, 10 14 C -4 18, -10 0, -2 -10 C 6 -18, 24 -14, 28 -2" fill="none" stroke="#e0679c" stroke-width="3.2"/>' +
      '<path d="M-36 22 C -35 25, -32 25, -31 22" fill="none" stroke="' + INK + '" stroke-width="1.8"/>');
  }
  function strawberry(cx, cy, r) {
    var seeds = '';
    [[-14, 4], [0, -2], [14, 4], [-8, 18], [8, 18], [0, 30], [-18, -8], [18, -8]].forEach(function (p) {
      seeds += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.6" ry="2.6" fill="#fff3a6"/>';
    });
    return wrap(cx, cy, r,
      '<path d="M0 40 C -20 34, -34 14, -32 -6 C -30 -22, -14 -26, 0 -22 C 14 -26, 30 -22, 32 -6 C 34 14, 20 34, 0 40Z" fill="#ff6f8e"/>' + seeds +
      '<path d="M0 -20 L-16 -30 L-6 -24 L-8 -36 L0 -26 L8 -36 L6 -24 L16 -30Z" fill="#9ccc4a"/>' +
      '<path d="M0 -28 C 1 -34, 3 -38, 6 -40" fill="none" stroke="#7da834" stroke-width="3"/>' + face(0, 8, .9, true));
  }
  function mushroom(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M-14 4 C -16 20, -16 32, -12 38 L 12 38 C 16 32, 16 20, 14 4Z" fill="#fff4dc"/>' +
      '<path d="M-40 8 C -42 -18, -22 -36, 0 -36 C 22 -36, 42 -18, 40 8 C 20 14, -20 14, -40 8Z" fill="#f78fb4"/>' +
      '<circle cx="-20" cy="-14" r="6" fill="#fff"/><circle cx="4" cy="-24" r="5" fill="#fff"/><circle cx="24" cy="-8" r="6.5" fill="#fff"/><circle cx="-2" cy="-4" r="3.5" fill="#fff"/>' +
      face(0, 22, .75, true));
  }
  function cloud(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M-36 20 C -48 20, -48 2, -36 0 C -38 -16, -18 -22, -10 -12 C -6 -28, 20 -28, 22 -10 C 34 -16, 46 -4, 38 8 C 48 12, 44 24, 34 22 Z" fill="#e7f6fb"/>' +
      '<path d="M-36 20 C -48 20, -48 2, -36 0 C -38 -16, -18 -22, -10 -12 C -6 -28, 20 -28, 22 -10 C 34 -16, 46 -4, 38 8 C 48 12, 44 24, 34 22 Z" fill="none" stroke="#8fd3da" stroke-width="2.6"/>' +
      '<path d="M-12 4 C -10 1, -6 1, -4 4 M4 4 C 6 1, 10 1, 12 4" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M-3 9 C -1 12, 1 12, 3 9" fill="none" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<ellipse cx="-17" cy="10" rx="4" ry="2.4" fill="#ff9cc2" opacity=".8"/><ellipse cx="17" cy="10" rx="4" ry="2.4" fill="#ff9cc2" opacity=".8"/>');
  }
  function tulip(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M0 -4 C -2 14, 2 30, 0 44" fill="none" stroke="#9bbb2a" stroke-width="4"/>' +
      '<path d="M0 34 C -14 30, -22 18, -20 8 C -10 12, -2 22, 0 34Z" fill="#c9dc5a"/>' +
      '<path d="M-18 -30 L-9 -18 L0 -34 L9 -18 L18 -30 C 22 -10, 14 4, 0 4 C -14 4, -22 -10, -18 -30Z" fill="#ff8fbf"/>' +
      '<path d="M0 -34 L-2 -6 M-9 -18 L-6 -4" fill="none" stroke="#e86aa2" stroke-width="2"/>');
  }
  function sun(cx, cy, r) {
    var rays = '';
    for (var i = 0; i < 10; i++) {
      var a = i * 36 * Math.PI / 180;
      rays += '<path d="M' + (Math.cos(a) * 28).toFixed(1) + ' ' + (Math.sin(a) * 28).toFixed(1) + ' L' + (Math.cos(a + .05) * 40).toFixed(1) + ' ' + (Math.sin(a + .05) * 40).toFixed(1) + '" stroke="#f6c94a" stroke-width="4.5"/>';
    }
    return wrap(cx, cy, r, rays + '<circle r="22" fill="#fbe27a"/>' + face(0, -2, .9, true));
  }
  function rainbow(cx, cy, r) {
    var arcs = '', cols = ['#ff8fbf', '#fbe27a', '#c9dc5a', '#8fd3da'];
    cols.forEach(function (c, i) {
      var R = 38 - i * 7;
      arcs += '<path d="M' + (-R) + ' 14 A ' + R + ' ' + R + ' 0 0 1 ' + R + ' 14" fill="none" stroke="' + c + '" stroke-width="7"/>';
    });
    var puff = function (x) {
      return '<path d="M' + (x - 14) + ' 22 C ' + (x - 20) + ' 22, ' + (x - 20) + ' 12, ' + (x - 12) + ' 12 C ' + (x - 10) + ' 4, ' + (x + 4) + ' 4, ' + (x + 6) + ' 10 C ' + (x + 14) + ' 8, ' + (x + 18) + ' 20, ' + (x + 12) + ' 22Z" fill="#fff" stroke="#8fd3da" stroke-width="2.2"/>';
    };
    return wrap(cx, cy, r, arcs + puff(-34) + puff(34));
  }
  function heart(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M0 34 C -24 18, -38 4, -36 -12 C -34 -28, -12 -32, 0 -16 C 12 -32, 34 -28, 36 -12 C 38 4, 24 18, 0 34Z" fill="#ff8fbf"/>' +
      '<path d="M-24 -14 C -22 -20, -16 -22, -12 -20" fill="none" stroke="#fff" stroke-width="3"/>');
  }
  function sparkle(cx, cy, r) {
    return wrap(cx, cy, r,
      '<path d="M0 -40 C 4 -12, 12 -4, 40 0 C 12 4, 4 12, 0 40 C -4 12, -12 4, -40 0 C -12 -4, -4 -12, 0 -40Z" fill="#fbe27a"/>');
  }
  var EXTRA = { ladybug: ladybug, snail: snail, strawberry: strawberry, mushroom: mushroom, cloud: cloud,
                tulip: tulip, sun: sun, rainbow: rainbow, heart: heart, sparkle: sparkle };

  function doodleSVG(kind) {
    var body = EXTRA[kind] ? EXTRA[kind](0, 0, 44)
             : kind === 'cat' ? fairyCat(0, 0, 48)
             : kind === 'bee' ? bee(0, 0, 44)
             : kind === 'butterfly' ? butterfly(0, 0, 44)
             : flower(kind, 0, 0, 42);
    return '<svg viewBox="-50 -50 100 100">' + body + '</svg>';
  }

  document.querySelectorAll('[data-flower]').forEach(function (el) {
    el.innerHTML = doodleSVG(el.dataset.flower);
  });


  // doodles scattered along the page edges (x / y are % of the window; "wide" ones hide on narrower screens)
  var SCATTER = [
    { k: 'sparkle',    x: 5,  y: 16, s: 30, a: 'twinkle' },
    { k: 'strawberry', x: 11, y: 30, s: 58, a: 'sway', wide: true },
    { k: 'cloud',      x: 4,  y: 46, s: 70, a: 'drift' },
    { k: 'ladybug',    x: 12, y: 62, s: 50, a: 'wiggle', wide: true },
    { k: 'heart',      x: 14, y: 82, s: 36, a: 'float', wide: true },
    { k: 'sparkle',    x: 16, y: 8,  s: 22, a: 'twinkle', wide: true },
    { k: 'sun',        x: 93, y: 15, s: 64, a: 'spin' },
    { k: 'mushroom',   x: 87, y: 32, s: 56, a: 'sway', wide: true },
    { k: 'rainbow',    x: 95, y: 48, s: 66, a: 'float' },
    { k: 'snail',      x: 88, y: 66, s: 60, a: 'wiggle', wide: true },
    { k: 'tulip',      x: 96, y: 80, s: 50, a: 'sway' },
    { k: 'sparkle',    x: 84, y: 9,  s: 24, a: 'twinkle', wide: true },
    { k: 'heart',      x: 83, y: 88, s: 28, a: 'float', wide: true },
    { k: 'sparkle',    x: 3,  y: 72, s: 20, a: 'twinkle' }
  ];
  (function () {
    var layer = document.createElement('div');
    layer.className = 'scatter';
    layer.setAttribute('aria-hidden', 'true');
    SCATTER.forEach(function (d, i) {
      var el = document.createElement('span');
      el.className = 'doodle ' + d.a + (d.wide ? ' wide' : '');
      el.style.left = d.x + '%';
      el.style.top = d.y + '%';
      el.style.width = el.style.height = d.s + 'px';
      el.style.animationDelay = (-i * 0.7) + 's';
      el.style.rotate = ((i * 53) % 25 - 12) + 'deg';
      el.innerHTML = doodleSVG(d.k);
      layer.appendChild(el);
    });
    document.body.insertBefore(layer, document.querySelector('main'));
  })();

  // little crayon bouquet in the bottom-left corner
  (function () {
    var b = document.getElementById('bouquet');
    if (!b) return;
    var stem = 'fill="none" stroke="#9bbb2a" stroke-width="3.5" stroke-linecap="round"';
    var leaf = 'fill="#c9dc5a"';
    var s = '<svg viewBox="0 0 150 170"><g filter="url(#crayon)">';
    s += '<path d="M40 178 C 38 140, 32 112, 34 86" ' + stem + '/>';
    s += '<path d="M56 178 C 60 140, 74 118, 86 104" ' + stem + '/>';
    s += '<path d="M48 178 C 48 152, 52 140, 59 132" ' + stem + '/>';
    s += '<path d="M24 178 C 20 152, 12 140, 10 126" ' + stem + '/>';
    s += '<path d="M36 132 C 22 126, 15 114, 17 104 C 28 108, 34 118, 36 132Z" ' + leaf + '/>';
    s += '<path d="M67 142 C 81 138, 89 128, 89 118 C 78 120, 70 130, 67 142Z" ' + leaf + '/>';
    s += '<path d="M22 152 C 11 150, 5 141, 5 134 C 14 136, 20 143, 22 152Z" ' + leaf + '/>';
    s += '</g>';
    s += flower('pink', 34, 60, 24);
    s += flower('blue', 92, 86, 18);
    s += flower('yellow', 60, 118, 14, 5);
    s += flower('green', 10, 114, 12, 5);
    s += butterfly(118, 40, 14);
    s += '</svg>';
    b.innerHTML = s;
  })();

  /* ---------------- page switching ---------------- */
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-page]'));
  var pageIds = pages.map(function (p) { return p.id; });

  function openPage(id, push) {
    if (pageIds.indexOf(id) === -1) id = 'about';
    pages.forEach(function (p) { p.classList.toggle('active', p.id === id); });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var on = a.dataset.page === id;
      a.classList.toggle('current', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    if (push) history.pushState(null, '', '#' + id);
    if (id === 'about') typeName();
    if (id === 'interests') requestAnimationFrame(layoutMind);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openPage(link.dataset.page, true);
    });
  });
  window.addEventListener('popstate', function () { openPage(location.hash.slice(1), false); });

  /* ---------------- typed name ---------------- */
  var typed = document.querySelector('.typed');
  var typeTimer = null;
  // each letter gets its own small tilt / bounce so the name looks hand-lettered
  // [tilt deg, lift px, size, nudge px, skew deg] per letter: J e s s i _ S i d h u
  var JITTER = [[-7, -3, 1.08, 0, -4], [5, 2, .92, -2, 3], [-4, 3, 1.02, -1, -2], [8, 0, .95, -3, 4], [-3, -2, 1.06, 1, -3], [0, 0, 1, 0, 0], [-6, -4, 1.12, 0, -5], [4, 2, .9, -2, 2], [-3, -1, 1.04, -1, -3], [6, 3, .96, -2, 4], [-5, 0, 1.03, -1, -2]];
  function letter(ch, i) {
    var span = document.createElement('span');
    span.className = 'ltr';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    var j = JITTER[i % JITTER.length];
    span.style.setProperty('--r', j[0] + 'deg');
    span.style.setProperty('--y', j[1] + 'px');
    span.style.setProperty('--s', j[2]);
    span.style.setProperty('--k', j[4] + 'deg');
    span.style.marginLeft = j[3] + 'px';
    return span;
  }
  // build the name; hidden letters wait for the cat to reveal them
  function buildName(hidden) {
    var full = typed.dataset.text, out = [];
    typed.textContent = '';
    typed.setAttribute('aria-label', full);
    for (var n = 0; n < full.length; n++) {
      var l = letter(full[n], n);
      if (hidden) l.classList.add('hidden');
      typed.appendChild(l);
      out.push(l);
    }
    return out;
  }

  /* ---------------- fairy cat intro: loop-de-loop, then reveal the name ---------------- */
  var introDone = false;
  function typeName() {
    if (introDone || reduceMotion.matches) { introDone = true; buildName(false); return; }
    introDone = true;
    buildName(true);
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function () { requestAnimationFrame(catIntro); });
  }

  function cubic(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    ];
  }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function sparkleAt(x, y, size) {
    var el = document.createElement('span');
    el.className = 'trail';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--sz', size + 'px');
    var c = ['#fbe27a', '#f191b9', '#8fd3da', '#cddc5c'][Math.floor(Math.random() * 4)];
    el.innerHTML = '<svg viewBox="-10 -10 20 20"><path d="M0 -10 C 1 -3, 3 -1, 10 0 C 3 1, 1 3, 0 10 C -1 3, -3 1, -10 0 C -3 -1, -1 -3, 0 -10Z" fill="' + c + '"/></svg>';
    document.body.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  function catIntro() {
    var letters = Array.prototype.slice.call(typed.querySelectorAll('.ltr'));
    var perch = document.querySelector('.hero .f7');
    if (!letters.length || !perch || !document.getElementById('about').classList.contains('active')) {
      letters.forEach(function (l) { l.classList.remove('hidden'); });
      return;
    }
    var size = perch.offsetWidth;
    perch.style.visibility = 'hidden';
    perch.style.animation = 'none';        // measure her resting spot without the float offset
    var fly = document.createElement('span');
    fly.className = 'flycat';
    fly.style.width = fly.style.height = size + 'px';
    fly.innerHTML = doodleSVG('cat');
    document.body.appendChild(fly);

    var rects = letters.map(function (l) { return l.getBoundingClientRect(); });
    var first = rects[0], last = rects[rects.length - 1];
    var pr = perch.getBoundingClientRect();
    var mid = (first.top + first.bottom) / 2;
    var R = Math.min(60, innerWidth * 0.12);
    var C = [Math.max(first.left - 10, R + size / 2), mid - size * 0.55 - R * 0.4];
    var P0 = [-size, mid - 160];
    var E = [C[0], C[1] + R];
    var sweepY = first.top - size * 0.15;
    var S = [Math.min(last.right + size * 0.4, innerWidth - size / 2), sweepY];
    var H = [pr.left + pr.width / 2, pr.top + pr.height / 2];
    function perchCentre() { var q = perch.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }

    var DUR = 2700, start = null, prev = null, lastSpark = 0, shown = 0;
    function reveal(i) {
      var l = letters[i];
      l.classList.remove('hidden');
      l.classList.add('magic');
      var r = rects[i];
      for (var k = 0; k < 3; k++) sparkleAt(r.left + Math.random() * r.width, r.top + Math.random() * r.height, 10 + Math.random() * 10);
    }

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / DUR, 1), p, spin = null;
      if (t < .22) {                       // swoop in
        var a = ease(t / .22);
        p = cubic(P0, [P0[0] + (E[0] - P0[0]) * .5, P0[1] - 60], [E[0] - 90, E[1] + 30], E, a);
      } else if (t < .5) {                 // loop-de-loop
        var s2 = (t - .22) / .28, th = (90 - 360 * s2) * Math.PI / 180;
        p = [C[0] + R * Math.cos(th), C[1] + R * Math.sin(th)];
        spin = -360 * s2;
      } else if (t < .85) {                // glide across the name
        var c3 = (t - .5) / .35;
        p = cubic(E, [E[0] + 90, E[1] + 10], [last.right - 60, sweepY + 14], S, c3);
      } else {                             // up to her perch
        H = perchCentre();
        var d = 1 - Math.pow(1 - (t - .85) / .15, 3);   // ease out: slows down as she arrives
        p = cubic(S, [S[0] + 50, S[1] - 30], [H[0], H[1] + 90], H, d);
      }
      var tilt = 0;
      if (spin !== null) tilt = spin;
      else if (prev) tilt = Math.max(-25, Math.min(25, Math.atan2(p[1] - prev[1], p[0] - prev[0]) * 180 / Math.PI));
      if (t >= .85) { var f = (t - .85) / .15; tilt = tilt * (1 - f) + (-3) * f; }
      fly.style.transform = 'translate(' + (p[0] - size / 2) + 'px,' + (p[1] - size / 2) + 'px) rotate(' + tilt + 'deg)';

      if (now - lastSpark > 45) { sparkleAt(p[0] - 10 + Math.random() * 20, p[1] + size * 0.25, 8 + Math.random() * 10); lastSpark = now; }
      if (t >= .5) while (shown < letters.length && rects[shown].left + rects[shown].width / 2 < p[0]) reveal(shown++);
      prev = p;

      if (t < 1) requestAnimationFrame(frame);
      else {
        while (shown < letters.length) reveal(shown++);
        fly.classList.add('landing');
        requestAnimationFrame(settle);
      }
    }

    // a soft little bob as she lands, then hand off to the resting float from the same pose
    var s0 = null, SETTLE = 750;
    function settle(now) {
      if (s0 === null) s0 = now;
      H = perchCentre();
      var s = Math.min((now - s0) / SETTLE, 1);
      var bob = -10 * Math.sin(Math.PI * s) * (1 - s * .4);
      var rot = -3 + 5 * Math.sin(2 * Math.PI * s) * (1 - s);
      fly.style.transform = 'translate(' + (H[0] - size / 2) + 'px,' + (H[1] - size / 2 + bob) + 'px) rotate(' + rot + 'deg)';
      if (s < 1) requestAnimationFrame(settle);
      else {
        perch.style.animation = '';
        perch.style.visibility = '';
        fly.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- font toggle ---------------- */
  var toggle = document.getElementById('fontToggle');
  function syncToggle() {
    var hand = root.dataset.font !== 'mono';
    toggle.setAttribute('aria-pressed', String(hand));
    toggle.querySelector('b').textContent = hand ? 'on' : 'off';
  }
  toggle.addEventListener('click', function () {
    if (root.dataset.font === 'mono') delete root.dataset.font; else root.dataset.font = 'mono';
    try { localStorage.setItem('js-font', root.dataset.font === 'mono' ? 'mono' : 'hand'); } catch (e) {}
    syncToggle();
    if (document.getElementById('interests').classList.contains('active')) requestAnimationFrame(layoutMind);
  });
  syncToggle();

  /* ---------------- interests mind map ---------------- */
  // x / y are percentages of the map box. Edit freely: add a name, give it a position and links.
  var interests = {
    // AI + ML corner
    'AI agents':             { x: 30, y: 17, big: true, links: ['machine learning', 'computer vision', 'hardware & circuits'] },
    'machine learning':      { x: 52, y: 9, links: ['statistics', 'credit risk'] },
    'computer vision':       { x: 11, y: 8, links: [] },
    'credit risk':           { x: 74, y: 6,  links: [] },
    'statistics':            { x: 50, y: 27, links: ['data viz', 'data engineering'] },
    'hardware & circuits':   { x: 12, y: 30, links: ['teaching kids to code'] },
    // data + systems corner
    'data engineering':      { x: 74, y: 23, big: true, links: ['databases', 'software architecture'] },
    'databases':             { x: 91, y: 14, links: ['rust'] },
    'rust':                  { x: 91, y: 37, links: ['dev tools'] },
    'software architecture': { x: 66, y: 41, links: ['dev tools'] },
    'dev tools':             { x: 80, y: 55, big: true, links: ['open source'] },
    'open source':           { x: 90, y: 70, links: [] },
    'data viz':              { x: 36, y: 39, links: ['network graphs', 'design'] },
    'network graphs':        { x: 48, y: 53, links: [] },
    // community corner
    'community':             { x: 22, y: 59, big: true, links: ['women in tech', 'teaching kids to code', 'marketing'] },
    'teaching kids to code': { x: 14, y: 45, links: [] },
    'women in tech':         { x: 9,  y: 72, links: [] },
    'marketing':             { x: 38, y: 70, links: ['design'] },
    'design':                { x: 60, y: 67, links: ['knitting'] },
    // hobbies
    'hobbies':               { x: 58, y: 86, big: true, links: ['hiking', 'knitting', 'soccer'] },
    'hiking':                { x: 38, y: 95, links: [] },
    'knitting':              { x: 76, y: 95, links: [] },
    'soccer':                { x: 90, y: 84, links: [] }
  };

  var mind = document.getElementById('mind');
  var svg = mind.querySelector('svg');
  var NS = 'http://www.w3.org/2000/svg';
  var nodeEls = {};
  var edges = [];
  var neighbours = {};

  Object.keys(interests).forEach(function (name) {
    neighbours[name] = neighbours[name] || [];
    interests[name].links.forEach(function (other) {
      if (!interests[other]) return;
      edges.push([name, other]);
      neighbours[name].push(other);
      (neighbours[other] = neighbours[other] || []).push(name);
    });
  });

  Object.keys(interests).forEach(function (name, i) {
    var el = document.createElement('span');
    el.className = 'node c-' + COLORS[i % COLORS.length] + (interests[name].big ? ' big' : '');
    el.textContent = name;
    el.tabIndex = 0;
    el.style.left = interests[name].x + '%';
    el.style.top = interests[name].y + '%';
    el.style.rotate = ((i * 37) % 7 - 3) * 0.6 + 'deg';
    el.addEventListener('mouseenter', function () { focus(name); });
    el.addEventListener('focus', function () { focus(name); });
    el.addEventListener('mouseleave', clearFocus);
    el.addEventListener('blur', clearFocus);
    mind.appendChild(el);
    nodeEls[name] = el;
  });

  edges.forEach(function (e) {
    var line = document.createElementNS(NS, 'line');
    line.dataset.a = e[0];
    line.dataset.b = e[1];
    svg.appendChild(line);
  });

  // positions come from the % values, but each bubble is nudged so it never pokes outside the box
  function layoutMind() {
    var box = mind.getBoundingClientRect();
    if (!box.width) return;
    var pos = {};
    Object.keys(interests).forEach(function (name) {
      var el = nodeEls[name], half = el.offsetWidth / 2 + 4;
      var x = Math.min(Math.max(interests[name].x / 100 * box.width, half), box.width - half);
      var y = interests[name].y / 100 * box.height;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      pos[name] = [x, y];
    });
    svg.querySelectorAll('line').forEach(function (line) {
      var a = pos[line.dataset.a], b = pos[line.dataset.b];
      line.setAttribute('x1', a[0]); line.setAttribute('y1', a[1]);
      line.setAttribute('x2', b[0]); line.setAttribute('y2', b[1]);
    });
  }

  function focus(name) {
    mind.classList.add('focusing');
    nodeEls[name].classList.add('on');
    neighbours[name].forEach(function (n) { nodeEls[n].classList.add('near'); });
    svg.querySelectorAll('line').forEach(function (line) {
      line.classList.toggle('lit', line.dataset.a === name || line.dataset.b === name);
    });
  }
  function clearFocus() {
    mind.classList.remove('focusing');
    Object.keys(nodeEls).forEach(function (n) { nodeEls[n].classList.remove('on', 'near'); });
    svg.querySelectorAll('line.lit').forEach(function (l) { l.classList.remove('lit'); });
  }

  // gentle floating drift
  var t0 = performance.now();
  function drift(now) {
    if (!reduceMotion.matches && document.getElementById('interests').classList.contains('active')) {
      var t = (now - t0) / 1000;
      Object.keys(nodeEls).forEach(function (name, i) {
        var dx = Math.sin(t * 0.6 + i) * 3;
        var dy = Math.cos(t * 0.5 + i * 1.7) * 3;
        nodeEls[name].style.translate = dx + 'px ' + dy + 'px';
      });
    }
    requestAnimationFrame(drift);
  }
  requestAnimationFrame(drift);
  window.addEventListener('resize', layoutMind);

  /* ---------------- pen ink trail + grid spotlight ---------------- */
  var canvas = document.getElementById('ink');
  var ctx = canvas.getContext('2d');
  var pts = [];
  var LIFE = 450;
  var TRAIL = ['241,145,185', '143,211,218', '205,220,92', '163,187,42']; // amaranth, azure, citron, moss
  var trailCount = 0;

  function resize() {
    var s = window.devicePixelRatio || 1;
    canvas.width = innerWidth * s;
    canvas.height = innerHeight * s;
    ctx.setTransform(s, 0, 0, s, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('pointermove', function (e) {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
    if (e.pointerType === 'mouse' && !reduceMotion.matches) {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now(), c: Math.floor(trailCount++ / 5) % TRAIL.length });
    }
  });
  document.documentElement.addEventListener('mouseleave', function () {
    root.style.setProperty('--mx', '-999px');
    pts = [];
  });

  function draw(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pts = pts.filter(function (p) { return now - p.t < LIFE; });
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var life = 1 - (now - b.t) / LIFE;
      ctx.strokeStyle = 'rgba(' + TRAIL[b.c] + ',' + (life * 0.8).toFixed(3) + ')';
      ctx.lineWidth = 1 + life * 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  /* ---------------- boot ---------------- */
  openPage(location.hash.slice(1), false);
})();
