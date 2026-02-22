# PaymentSource

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `payment_source`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/payment_source`
- Resource path: `https://api.planningcenteronline.com/giving/v2/payment_sources`
- Collection only: `no`
- Deprecated: `no`


## Description

A donation's `PaymentSource` refers to the platform it originated from.

`Donation`s made through Giving will be assigned the built-in `PaymentSource` "Planning Center". `Donation`s made through external platforms (Square, Pushpay, ect.) can be assigned a `PaymentSource` identifying them as such.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a payment source was created. Example: `2000-01-01T12:00:00Z` | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a payment source. | public |
| name | string (e.g. string) | Required. The name of a payment source. Must be unique within the associated organization. | public |
| status | string (e.g. value) | The status of the payment source. Can be either `active` or `archived`. `active` payment sources can be assigned to donations, while `archived` payment sources cannot. Payment sources are `active` by default upon creation. Archiving a payment source will keep all historical records intact and can be undone.  Possible values: `active` or `archived` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a payment source was last updated. Example: `2000-01-01T12:00:00Z` | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| donation-paymentsource-donations | donations | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| paymentsource-organization-payment_sources | payment_sources | - |
