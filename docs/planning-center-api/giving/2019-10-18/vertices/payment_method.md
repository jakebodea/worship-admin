# PaymentMethod

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `payment_method`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/payment_method`
- Resource path: `https://api.planningcenteronline.com/giving/v2/people/{person_id}/payment_methods`
- Collection only: `no`
- Deprecated: `no`


## Description

Stored `PaymentMethod` information (`card` or `bank_account`) used by donors to make online `Donation`s.

`PaymentMethod` data is for informational purposes only and cannot be used to create charges through the API.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| brand | string (e.g. string) | For cards, this is the card brand (eg Visa, Mastercard, etc). For bank accounts, this is the bank name. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a payment method was created. Example: `2000-01-01T12:00:00Z` | public |
| expiration | date (e.g. 2000-01-01) | For cards only. String representation of the expiration date in the `MM/YYYY` form (without leading zeros). Will be `null` for bank accounts. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a payment method. | public |
| last4 | string (e.g. string) | The last 4 digits of the payment method's number. For cards, this is the last 4 digits of the card number. For bank accounts, this is the last 4 digits of the bank account number. Note: In cases where we don't have all 4 digits on file, a `*` will be used to pad the number. For example: `*321` | public |
| method_subtype | string (e.g. string) | For cards, either `credit`, `debit`, `prepaid`, or `unknown`. For bank accounts, either `checking` or `savings`. | public |
| method_type | string (e.g. value) | Determines whether or not the payment method is a card or bank account.  Possible values: `card`, `us_bank_account`, or `au_becs_debit` | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a payment method was last updated. Example: `2000-01-01T12:00:00Z` | public |
| verified | boolean (e.g. True) | For bank accounts only. Will be `null` for cards. | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| recurringdonation-paymentmethod-recurring_donations | recurring_donations | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| paymentmethod-person-payment_methods | payment_methods | - |
| paymentmethod-recurringdonation-payment_method | payment_method | - |
