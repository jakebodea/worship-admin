# RecurringDonationDesignation

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `recurring_donation_designation`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/recurring_donation_designation`
- Resource path: `https://api.planningcenteronline.com/giving/v2/recurring_donations/{recurring_donation_id}/designations`
- Collection only: `no`
- Deprecated: `no`


## Description

Much like a `Designation`, A `RecurringDonationDesignation` conveys how much of a `RecurringDonation` goes to a particular `Fund`.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | Required. The number of cents that will be donated to a recurring donation designation's associated fund. | public |
| amount_currency | string (e.g. string) | The currency of `amount_cents`. Set to the currency of the associated organization. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a recurring donation designation. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| fund-recurringdonationdesignation-fund | fund | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| recurringdonationdesignation-recurringdonation-designations | designations | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | fund | include associated fund |
