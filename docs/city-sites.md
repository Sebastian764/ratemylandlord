# City sites proof of concept

This branch starts from `ui-changes`, the hosted Pittsburgh design. `main` keeps
the regular UI. `/` opens Pittsburgh directly, and `/pittsburgh` reuses the hosted
homepage and shared review pages with fictional data. Ann Arbor, College Park,
Madison, and Austin demonstrate independent brands and homepages.

## Run the preview

Use Node 22+ and npm from the checkout:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. No environment file or Supabase project is needed.
Windows npm works; WSL npm also works when your checkout is accessible within WSL.
Avoid sharing `node_modules` between Windows and Linux; run `npm ci` after switching.

This branch always injects `CityDemoApiService` and `MockAuthService`, even when
production environment variables exist. Account registration, login, email,
verification uploads, and moderation are unavailable. Guest reviews are stored
only in the current city service instance and reset on refresh or city changes.
The original Supabase services and `init.sql` are untouched.

## Add a town in one PR

1. Create a contributor branch from this prototype (or the branch it is merged into).
2. Copy `cities/_template` to `cities/your-town` (use your actual URL slug).
3. Edit `city.ts`: use the same lowercase, hyphenated slug as the folder name;
   set name, state, campuses, brand, description, and colors. Update both the
   metadata and `makeDemoData` arguments. Pick a seed not already used by another
   town. Seeds 1–5 are used by the initial cities; 6 is the first available seed.
4. Edit `Home.tsx` and `styles.css`. Change the CSS selector to your exact slug.
   Use CSS Modules or prefix all selectors with `.city-site[data-city="your-town"]`
   so your styles do not affect other towns. Keep the data clearly fictional.
5. Run `npm run typecheck`, `npm run test:run`, and `npm run build`.
6. Check your homepage and a direct URL such as `/your-town/landlord/900`, the
   review form, city switching, and a narrow mobile screen. Include screenshots
   and your proposed local maintainer in the PR description.
7. Open the PR for Sebastian to review and merge.

`cities/registry.ts` discovers `cities/*/city.ts` with Vite's import glob. The
template is excluded. Your folder automatically adds the header city link, city tab,
and routes; no central registration edit is necessary. The registry rejects
mismatched folder/slugs and reviews that reference the wrong city or landlord.
The tests catch duplicate review fixture IDs across cities.

The existing Cloudflare SPA fallback (`public/_redirects`) serves direct city
and nested review URLs. A build still outputs `dist`. This task does not publish
or change the production branch. A future rollout must explicitly choose the
deployment branch; merely approving a PR in this prototype does not alter the
currently hosted `ui-changes` site.

## Customize more than colors

`Home` is an ordinary React component, so replace it with any local design.
`CityHome` is a starting point, not a required layout. Keep new components,
images, and CSS inside your town folder. Shared data hooks remain available.

For deeper changes, import local components into `city.ts`:

```tsx
import Home from './Home';
import Layout from './Layout';
import LocalLandlordPage from './LandlordPage';
import Resources from './Resources';

// In the CityDefinition object:
Home,
Layout,
pages: { landlord: LocalLandlordPage, resources: Resources },
```

`Layout` replaces the entire shared shell and receives routed pages as `children`.
Render those children, include the shared `CityNavigation` in your header, and keep an
obvious fictional-data notice in this prototype. `pages` can override landlord,
addReview, editReview, addLandlord, login, register, contact, terms, admin,
resources, resetPassword, verifyEmail, and notFound independently. Unspecified
pages continue using the shared implementation. Overrides run inside the same
city, service, auth, and data providers.

Use `Link`, `useNavigate`, and other router exports from `../routing` for pages
directly in your town folder (or the corresponding relative path). A link to
`/landlord/900` then resolves within the active town. For cross-city navigation,
use React Router directly with the complete path, e.g. `/ann-arbor/landlord/900`.
Use `useCity` from `../context` for city metadata and `useData` from
`../../context/DataContext` for local landlords and reviews.

## Review-level location model

The prototype-only `CityReview` type extends the existing `Review` with
`city_slug`. This field is held in fixtures/in memory, never sent to Supabase.
Each city contains three local landlord projections and six reviews. Lantern
Housing Group has the same landlord ID, **900**, in every town. Its name/identity
is shared; its displayed addresses and reviews are local.

Compare `/pittsburgh/landlord/900` (3.5) with `/ann-arbor/landlord/900` (4.5).
The header city links always open each city’s homepage.
`CityDemoApiService` receives all review fixtures, then filters by both landlord
ID and review city. Review detail lookups and mutations check city too. All
rating breakdowns, counts, rent averages, and would-rent-again percentages use
that filtered set. The React provider tree is keyed by city slug, so navigation
and browser history cannot reuse another city's review cache.

This is frontend separation, not a production authorization boundary. Before
connecting real data, plan a city table and review foreign key, backfill existing
reviews to Pittsburgh, represent landlords operating in multiple cities, enforce
city filtering and moderator permissions server-side/RLS, and make auth callbacks,
student domains, legal text, contacts, and resource links city-specific. That
production work is deliberately outside this proof of concept.

## Ownership and approval

`.github/CODEOWNERS` requests Sebastian's review for all changes, and the PR
template prompts contributors for their town, maintainer, screenshots, and checks.
Enforcing approval requires a GitHub branch rule with required code-owner review
and required checks. Those repository settings have not been changed. Town teams
can propose independent UI changes through their folders; trusted code review
still matters because all town modules share one JavaScript application.

The CI workflow runs TypeScript, the existing user-flow suite plus city-boundary
tests, and a production build. No deployments or database operations are added.

## Homepage and city navigation

The network root `/` redirects to `/pittsburgh`, so visitors immediately see the
original Pittsburgh search and landlord-card experience. Its dark hero and amber
accents are retained with tighter spacing. Landlord cards load local rating
averages, review counts, and a recent review excerpt through the active city API.

The shared sticky header includes a clearly labeled “City sites” row. All city
names are visible, the current site is highlighted, and links wrap on mobile
instead of hiding destinations in a scrolling strip or menu. Each link opens
that city's homepage; search, profiles, and review forms stay within that city.
There is no geographic auto-detection, remembered redirect, or mandatory city
selection step. The former network directory has been removed.

City teams retain independent Home, Layout, and page overrides. Custom layouts
can import `CityNavigation` from `../CityNavigation` to retain network discovery.
The shared navigation does not impose a page design on their local site.
