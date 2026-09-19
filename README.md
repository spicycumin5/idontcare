# I Don't Care

A group can't decide where to eat? Pass one phone around: pick a location, cross off restaurants nobody wants from a combined Google Places + Yelp list, then let the app randomly settle it.

## Setup

```bash
npm install
```

Add your API keys to `.env.local` (copy `.env.example`):

```
GOOGLE_PLACES_API_KEY=your_key_here
YELP_API_KEY=your_key_here
```

- **Google**: [Cloud Console](https://console.cloud.google.com/) → enable "Places API (New)" → enable billing (free monthly credit covers normal use) → create an API key.
- **Yelp**: [Yelp Fusion developer portal](https://www.yelp.com/developers) → create an app → copy the free-tier key.

Without keys the app still runs, but restaurant search will show an error.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The layout is mobile-first — resize your browser down or open it on a phone to see it as intended.

## Notes

- No accounts, no database — everything lives in one browser session for the phone being passed around.
- Beli has no public API, so its link is a search deep link, not live data.
- Duplicate restaurants across Google and Yelp are merged with a name+distance heuristic (`lib/dedupe.ts`) — not perfect, good enough for a group decision.
