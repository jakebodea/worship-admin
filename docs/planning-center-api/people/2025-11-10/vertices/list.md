# List

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `list`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/list`
- Resource path: `https://api.planningcenteronline.com/people/v2/lists`
- Collection only: `no`
- Deprecated: `no`


## Description

A list is a powerful tool for finding and grouping people together using any criteria imaginable.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| mailchimp_sync | https://api.planningcenteronline.com/people/v2/lists/{list_id}/mailchimp_sync | Sync a List to Mailchimp. (Mailchimp integration must already be configured for this organization.) | - | no |
| run | https://api.planningcenteronline.com/people/v2/lists/{list_id}/run | Run a List to update its results. | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| auto_generated_name | boolean (e.g. True) | - | public |
| auto_refresh | boolean (e.g. True) | - | public |
| auto_refresh_frequency | string (e.g. string) | - | public |
| automations_active | boolean (e.g. True) | - | public |
| automations_count | integer (e.g. 1) | - | public |
| batch_completed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| description | string (e.g. string) | - | public |
| has_inactive_results | boolean (e.g. True) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| include_inactive | boolean (e.g. True) | - | public |
| invalid | boolean (e.g. True) | - | public |
| name | string (e.g. string) | - | public |
| name_or_description | string (e.g. string) | - | public |
| paused_automations_count | integer (e.g. 1) | - | public |
| recently_viewed | boolean (e.g. True) | - | public |
| refreshed_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| return_original_if_none | boolean (e.g. True) | - | public |
| returns | string (e.g. string) | - | public |
| starred | boolean (e.g. True) | - | public |
| status | string (e.g. string) | - | public |
| subset | string (e.g. string) | - | public |
| total_people | integer (e.g. 1) | - | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| campus-list-campus | campus | - |
| listcategory-list-category | category | - |
| person-list-created_by | created_by | - |
| listresult-list-list_results | list_results | - |
| mailchimpsyncstatus-list-mailchimp_sync_status | mailchimp_sync_status | - |
| person-list-people | people | - |
| rule-list-rules | rules | - |
| listshare-list-shares | shares | - |
| liststar-list-star | star | - |
| person-list-updated_by | updated_by | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| list-campus-lists | lists | - |
| list-listcategory-lists | lists | - |
| list-organization-lists | lists | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | campus | include associated campus |
|  | category | include associated category |
|  | created_by | include associated created_by |
|  | mailchimp_sync_status | include associated mailchimp_sync_status |
|  | people | include associated people |
|  | rules | include associated rules |
|  | shares | include associated shares |
|  | updated_by | include associated updated_by |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | batch_completed_at | prefix with a hyphen (-batch_completed_at) to reverse the order |
|  | campus_id | prefix with a hyphen (-campus_id) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | list_categories.name | prefix with a hyphen (-list_categories.name) to reverse the order |
|  | list_category_id | prefix with a hyphen (-list_category_id) to reverse the order |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | name_or_description | prefix with a hyphen (-name_or_description) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | batch_completed_at | Query on a specific batch_completed_at |
|  | created_at | Query on a specific created_at |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | updated_at | Query on a specific updated_at |
