# Label

- App: `check-ins`
- Version: `2025-05-28`
- Vertex ID: `label`
- Endpoint: `https://api.planningcenteronline.com/check-ins/v2/documentation/2025-05-28/vertices/label`
- Resource path: `https://api.planningcenteronline.com/check-ins/v2/labels`
- Collection only: `no`
- Deprecated: `no`


## Description

Labels can be set to print for events (through `EventLabel`s),
locations (through `LocationLabel`s) or options.
Label type (security label / name label) is expressed with the
`prints_for` attribute. `prints_for="Person"` is a name label,
`prints_for="Group"` is a security label.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| prints_for | string (e.g. string) | - | public |
| roll | string (e.g. string) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| xml | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| eventlabel-label-event_labels | event_labels | - |
| locationlabel-label-location_labels | location_labels | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| label-eventlabel-label | label | - |
| label-locationlabel-label | label | - |
| label-option-label | label | - |
| label-organization-labels | labels | - |
