# WebhookSubscription

- App: `webhooks`
- Version: `2022-10-20`
- Vertex ID: `webhook_subscription`
- Endpoint: `https://api.planningcenteronline.com/webhooks/v2/documentation/2022-10-20/vertices/webhook_subscription`
- Resource path: `https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions`
- Collection only: `no`
- Deprecated: `no`


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| rotate_secret | https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions/{webhook_subscription_id}/rotate_secret | - | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| active | boolean (e.g. True) | - | public |
| application_id | string (e.g. string) | - | public |
| authenticity_secret | string (e.g. string) | Every delivery will include a header `X-PCO-Webhooks-Authenticity`.  This header will be the `HMAC-SHA256` value of this the `authenticity_secret` used as the key, and the message as the webhook body.  `hmac_sha256(authenticity_secret, webhook_body)` | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| url | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-webhooksubscription-events | events | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| webhooksubscription-organization-webhook_subscriptions | webhook_subscriptions | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | application_id | Query on a specific application_id |
