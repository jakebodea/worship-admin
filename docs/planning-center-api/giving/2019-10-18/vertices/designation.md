# Designation

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `designation`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/designation`
- Resource path: `https://api.planningcenteronline.com/giving/v2/donations/{donation_id}/designations`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Designation` conveys how much of a `Donation` goes to a particular `Fund`.

`Designation` details are required when creating a `Donation`. If all of a `Donation` is going to a single `Fund`, it will only have one `Designation`. Similarly, to split a `Donation` between multiple `Fund`s, you can use multiple `Designation`s.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | Required. The number of cents being donated to a designation's associated fund. | public |
| amount_currency | string (e.g. string) | The currency of `amount_cents`. Set to the currency of the associated organization. | public |
| fee_cents | integer (e.g. 1) | The fee amount distributed to a donation's designation in proportion to the amount of the designation. This should either be 0 or a negative integer. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a designation. | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| fund | fund | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fund-designation-fund | fund | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| designation-designationrefund-designation | designation | - |
| designation-donation-designations | designations | - |
