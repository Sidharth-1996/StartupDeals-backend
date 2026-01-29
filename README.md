````md
# Startup Benefits Platform

A full-stack application that provides startup founders and early-stage teams with access to curated SaaS deals.  
Some deals are public, while premium deals are locked behind user verification. The system models real-world business rules such as eligibility, approval workflows, and claim tracking.

---

## 1. End-to-End Application Flow

1. A user lands on the platform and explores available deals.
2. The user signs up and logs in.
3. After login, the user can:
   - Browse all deals
   - View individual deal details
4. Deals are divided into:
   - **Unlocked** – immediately claimable
   - **Locked** – require user verification
5. The user can:
   - Claim unlocked deals directly
   - Request verification from the dashboard
6. Once verified, the user gains access to locked deals.
7. When a deal is claimed:
   - A `Claim` record is created with status `pending`
   - The claim appears in the user dashboard
8. The dashboard shows:
   - Verification status
   - All claimed deals with their current state (`pending` / `approved`)

This flow mirrors how real startup benefit programs operate: discovery → onboarding → eligibility → approval → access.

---

## 2. Authentication and Authorization Strategy

- Authentication is handled using **JWT (JSON Web Tokens)**.
- On login:
  - User credentials are validated
  - A signed JWT containing the user ID is issued
- The token is stored on the client and sent with every protected request:

```http
Authorization: Bearer <token>
````

* A middleware on the backend:

  * Verifies the token
  * Extracts the user identity
  * Attaches it to the request object

Authorization rules are enforced **server-side**:

* Only authenticated users can:

  * Claim deals
  * Access the dashboard
  * Request verification
* Locked deals can only be claimed if:

```js
user.verificationStatus === "verified"
```

This ensures no client-side manipulation can bypass access rules.

---

## 3. Internal Flow of Claiming a Deal

When a user clicks **“Claim Deal”**:

1. Frontend sends a POST request to:

   ```
   POST /claims/:dealId
   ```

   with the JWT token.

2. Backend performs the following steps:

   * Authenticate user via JWT
   * Validate deal existence
   * Check if the deal is locked
   * If locked:

     * Verify that user is `verified`
   * Check for duplicate claims
   * Create a new `Claim`:

```json
{
  "user": "<userId>",
  "deal": "<dealId>",
  "status": "pending"
}
```

3. The claim is stored and returned.
4. The dashboard fetches user claims and reflects the new state.

This models a real-world workflow where access is requested and later fulfilled.

---

## 4. Interaction Between Frontend and Backend

The frontend is a pure Next.js App Router application.
All data flows through REST APIs.

| Frontend Page     | API Used               | Purpose                         |
| ----------------- | ---------------------- | ------------------------------- |
| Landing           | —                      | Marketing & entry point         |
| Deals Listing     | `GET /deals`           | Show all available deals        |
| Deal Details      | `GET /deals/:id`       | Show full deal info             |
| Claim Action      | `POST /claims/:dealId` | Submit claim                    |
| Dashboard         | `GET /claims/me`       | Fetch user-specific data        |
| Auth Pages        | `POST /auth/*`         | Register / Login                |
| Verification Flow | `POST /verification/*` | Request and manage verification |

* The frontend never directly modifies business rules.
* All validation happens on the backend.
* UI reacts to API responses and renders states accordingly.

---

## 5. Known Limitations or Weak Points

* No admin dashboard (approvals are simulated via API or DB)
* No email notifications
* No deal redemption or fulfillment system
* No pagination for large datasets
* No automated test coverage
* Basic error handling only

These are intentional trade-offs to keep the scope focused on core system design.

---

## 6. Improvements Required for Production Readiness

* Admin panel for verification and claim management
* Email notifications for:

  * Verification approval
  * Claim updates
* Rate limiting and brute-force protection
* Centralized logging and monitoring
* Input validation using a schema validator
* Automated tests (unit + integration)
* Pagination and caching for scalability
* Role-based access control

---

## 7. UI and Performance Considerations

* All pages include:

  * Page transitions
  * Loading states or skeletons
  * Hover and tap feedback
* Motion is used to:

  * Indicate navigation
  * Provide interaction feedback
  * Maintain layout stability during loading
* Locked deals are visually distinct and explain *why* access is restricted.
* The dashboard is designed as a “control center”:

  * Clear verification state
  * Status-driven deal cards
  * Immediate feedback for actions

The UI prioritizes clarity and product-like behavior over visual noise, aiming to feel like a real SaaS application rather than a demo.

---

**Built by:** Sidharth Sharma
**Date:** January 2026
**Email:** [sharmasidharth784@gmail.com](mailto:sharmasidharth784@gmail.com)
