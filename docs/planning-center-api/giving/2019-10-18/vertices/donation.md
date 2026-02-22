# Donation

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `donation`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/donation`
- Resource path: `https://api.planningcenteronline.com/giving/v2/donations`
- Collection only: `no`
- Deprecated: `no`


## Description

A `Donation` record corresponds to a gift given to an `Organization` at a particular point in time.

`Donation`s are added by first associating them to a `Batch` of donations, and then committing the `Batch`. When adding a `Donation` to an already-committed `Batch`, the `Donation` will automatically be committed as well, and immediately added to the donor's online history.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| issue_refund | https://api.planningcenteronline.com/giving/v2/donations/{donation_id}/issue_refund | Used to refund a batch donation | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| amount_cents | integer (e.g. 1) | The number of cents being donated. Derived from the total of all of a donation's associated designation's `amount_cents` values. | public |
| amount_currency | currency_abbreviation (e.g. USD) | The currency of `amount_cents`. Based on the organization's currency. | public |
| completed_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a donation was completely processed. For card and ACH donations processed by Stripe, this is the moment when the donation was marked as fully processed by Stripe. For committed batch donations, this is the moment that the batch was committed. For uncommitted batch donations, this should return `null`. Example: `2000-01-01T12:00:00Z` | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a donation was created. Example: `2000-01-01T12:00:00Z` | public |
| fee_cents | integer (e.g. 1) | The fee to process a donation. This should either be 0 or a negative integer. For a donation processed by Giving via Stripe, this is the amount the associated organization paid Stripe to process it. For donations not processed by Stripe, this can be used to record fees from other systems. Note: while `amount_cents` is assigned via a donation's designations, `fee_cents` is set here, and used by Giving to distribute fees across all designations in proportion to the amount of each designation. | public |
| fee_covered | boolean (e.g. True) | A boolean indicating whether the donor chose to cover the Stripe processing fee for this donation.Note that `fee_covered` can only be true for donations processed through Stripe. | public |
| fee_currency | currency_abbreviation (e.g. USD) | The currency of `fee_cents`. Based on the organization's currency. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a donation. | public |
| memo | string (e.g. string) | An optional short note donors can add to specify their gift intention (e.g. "In memory of..."). Only available when enabled by the church for specific funds. | public |
| payment_brand | string (e.g. string) | For cards, this is the card brand (eg Visa, Mastercard, etc). For checks and bank accounts, this is the bank name. For cash donations, this should be `null`. | public |
| payment_check_dated_at | date (e.g. 2000-01-01) | The check date for donations made by check. Example: `2000-01-01` | public |
| payment_check_number | integer (e.g. 1) | The check number for donations made by check. | public |
| payment_last4 | string (e.g. string) | The last 4 digits of a donation's payment method number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. For cash and check donations, this should be `null`. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321` | public |
| payment_method | string (e.g. value) | Required. The payment method used to make a donation.  Possible values: `ach`, `cash`, `check`, or `card` | public |
| payment_method_sub | string (e.g. value) | For cards, this will be the card subtype. Will be `null` for other payment method types.  Possible values: `credit`, `debit`, `prepaid`, or `unknown` | public |
| payment_status | string (e.g. value) | For Stripe donations, this is the payment status. For batch donations, `pending` means that the donation has not yet been committed, whereas `succeeded` refers to a committed donation.  Possible values: `pending`, `succeeded`, or `failed` | public |
| received_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a donation was received. For card and ACH donations processed by Stripe, this is the moment when the donation was created in Giving. For batch donations, this is a customizable value that can be set via the Giving UI or API to any date. This allows for batch donations recieved on a previous day to be dated in the past, as well as for postdated checks to have a date in the future. It is important to ensure that this attribute is set accurately, as this is the date used to filter donations in the Giving admin UI. When creating new donations via the API, this attribute will default to the current date and time. Example: `2000-01-01T12:00:00Z` | public |
| refundable | boolean (e.g. True) | A boolean indicating whether this donation can be refunded via the API. Note that for some donations, this may be false, even though the donation _can_ be refunded in the UI. | public |
| refunded | boolean (e.g. True) | Returns `true` if a donation has been refunded, or `false` if it hasn't. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a donation was last updated. Example: `2000-01-01T12:00:00Z` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| batch | batch | - |
| campus | campus | - |
| person | person | - |
| payment_source | payment_source | - |
| labels | labels | - |
| recurring_donation | recurring_donation | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-donation-campus | campus | - |
| designation-donation-designations | designations | - |
| label-donation-labels | labels | - |
| note-donation-note | note | - |
| refund-donation-refund | refund | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| donation-batch-donations | donations | - |
| donation-campus-donations | donations | - |
| donation-organization-donations | donations | - |
| donation-paymentsource-donations | donations | - |
| donation-person-donations | donations | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | designations | include associated designations |
|  | labels | include associated labels |
|  | note | include associated note |
|  | refund | include associated refund |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | completed_at | prefix with a hyphen (-completed_at) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | received_at | prefix with a hyphen (-received_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | completed_at | Query on a specific completed_at |
|  | created_at | Query on a specific created_at |
|  | payment_method | Query on a specific payment_method  Possible values: `ach`, `cash`, `check`, or `card` |
|  | received_at | Query on a specific received_at |
|  | updated_at | Query on a specific updated_at |
