# Refund

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `refund`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/refund`
- Resource path: `https://api.planningcenteronline.com/giving/v2/donations/{donation_id}/refund`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Refund` record holds information pertaining to a refunded `Donation`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | The number of cents being refunded. | public |
| amount_currency | string (e.g. string) | The currency of `amount_cents`. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a refund was created. Example: `2000-01-01T12:00:00Z` | public |
| fee_cents | integer (e.g. 1) | The payment processing fee returned by Stripe, if any. | public |
| fee_currency | currency_abbreviation (e.g. USD) | The currency of `fee_cents`. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a refund. | public |
| refunded_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a refund was processed. Example: `2000-01-01T12:00:00Z` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a refund was last updated. Example: `2000-01-01T12:00:00Z` | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| designationrefund-refund-designation_refunds | designation_refunds | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| refund-donation-refund | refund | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | designation_refunds | include associated designation_refunds |
