# Proxima Donation Forms

Branded donation form for [Proxima Partners](https://www.liveproxima.org), embedding the Virtuous giving form inside a custom Proxima-branded wrapper.

## Live URLs

- **Preview:** [j4c-software.github.io/Proxima-donation-forms/forms/give-webpage/](https://j4c-software.github.io/Proxima-donation-forms/forms/give-webpage/)
- **Production:** [www.liveproxima.org/give](https://www.liveproxima.org/give)

## How It Works

Each form is a self-contained HTML file under `forms/` that wraps the Virtuous embed script in Proxima's branding. Forms are hosted on GitHub Pages and embedded into the Wix site via an HTML iFrame widget.

Any design changes are made here in the repo — the Wix embed never needs to be touched.

## Wix Embed Code

Paste the following into the Wix HTML Embed widget. The script resizes the widget dynamically so the form never scrolls or gets clipped.

```html
<iframe
  src="https://j4c-software.github.io/Proxima-donation-forms/forms/give-webpage/"
  scrolling="no"
  style="width:100%; height:1600px; border:none; overflow:hidden;"
  id="donation-iframe">
</iframe>

<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'iframeResize') {
      var height = e.data.height;
      document.getElementById('donation-iframe').style.height = height + 'px';
      window.parent.postMessage(JSON.stringify({ key: 'height', value: height }), '*');
    }
  });
</script>
```

## Project Structure

```text
Proxima-donation-forms/
├── forms/
│   └── give-webpage/
│       └── index.html         # Proxima-branded Virtuous embed (give page)
├── virtuous-embed.html        # Debug/test page for Virtuous embed
├── virtuous-api-docs.md       # Virtuous API & Forms reference
├── index.html                 # Original hand-rolled form scaffold
├── style.css                  # Original form styles
└── script.js                  # Original form logic
```

## Branding

- **Primary color:** `#05718D` (teal)
- **Accent color:** `#F2B41E` (gold)
- **Font:** Montserrat (Google Fonts)
- **Logo:** Proxima-only color logo via Virtuous CDN

## Virtuous Form Details

| Attribute     | Value                                  |
| ------------- | -------------------------------------- |
| Form GUID     | `EC2B5B25-B5D3-4B4F-97A4-498DBEDE4298` |
| Org ID        | `8106`                                 |
| Merchant Type | `StripeUnified`                        |

## Notes

- The Virtuous embed requires HTTPS — local `file://` testing will not work
- The Wix hosting domain (`filesusr.com`) must be whitelisted in Virtuous form settings
- Payment processing is handled by Stripe via Virtuous
