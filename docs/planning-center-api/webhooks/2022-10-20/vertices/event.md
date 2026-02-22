# Event

- App: `webhooks`
- Version: `2022-10-20`
- Vertex ID: `event`
- Endpoint: `https://api.planningcenteronline.com/webhooks/v2/documentation/2022-10-20/vertices/event`
- Resource path: `https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions/{webhook_subscription_id}/events`
- Collection only: `no`
- Deprecated: `no`


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| ignore | https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions/{webhook_subscription_id}/events/{event_id}/ignore | - | - | no |
| redeliver | https://api.planningcenteronline.com/webhooks/v2/webhook_subscriptions/{webhook_subscription_id}/events/{event_id}/redeliver | - | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| payload | string (e.g. string) | - | public |
| status | string (e.g. value) | Possible values: `pending`, `delivered`, `failed`, `skipped`, `duplicated`, `ignored_failed`, `ignored_skipped`, or `ignored_duplicated` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| uuid | string (e.g. string) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| subscription | subscription | - |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| delivery-event-deliveries | deliveries | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| event-webhooksubscription-events | events | - |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | status | Query on a specific status  Possible values: `pending`, `delivered`, `failed`, `skipped`, `duplicated`, `ignored_failed`, `ignored_skipped`, or `ignored_duplicated` |
|  | uuid | Query on a specific uuid |
