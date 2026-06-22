#!/usr/bin/env python3
import json, csv, glob, re, os

T = '/tmp/tapestry'

# ---- load enrichment maps ----
film_years = {}
for f in sorted(glob.glob(f'{T}/film_years_*.json')):
    film_years.update(json.load(open(f)))

author_country = {}
for f in sorted(glob.glob(f'{T}/author_country_*.json')):
    author_country.update(json.load(open(f)))

films_raw = json.load(open(f'{T}/films_raw.json'))
books_raw = json.load(open(f'{T}/books_raw.json'))

print('film_years entries:', len(film_years))
print('author_country entries:', len(author_country))
print('films_raw:', len(films_raw), 'books_raw:', len(books_raw))

# ---- country -> region (5 bands matching data.js REGIONS) ----
REGION = {
    # Americas
    'USA':'americas','United States':'americas','Mexico':'americas','Canada':'americas',
    'Chile':'americas','Brazil':'americas','Argentina':'americas','Colombia':'americas',
    'Peru':'americas','Cuba':'americas',
    # Europe & Middle East
    'UK':'europe-middle-east','United Kingdom':'europe-middle-east','England':'europe-middle-east',
    'Ireland':'europe-middle-east','France':'europe-middle-east','Italy':'europe-middle-east',
    'Germany':'europe-middle-east','Belgium':'europe-middle-east','Denmark':'europe-middle-east',
    'Norway':'europe-middle-east','Sweden':'europe-middle-east','Spain':'europe-middle-east',
    'Poland':'europe-middle-east','Russia':'europe-middle-east','Greece':'europe-middle-east',
    'Netherlands':'europe-middle-east','Austria':'europe-middle-east','Switzerland':'europe-middle-east',
    'Portugal':'europe-middle-east','Hungary':'europe-middle-east','Czech Republic':'europe-middle-east',
    'Romania':'europe-middle-east','Israel':'europe-middle-east','Iran':'europe-middle-east',
    'Turkey':'europe-middle-east','Egypt':'europe-middle-east','Iraq':'europe-middle-east',
    'Lebanon':'europe-middle-east','Finland':'europe-middle-east','Scotland':'europe-middle-east',
    # Asia
    'Japan':'asia','Korea':'asia','South Korea':'asia','Taiwan':'asia','China':'asia',
    'India':'asia','Hong Kong':'asia','Singapore':'asia','Thailand':'asia','Vietnam':'asia',
    'Indonesia':'asia','Philippines':'asia','Pakistan':'asia','Malaysia':'asia',
    # Sub-Saharan Africa
    'Kenya':'subsaharan-africa','Ivory Coast':'subsaharan-africa','Senegal':'subsaharan-africa',
    'Nigeria':'subsaharan-africa','South Africa':'subsaharan-africa','Ghana':'subsaharan-africa',
    'Ethiopia':'subsaharan-africa','Mali':'subsaharan-africa','Tanzania':'subsaharan-africa',
    'Zambia':'subsaharan-africa','Zimbabwe':'subsaharan-africa','Uganda':'subsaharan-africa',
    'Somalia':'subsaharan-africa','Sudan':'subsaharan-africa','Cameroon':'subsaharan-africa',
    'Congo':'subsaharan-africa','Angola':'subsaharan-africa','Rwanda':'subsaharan-africa',
    # Pacific
    'New Zealand':'pacific','Australia':'pacific',
}

def region_of(country):
    if not country: return None
    return REGION.get(country.strip())

# ---- consumed-year mapping for film "Year seen" buckets ----
COLLEGE = {'College 1':2014,'College 2':2015,'College 3':2016,'College 4':2017}
def film_consumed_year(ys):
    ys = (ys or '').strip()
    if ys in COLLEGE: return COLLEGE[ys]
    if re.fullmatch(r'\d{4}', ys): return int(ys)
    return None

def book_consumed_year(date_read):
    m = re.match(r'(\d{4})', (date_read or '').strip())
    return int(m.group(1)) if m else None

def to_int_year(s):
    s=(s or '').strip()
    if re.fullmatch(r'-?\d+', s): return int(s)
    return None

items = []
unresolved = {'film_year':[], 'film_region':[], 'book_region':[], 'book_year':[]}

# ---- FILMS ----
for f in films_raw:
    title = f['title']; country = f['country']
    fy = film_years.get(title, {})
    oyear = fy.get('year')
    conf = fy.get('confidence','low')
    region = region_of(country)
    if oyear is None: unresolved['film_year'].append(title)
    if region is None: unresolved['film_region'].append((title,country))
    items.append({
        'id': 'film-'+re.sub(r'[^a-z0-9]+','-',title.lower()).strip('-')[:50],
        'title': title,
        'medium': 'film',
        'creator': None,
        'originCountry': country,
        'originRegion': region,
        'originYear': oyear,
        'consumedYear': film_consumed_year(f.get('yearSeen')),
        'rating': None,
        'note': None,
        'source': 'movies-by-country',
        'confidence': conf,
        'needsReview': oyear is None or region is None or conf=='low',
    })

# ---- BOOKS ----
for b in books_raw:
    author = b['author']
    ac = author_country.get(author, {})
    country = ac.get('country')
    conf = ac.get('confidence','low')
    region = region_of(country)
    oyear = to_int_year(b.get('pubYear'))
    if oyear is None: unresolved['book_year'].append(b['title'])
    if region is None: unresolved['book_region'].append((author,country))
    rating = b.get('rating')
    items.append({
        'id': 'book-'+re.sub(r'[^a-z0-9]+','-',b['title'].lower()).strip('-')[:50],
        'title': b['title'],
        'medium': 'book',
        'creator': author,
        'originCountry': country,
        'originRegion': region,
        'originYear': oyear,
        'consumedYear': book_consumed_year(b.get('dateRead')),
        'rating': int(rating) if (rating or '').isdigit() and rating!='0' else None,
        'note': b.get('review') or None,
        'source': 'goodreads',
        'confidence': conf,
        'needsReview': oyear is None or region is None or conf=='low',
    })

out = {
    'generated': 'build.py',
    'regions': ['subsaharan-africa','europe-middle-east','asia','americas','pacific'],
    'mediums': ['book','film','music','painting','architecture','food'],
    'items': items,
}
os.makedirs(os.path.dirname('/Users/lukeeure/Applications/world-history-timeline/art-data.json'), exist_ok=True)
json.dump(out, open('/Users/lukeeure/Applications/world-history-timeline/art-data.json','w'), indent=1, ensure_ascii=False)

print('\n=== SUMMARY ===')
print('total items:', len(items))
print('  films:', sum(1 for i in items if i['medium']=='film'))
print('  books:', sum(1 for i in items if i['medium']=='book'))
print('films missing year:', len(unresolved['film_year']), unresolved['film_year'][:10])
print('films missing region:', len(unresolved['film_region']), unresolved['film_region'][:10])
print('books missing year:', len(unresolved['book_year']))
print('books missing region:', len(unresolved['book_region']), unresolved['book_region'][:10])
print('needsReview count:', sum(1 for i in items if i['needsReview']))
print('\nwrote art-data.json')
