# NoteCategorySubscription

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `note_category_subscription`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/note_category_subscription`
- Resource path: `https://api.planningcenteronline.com/people/v2/note_category_subscriptions`
- Collection only: `no`
- Deprecated: `no`


## Description

A subscription for note categories


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| person | person | - |
| note_category | note_category | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-notecategorysubscription-person | person | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| notecategorysubscription-notecategory-subscriptions | subscriptions | - |
| notecategorysubscription-organization-note_category_subscriptions | note_category_subscriptions | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | person | include associated person |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | created_at | Query on a specific created_at |
|  | updated_at | Query on a specific updated_at |
