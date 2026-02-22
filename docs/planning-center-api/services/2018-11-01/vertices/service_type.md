# ServiceType

- App: `services`
- Version: `2018-11-01`
- Vertex ID: `service_type`
- Endpoint: `https://api.planningcenteronline.com/services/v2/documentation/2018-11-01/vertices/service_type`
- Resource path: `https://api.planningcenteronline.com/services/v2/service_types`
- Collection only: `no`
- Deprecated: `no`


## Description

A Service Type is a container for plans.


## Actions

| Name | Path | Description | Return Type | Deprecated |
| --- | --- | --- | --- | --- |
| create_plans | https://api.planningcenteronline.com/services/v2/service_types/{service_type_id}/create_plans | Create multiple plans | - | no |


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| archived_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| attachment_types_enabled | boolean (e.g. True) | - | public |
| background_check_permissions | string (e.g. string) | - | scheduler |
| comment_permissions | string (e.g. string) | - | scheduler |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| custom_item_types | array (e.g. []) | A array of hashes that maps an item title substring matcher to a color:  [{ name: "Announcements", color: "#FFFFFF" }]  Valid substring matchers are any string that could be used as an item title.  A color is the hexadecimal value of a valid color e.g. #FFFFFF Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff | public |
| deleted_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| frequency | string (e.g. string) | - | scheduler |
| id | primary_key (e.g. primary_key) | - | public |
| last_plan_from | string (e.g. string) | - | scheduler |
| name | string (e.g. string) | - | public |
| permissions | string (e.g. string) | - | public |
| scheduled_publish | boolean (e.g. True) | - | public |
| sequence | integer (e.g. 1) | - | public |
| standard_item_types | array (e.g. []) | An array of hashes that maps an item type to a color:  [{ name: "Header", color: "#FFFFFF" }]  Valid names are Header, Song, and Media.  A color is the hexadecimal value of a valid color e.g. #FFFFFF Valid colors values are #e8f6df, #e0f7ff, #e6e2fd, #ffe0e8, #ffedd1, #cfcfcf, #eaebeb, and #ffffff | public |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| parent | parent | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| attachment-servicetype-attachments | attachments | - |
| itemnotecategory-servicetype-item_note_categories | item_note_categories | - |
| livecontroller-servicetype-live_controllers | live_controllers | - |
| plannotecategory-servicetype-plan_note_categories | plan_note_categories | - |
| plantemplate-servicetype-plan_templates | plan_templates | - |
| plantime-servicetype-plan_times | plan_times | - |
| plan-servicetype-plans | plans | - |
| publicview-servicetype-public_view | public_view | - |
| teamposition-servicetype-team_positions | team_positions | - |
| team-servicetype-teams | teams | - |
| timepreferenceoption-servicetype-time_preference_options | time_preference_options | - |
| plan-servicetype-unscoped_plans | unscoped_plans | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| servicetype-folder-service_types | service_types | - |
| servicetype-live-service_type | service_type | - |
| servicetype-organization-service_types | service_types | - |
| servicetype-team-service_types | service_types | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | time_preference_options | include associated time_preference_options |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | name | prefix with a hyphen (-name) to reverse the order |
|  | sequence | prefix with a hyphen (-sequence) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | id | Query on a specific id |
|  | name | Query on a specific name |
|  | parent_id | Query on a related parent |
