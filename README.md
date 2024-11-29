# Cal Issues

This is a standard NextJs app that displays a random open [Cal.com](https://cal.com) issue when opened.
It is inspired by the founder of Cal, who posted [this tweet](https://x.com/peer_rich/status/1862609684768649570).

Just run `npm install` and `npm run dev` to start it.

## Tech Stack

The web-app has 2 API routes. One is to [read the daily issue](https://cal-issues.beachcode.de/api), and the other is a [Cron Job](https://vercel.com/docs/cron-jobs) endpoint.
The job is called once per day and stores a random issue from the [Github API](https://api.github.com/search/issues?q=is:issue%20repo:calcom/cal.com%20state:open) via an [Vercel Edge Storage](https://vercel.com/docs/storage).
