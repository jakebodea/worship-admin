# BatchGroup

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `batch_group`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/batch_group`
- Resource path: `https://api.planningcenteronline.com/giving/v2/batch_groups`
- Collection only: `no`
- Deprecated: `no`


## Description

A `BatchGroup` is a collection of `Batch`es.

`BatchGroup`s are an optional way of organizing your `Batch`es into groups that share common characteristics. These are completely customizable and can be used in whatever way makes sense to your organization's workflow.

Similarly to `Batch`es, you can `commit` (see more in the Actions section) a `BatchGroup`, and by doing so, all `Batches` and `Donations` contained in the `BatchGroup` will also be committed.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| commit | https://api.planningcenteronline.com/giving/v2/batch_groups/{batch_group_id}/commit | Used to commit an in progress batch group. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| committed | boolean (e.g. True) | Returns `true` if a batch group has been committed, and `false` if it hasn't. | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a batch group was created. Example: `2000-01-01T12:00:00Z` | public |
| description | string (e.g. string) | A brief description of what a batch group is for. This is displayed in Giving to help differentiate different batch groups from one another. If no description is provided for a batch group, it will be referred to as `Untitled group` within Giving. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a batch group. For batches and batch groups, these identifiers are unique not across all of Planning Center, but only per organization. As such, it is possible to see the same batch group `id` in multiple organizations. | public |
| status | string (e.g. string) | One of `in_progress`, `updating`, or `committed`. The `updating` state is temporary and describes a BatchGroup that is currently being changed in some way (e.g. moving from `in_progress` to `committed`). Certain changes to BatchGroups in this state (or their Batches or Donations) will be restricted until the BatchGroup has finished updating. | public |
| total_cents | integer (e.g. 1) | The gross total of cents donated within the batch group. Factors in all donations made to each batch within the group. | public |
| total_currency | string (e.g. string) | The currency used to calculate `total_cents`. | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | The date and time at which a batch group was last updated. Example: `2000-01-01T12:00:00Z` | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| batch-batchgroup-batches | batches | - |
| person-batchgroup-owner | owner | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| batchgroup-batch-batch_group | batch_group | - |
| batchgroup-organization-batch_groups | batch_groups | - |
| batchgroup-person-batch_groups | batch_groups | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | owner | include associated owner |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | updated_at | Query on a specific updated_at |
