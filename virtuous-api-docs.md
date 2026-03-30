# Virtuous API & Forms Documentation

Source: https://docs.virtuoussoftware.com/#virtuous-forms

---

## Reference

The Virtuous API uses the REST architectural style with resource-oriented URLs and HTTP response codes. All API responses, including errors, return JSON. Cross-origin resource sharing is **not supported** on authenticated endpoints.

There is **no test mode** with the API.

---

## Authentication

All API requests must be made over **HTTPS**. Two authentication methods are available:

- **API Keys** — recommended for integrations and syncs. Static tokens that last 15 years.
- **OAuth Tokens** — recommended for user-based interactions. Tokens last 15 days; refresh tokens last 365 days.

### API Keys

Create in the Virtuous UI under **API Keys** → "Create a Key". Use with:

```
Authorization: {{vault:bearer-token}}
```

### OAuth Token

```bash
curl -d "grant_type=password&username=YOUR_EMAIL&password=YOUR_PASSWORD" \
  -X POST https://api.virtuoussoftware.com/Token
```

Refresh an expired token:

```bash
curl -d "grant_type=refresh_token&refresh_token=REFRESH_TOKEN" \
  -X POST https://api.virtuoussoftware.com/Token
```

With 2FA (OTP):

```bash
curl -d "grant_type=password&username=YOUR_EMAIL&password=YOUR_PASSWORD&otp=YOUR_OTP" \
  -X POST https://api.virtuoussoftware.com/Token
```

**Token response:**

```json
{
  "access_token": "abc123.....",
  "token_type": "bearer",
  "expires_in": 3599,
  "refresh_token": "zyx987...",
  "userName": "bobloblaw@loblaw.org",
  "twoFactorEnabled": "True",
  ".issued": "Thu, 10 Feb 2022 22:27:19 GMT",
  ".expires": "Thu, 10 Feb 2022 23:27:19 GMT"
}
```

---

## Rate Limits

- **Hourly limit:** 1,500 requests
- `X-RateLimit-Limit` — total rate limit
- `X-RateLimit-Remaining` — remaining requests
- `X-RateLimit-Reset` — unix timestamp of reset

---

## Best Practices

1. **Use webhooks** instead of polling for new/updated gifts, contacts, or projects.
2. **Avoid obsolete endpoints** — marked with "(obsolete)", will be removed in future releases.
3. **Use bulk endpoints** when querying or updating groups of objects.
4. **Read the response** — non-200 responses include a message explaining the error.
5. **Use Transaction Endpoints** for Gifts and Contacts to avoid duplicate contacts.

---

## Import Tool Endpoints

Transactions are posted to the API → set to a holding state → bundled into imports at midnight → organization reviews and clicks run → Gifts created and webhooks fired.

**Benefits:** Contact matching, validation, gift matching, and data integrity.

---

## Virtuous Forms

Virtuous Forms allow users to set default values, override settings, and expose an `onSuccess` event for tracking (Facebook Pixel, Google Analytics) or displaying custom messages.

### Setup

Initialize `VirtuousForms.settings` **before** the embed script loads:

```javascript
let VirtuousForms = VirtuousForms || {};
VirtuousForms.settings = {
  firstName: 'DEFAULT_VALUE',
  lastName: 'DEFAULT_VALUE',
  email: 'DEFAULT_VALUE',
  onSuccess: function(response) {
    // track event here (GA, FB Pixel, custom message, etc.)
  }
};
```

### Embed Script

```html
<script
  src="https://cdn.virtuoussoftware.com/virtuous.embed.min.js"
  data-vform="EC2B5B25-B5D3-4B4F-97A4-498DBEDE4298"
  data-orgId="8106"
  data-isGiving="true"
  data-merchantType="StripeUnified"
  data-dependencies="[]">
</script>
```

### Known Parameters

| Attribute | Value | Notes |
|---|---|---|
| `data-vform` | `EC2B5B25-B5D3-4B4F-97A4-498DBEDE4298` | Form GUID |
| `data-orgId` | `8106` | Proxima org ID |
| `data-isGiving` | `true` | Marks as a giving/donation form |
| `data-merchantType` | `StripeUnified` | Payment processor |
| `data-dependencies` | `[]` | Additional JS dependencies |

### How the Embed Script Works (reverse-engineered)

- Queries `document.querySelectorAll("script[data-vform]")` to find embed tags
- Creates a `<div data-virtuous-form="...">` and inserts it **before** the script tag
- Dynamically loads React 16, ReactDOM, Stripe.js, and other dependencies from CDN
- Renders the Virtuous React app into the injected div

### Troubleshooting

| Issue | Likely Cause |
|---|---|
| "You're attempting to use a Virtuous Form without a secure connection" | Page must be served over HTTPS |
| Error code 5 / spinning | Form not published in Virtuous admin, or form/org ID mismatch |
| 404 from Virtuous API | Form ID or org ID incorrect, or form not active |
| Slow to load | Script loads React + Stripe + ~10 other dependencies on first render |

### Production Details

- **Site:** https://www.liveproxima.org/give
- **Platform:** Wix (embedded via HTML iFrame widget)
- **Brand primary:** `#047190` (teal)
- **Brand secondary:** `#F2B41E` (gold)
- **Font:** Arial, Helvetica, sans-serif
