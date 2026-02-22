# RecurringDonation

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `recurring_donation`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/recurring_donation`
- Resource path: `https://api.planningcenteronline.com/giving/v2/recurring_donations`
- Collection only: `no`
- Deprecated: `no`


## Description

A `RecurringDonation` is represents a `Donation` that repeats on a set schedule (weekly, monthly, etc.)

Data for `RecurringDonation`s is read-only; they can not be created or edited through the API.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | The number of cents scheduled to be donated. | public |
| amount_currency | currency_abbreviation (e.g. USD) | The currency of `amount_cents`. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a recurring donation was created. Example: `2000-01-01T12:00:00Z` | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a recurring donation. | public |
| last_donation_received_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time that the last donation was made for a recurring donation. Example: `2000-01-01T12:00:00Z` | public |
| next_occurrence | date_time (e.g. 2000-01-01T12:00:00Z) | The date that the next donation will be made for a recurring donation. Example: `2000-01-01T12:00:00Z` | public |
| release_hold_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date when the hold on a recurring donation with a status of `temporary_hold` will be released. | public |
| schedule | repeatable_schedule (e.g. {'day_in_month': {'day': 1}}) | JSON representation of the billing schedule. See the repeatable Ruby gem for more details on the structure and meaning: https://github.com/molawson/repeatable#time-expressions | public |
| status | string (e.g. string) | Determines if a recurring donation is active or on hold, and if on hold, the kind of hold that has been placed on it.  Possible values: `active`, `indefinite_hold` or `temporary_hold`. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a recurring donation was last updated. Example: `2000-01-01T12:00:00Z` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| paymentmethod-recurringdonation-payment_method | payment_method | - |
| recurringdonationdesignation-recurringdonation-designations | designations | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| recurringdonation-organization-recurring_donations | recurring_donations | - |
| recurringdonation-paymentmethod-recurring_donations | recurring_donations | - |
| recurringdonation-person-recurring_donations | recurring_donations | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | designations | include associated designations |
