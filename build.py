"""Χτίζει τις διανεμόμενες εκδόσεις στο dist/:
   • Ktinotrofos_TN.zip               — όλα τα αρχεία (για tiiny.host / τοπικά)
   • Ktinotrofos_TN_standalone.html  — ένα αρχείο με ενσωματωμένα Leaflet, εικονίδια, animals.js, tools.js
   Χρήση: python build.py"""
import base64, os, zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
rd = lambda f: open(f, encoding='utf-8').read()
b64 = lambda f: 'data:image/png;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
os.makedirs('dist', exist_ok=True)

# ---- ZIP ----
files = ['index.html', 'animals.js', 'tools.js', 'videos.js', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png',
         'leaflet.min.js', 'leaflet.min.css', 'README.md'] + ['images/' + f for f in os.listdir('images')]
with zipfile.ZipFile('dist/Ktinotrofos_TN.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files:
        z.write(f, f)

# ---- Standalone ----
s = rd('index.html')
css = rd('leaflet.min.css')
for f in os.listdir('images'):
    css = css.replace('images/' + f, b64('images/' + f))
fix = ("\n;(function(){if(window.L){delete L.Icon.Default.prototype._getIconUrl;"
       "L.Icon.Default.mergeOptions({iconUrl:'%s',iconRetinaUrl:'%s',shadowUrl:'%s'});}})();\n"
       % (b64('images/marker-icon.png'), b64('images/marker-icon-2x.png'), b64('images/marker-shadow.png')))
inline = lambda f: '<script>\n' + rd(f).replace('</script', '<\\/script') + '\n</script>'
ico = b64('icon-192.png')

def rep(a, b):
    global s
    assert a in s, 'δεν βρέθηκε: ' + a[:60]
    s = s.replace(a, b, 1)

rep('<link rel="manifest" href="manifest.json">\n', '')
rep('<link rel="apple-touch-icon" href="icon-192.png">', '<link rel="apple-touch-icon" href="%s">' % ico)
rep('<link rel="icon" href="icon-192.png">', '<link rel="icon" href="%s">' % ico)
rep('<link rel="stylesheet" href="leaflet.min.css">', '<style>\n' + css + '\n</style>')
rep('<script src="leaflet.min.js"></script>', '<script>\n' + rd('leaflet.min.js').replace('</script', '<\\/script') + fix + '</script>')
rep('<script src="animals.js"></script>', inline('animals.js'))
rep('<script src="tools.js"></script>', inline('tools.js'))
rep('<script src="videos.js"></script>', inline('videos.js'))
rep("if('serviceWorker' in navigator && location.protocol.startsWith('http')){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }",
    "/* standalone: χωρίς service worker */")
rep("offline PWA · '", "standalone · '")
open('dist/Ktinotrofos_TN_standalone.html', 'w', encoding='utf-8').write(s)

for f in ('dist/Ktinotrofos_TN.zip', 'dist/Ktinotrofos_TN_standalone.html'):
    print(f, os.path.getsize(f) // 1024, 'KB')
