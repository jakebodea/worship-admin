# Webhooks

Webhooks allow a third-party application to receive real-time data payloads when something changes in Planning
Center. In most cases, webhooks are a faster, more efficient alternative to polling the API for data changes.

The API endpoints documented here can be used to interact with our webhook system programatically,
allowing you to obtain information on webhook events, see the status of event deliveries, and create new webhook
subscriptions, among other things.

For general information on how to use Planning Center webhooks, please visit
https://developer.planning.center/docs/#/overview/webhooks.



## App

- App slug: `webhooks`
- Base docs endpoint: `https://api.planningcenteronline.com/webhooks/v2/documentation`


## Versions

| Version | Beta | Details |
| --- | --- | --- |
| 2022-10-20 | no | Replace Subscription with WebhookSubscription |
| 2018-08-01 | no | The first available version of the API |
