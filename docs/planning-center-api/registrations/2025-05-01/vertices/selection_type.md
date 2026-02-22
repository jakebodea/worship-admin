# SelectionType

- App: `registrations`
- Version: `2025-05-01`
- Vertex ID: `selection_type`
- Endpoint: `https://api.planningcenteronline.com/registrations/v2/documentation/2025-05-01/vertices/selection_type`
- Resource path: `https://api.planningcenteronline.com/registrations/v2/signups/{signup_id}/selection_types`
- Collection only: `no`
- Deprecated: `no`


## Description

`Selection_Types` are used to present the options people register for in a signup.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | Name of the selection type. | public |
| publicly_available | boolean (e.g. True) | Whether or not the selection type is available to the public. | public |
| price_cents | integer (e.g. 1) | Price of selection type in cents. | public |
| price_currency | string (e.g. string) | Signup currency code, example `"USD"`.   Only available when requested with the `?fields` param | public |
| price_currency_symbol | string (e.g. string) | Signup currency symbol, example `"$"`.   Only available when requested with the `?fields` param | public |
| price_formatted | string (e.g. string) | Price of selection type with currency formatting (symbol not included).   Only available when requested with the `?fields` param | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| selectiontype-attendee-selection_type | selection_type | - |
| selectiontype-signup-selection_types | selection_types | - |
