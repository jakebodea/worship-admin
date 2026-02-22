# Delivery

- App: `webhooks`
- Version: `2022-10-20`
- Vertex ID: `delivery`
- Endpoint: `https://api.planningcenteronline.com/webhooks/v2/documentation/2022-10-20/vertices/delivery`
- Resource path: `https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions/{webhook_subscription_id}/events/{event_id}/deliveries`
- Collection only: `no`
- Deprecated: `no`


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| object_url | string (e.g. string) | - | public |
| request_body | string (e.g. string) | - | public |
| request_headers | string (e.g. string) | - | public |
| response_body | string (e.g. string) | - | public |
| response_headers | string (e.g. string) | - | public |
| status | integer (e.g. 1) | - | public |
| timing | float (e.g. 1.42) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| event | event | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| delivery-event-deliveries | deliveries | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
