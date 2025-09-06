Here’s a clear comparison of free tiers—focused on not just SendGrid and Mailgun, but also other strong options for developers and small teams:

---

### **SendGrid – Free Tier**

- Offers **100 emails per day** (\~3,000 emails/month). No credit card needed. ([SendGrid][1], [Capterra][2], [Campaign Refinery][3])
- Includes features like SMTP/API access, dynamic templates, basic analytics, one event webhook, and ticket support. ([SendGrid][1], [Campaign Refinery][3])
- Limitations: shared IP (no dedicated IP), no email validation, and some advanced tools locked behind paid plans. ([SendGrid][1], [aotsend.com][4])
- **Important Update**: SendGrid's free tier was discontinued in **May 2025**, according to Wikipedia. ([Wikipedia][5])
- **Community Insight**: Some users report unexpected throttling—emails counting toward monthly quotas rather than daily—and abrupt delivery halts at the limit. ([Reddit][6])

---

### **Mailgun – Free Tier**

- Allows **100 emails per day**, and no credit card required. ([help.mailgun.com][7])
- Includes one custom domain, 1-day log retention, inbound route, 2 API keys, analytics, and ticket support. ([help.mailgun.com][7])
- More developer-focused—flexible API features, strong deliverability, and compliance.&#x20;
- **Caution**: The pay-as-you-go "Flex" plan and some free features have been phased out, making free options more limited. ([Reddit][8])
- Feedback from long-time users suggests the free tier is stable, though deliverability and spam filters remain concerns. ([Reddit][9])

---

### **Other Notable Free-Tier Providers**

1. **Brevo (formerly Sendinblue)**
   - Free writes: **300 emails/day** (\~9,000/month), up to 100,000 contacts.
   - Includes templates, email builder, API, SMTP, webhook support. ([Mailgun][10])

2. **Mailjet**
   - Free plan: **6,000 emails/month**, capped at **200/day**, up to 1,500 contacts.
   - Offers drag‑and‑drop editor, API, SMTP, basic analytics, signup forms. ([Mailgun][10])

3. **SparkPost**
   - Free limit: **500 emails/month**, with a **100 emails/day** cap.
   - Provides API access, analytics, suppression tools, and sender health metrics. ([Mailgun][10])

4. **Amazon SES (Simple Email Service)**
   - Free for the first year: **3,000 emails/month**.
   - After that, very low-cost pay-as-you-go. Powerful API and SMTP tools via AWS. ([Mailgun][10])

---

### **Comparison Table (Free Tiers Only)**

| Provider       | Free Email Cap                       | Highlights                                     | Notes                                         |
| -------------- | ------------------------------------ | ---------------------------------------------- | --------------------------------------------- |
| **SendGrid**   | **100/day**, discontinued (May 2025) | Templates, analytics, webhook, no card needed  | Free tier ended; limited features             |
| **Mailgun**    | 100/day                              | API-driven, developer-centric, basic analytics | Flex plan phased out; deliverability concerns |
| **Brevo**      | 300/day (\~9,000/mo)                 | Builder, automation, API, large contacts limit | Balanced marketing + transactional            |
| **Mailjet**    | 6,000/mo (200/day)                   | Editor, API, forms, basic analytics            | Slightly limited daily cap                    |
| **SparkPost**  | 500/mo (100/day)                     | Health metrics, webhook, sender visibility     | Very low volume                               |
| **Amazon SES** | 3,000/mo first year                  | Inexpensive, full API/SMTP, reliable           | AWS setup is more involved                    |

---

### **Recommendations (As of Sept 2025)**

- **If you previously relied on SendGrid's free tier**:
  The free plan is no longer available. Consider switching to **Brevo** for marketing-friendly features or **Mailgun** for developer-focused transactional sending—but check current availability and limitations.

- **For high free-volume needs**:
  **Brevo** offers the most generous free daily/monthly limits.

- **For low-volume developer use**:
  **Mailgun** is robust for APIs and full transactional control — just monitor deliverability closely.

- **On a tight budget needing control**:
  **Amazon SES** is low-cost after trial, though it's more complex to configure.

- **For visual email building + API access**:
  **Mailjet** strikes a nice balance between functionality and ease of use.

---

Let me know your specific needs—like volume, automation features, ease of setup—and I’ll help you narrow this further!

[1]: https://resources.sendgrid.com/en-us/pricing?utm_source=chatgpt.com 'Pricing and Plans | SendGrid'
[2]: https://www.capterra.com/p/204113/SendGrid/pricing/?utm_source=chatgpt.com 'SendGrid Pricing: A Comprehensive Guide | Capterra'
[3]: https://campaignrefinery.com/sendgrid-pricing/?utm_source=chatgpt.com 'SendGrid Pricing in 2024: Breakdown of All Paid Plans'
[4]: https://www.aotsend.com/blog/p11453.html?utm_source=chatgpt.com 'SendGrid API Free Plan: Top 10 Benefits &; Limitations You Need to Know - Send Email API for Developer Service Provider | AOTsend'
[5]: https://en.wikipedia.org/wiki/SendGrid?utm_source=chatgpt.com 'SendGrid'
[6]: https://www.reddit.com/r/SendGrid/comments/176t53m?utm_source=chatgpt.com 'Free account caps monthly usage?'
[7]: https://help.mailgun.com/hc/en-us/articles/203068914-What-does-the-Free-plan-offer?utm_source=chatgpt.com 'What does the Free plan offer? – Mailgun Help Center'
[8]: https://www.reddit.com/r/webdev/comments/ew8irv?utm_source=chatgpt.com 'mailgun is ending its free tier and the use of routes will now cost 35$ / month ? =/'
[9]: https://www.reddit.com/r/rails/comments/1ie3945?utm_source=chatgpt.com 'Any gotchas I should be aware of on the free tier of Mailgun?'
[10]: https://www.mailgun.com/blog/email/best-free-email-plans/?utm_source=chatgpt.com 'Top 5 Email Platforms With Free Tiers for Developers and Teams | Mailgun'
