# Learn Try Earn: WordPress block theme

A full-site-editing (block) theme for Learn Try Earn, converted from the original static site.
Everything on the pages is built from **core Gutenberg blocks** (Group, Heading, Paragraph, List, Quote, Buttons,
Navigation, Social Links, plus Custom HTML for purely decorative charts and the contact form), and the same stylesheet
loads in the block editor, so what you see while editing is what visitors see.

## Install

1. Zip the contents of this repository (the folder that contains `style.css`) and upload it in **Appearance > Themes > Add New > Upload Theme**, or clone the repo into `wp-content/themes/lte-theme`.
2. Activate it. On activation the theme creates **Home, About, Get started and Contact** pages from the bundled patterns, sets Home as the front page and, if permalinks were still "Plain", switches them to `/%postname%/`.
3. Open **Pages** and edit any page with the normal block editor. Header, footer and the mobile quick-action bar are template parts under **Appearance > Editor > Patterns > Template parts**.

Requires WordPress 6.5+ and PHP 7.4+.

## What to edit first

| Placeholder | Where |
| --- | --- |
| Broker referral link (`https://YOUR-BROKER-LINK.com`) | Home (step 3 button), Get started (hero button), footer |
| `[Broker name]`, `[Regulator]`, `[x]`, `[amount]`, `[Platform]`, `[Free / £x]` | Home, "How to start" cards |
| Photo of Luke | Replace the "L" portrait group on Home and About with an Image block |
| Member reviews | Home, "What members say" (placeholders, use real reviews with permission) |
| Contact form recipient | Contact page > the form's Custom HTML block (`action="https://formsubmit.co/your-email"`) |
| Legal links (Privacy, Terms, Cookies, Risk disclosure) | Footer template part |

## Structure

```
style.css            theme header
theme.json           colours, fonts (self-hosted Geist, Geist Mono, Instrument Serif), button defaults
functions.php        assets, splash/orbs, page creation on activation
templates/           page, single, index, 404
parts/               header, footer, mobile-bar
patterns/            home, about, get-started, contact, final-cta, risk-warning
assets/css/theme.css the site styles (front end + editor)
assets/css/editor.css editor-only tweaks
assets/js/lte.js     reveals, tilt, scroll effects, risk slider, contact form
```

## Notes

* Animated charts (hero bars, candle sparklines, trade-plan diagram, gauge, footer marquee) are inline SVG in Custom HTML blocks, so they preview in the editor but are edited as code.
* Scroll effects, reveals and the splash only run on the front end; the editor always shows the finished state.
* Motion is on for every visitor, as in the original design.
