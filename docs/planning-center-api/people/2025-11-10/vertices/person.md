# Person

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/person`
- Resource path: `https://api.planningcenteronline.com/people/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

A person record represents a single member/user of the application. Each person has different permissions that determine how the user can use this app (if at all).


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| accounting_administrator | boolean (e.g. True) | - | standard |
| anniversary | date (e.g. 2000-01-01) | - | standard |
| avatar | string (e.g. string) | - | public |
| birthdate | date (e.g. 2000-01-01) | - | standard |
| can_create_forms | boolean (e.g. True) | - | standard |
| can_email_lists | boolean (e.g. True) | - | standard |
| child | boolean (e.g. True) | - | standard |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | standard |
| demographic_avatar_url | string (e.g. string) | - | public |
| directory_shared_info | json (e.g. {}) | Only available when requested with the `?fields` param | standard |
| directory_status | string (e.g. string) | - | standard |
| first_name | string (e.g. string) | - | public |
| gender | string (e.g. string) | - | standard |
| given_name | string (e.g. string) | - | standard |
| grade | integer (e.g. 1) | - | standard |
| graduation_year | integer (e.g. 1) | - | standard |
| id | primary_key (e.g. primary_key) | - | public |
| inactivated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | standard |
| last_name | string (e.g. string) | - | public |
| login_identifier | string (e.g. string) | - | permitted_viewer |
| medical_notes | string (e.g. string) | - | standard |
| membership | string (e.g. string) | - | standard |
| mfa_configured | boolean (e.g. True) | Only available when requested with the `?fields` param | organization_administrator |
| middle_name | string (e.g. string) | - | standard |
| name | string (e.g. string) | - | public |
| nickname | string (e.g. string) | - | standard |
| passed_background_check | boolean (e.g. True) | - | standard |
| people_permissions | string (e.g. string) | - | standard |
| remote_id | integer (e.g. 1) | - | standard |
| resource_permission_flags | json (e.g. {}) | - | standard |
| school_type | string (e.g. string) | - | standard |
| site_administrator | boolean (e.g. True) | - | standard |
| status | string (e.g. string) | - | public |
| stripe_customer_identifier | string (e.g. string) | Only available when requested with the `?fields` param | super_user |
| updated_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | standard |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| primary_campus | primary_campus | - |
| created_by | created_by | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| address-person-addresses | addresses | - |
| app-person-apps | apps | - |
| backgroundcheck-person-background_checks | background_checks | - |
| connectedperson-person-connected_people | connected_people | - |
| email-person-emails | emails | - |
| fielddatum-person-field_data | field_data | - |
| householdmembership-person-household_memberships | household_memberships | - |
| household-person-households | households | - |
| inactivereason-person-inactive_reason | inactive_reason | - |
| maritalstatus-person-marital_status | marital_status | - |
| messagegroup-person-message_groups | message_groups | - |
| message-person-messages | messages | The Person's received messages. Can also receive a filter to return `sent` or `unread` e.g. `?filter=sent` |
| nameprefix-person-name_prefix | name_prefix | - |
| namesuffix-person-name_suffix | name_suffix | - |
| note-person-notes | notes | - |
| organization-person-organization | organization | - |
| personapp-person-person_apps | person_apps | - |
| phonenumber-person-phone_numbers | phone_numbers | - |
| platformnotification-person-platform_notifications | platform_notifications | - |
| campus-person-primary_campus | primary_campus | - |
| schooloption-person-school | school | - |
| socialprofile-person-social_profiles | social_profiles | - |
| workflowcard-person-workflow_cards | workflow_cards | - |
| workflowshare-person-workflow_shares | workflow_shares | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-backgroundcheck-person | person | - |
| person-condition-created_by | created_by | - |
| person-email-person | person | - |
| person-fielddatum-person | person | - |
| person-formsubmission-person | person | - |
| person-householdmembership-person | person | - |
| person-household-people | people | - |
| person-list-created_by | created_by | - |
| person-list-people | people | - |
| person-listshare-person | person | - |
| person-list-updated_by | updated_by | - |
| person-messagegroup-from | from | - |
| person-message-to | to | - |
| person-notecategoryshare-person | person | - |
| person-notecategory-subscribers | subscribers | - |
| person-notecategorysubscription-person | person | - |
| person-note-created_by | created_by | - |
| person-note-person | person | - |
| person-organization-people | people | - |
| person-peopleimporthistory-person | person | - |
| person-report-created_by | created_by | - |
| person-report-updated_by | updated_by | - |
| person-socialprofile-person | person | - |
| person-workflowcard-assignee | assignee | - |
| person-workflowcard-person | person | - |
| person-workflowshare-person | person | - |
| person-workflow-shared_people | shared_people | - |
| person-workflowstepassigneesummary-person | person | - |
| person-workflowstep-default_assignee | default_assignee | - |


## Can Include

| ID | Name/Path | Details |
| --- | --- | --- |
|  | addresses | include associated addresses |
|  | emails | include associated emails |
|  | field_data | include associated field_data |
|  | households | include associated households |
|  | inactive_reason | include associated inactive_reason |
|  | marital_status | include associated marital_status |
|  | name_prefix | include associated name_prefix |
|  | name_suffix | include associated name_suffix |
|  | organization | include associated organization |
|  | person_apps | include associated person_apps |
|  | phone_numbers | include associated phone_numbers |
|  | platform_notifications | include associated platform_notifications |
|  | primary_campus | include associated primary_campus |
|  | school | include associated school |
|  | social_profiles | include associated social_profiles |


## Can Order

| ID | Name/Path | Details |
| --- | --- | --- |
|  | accounting_administrator | prefix with a hyphen (-accounting_administrator) to reverse the order |
|  | anniversary | prefix with a hyphen (-anniversary) to reverse the order |
|  | birthdate | prefix with a hyphen (-birthdate) to reverse the order |
|  | child | prefix with a hyphen (-child) to reverse the order |
|  | created_at | prefix with a hyphen (-created_at) to reverse the order |
|  | first_name | prefix with a hyphen (-first_name) to reverse the order |
|  | gender | prefix with a hyphen (-gender) to reverse the order |
|  | given_name | prefix with a hyphen (-given_name) to reverse the order |
|  | grade | prefix with a hyphen (-grade) to reverse the order |
|  | graduation_year | prefix with a hyphen (-graduation_year) to reverse the order |
|  | inactivated_at | prefix with a hyphen (-inactivated_at) to reverse the order |
|  | last_name | prefix with a hyphen (-last_name) to reverse the order |
|  | membership | prefix with a hyphen (-membership) to reverse the order |
|  | middle_name | prefix with a hyphen (-middle_name) to reverse the order |
|  | nickname | prefix with a hyphen (-nickname) to reverse the order |
|  | people_permissions | prefix with a hyphen (-people_permissions) to reverse the order |
|  | remote_id | prefix with a hyphen (-remote_id) to reverse the order |
|  | site_administrator | prefix with a hyphen (-site_administrator) to reverse the order |
|  | status | prefix with a hyphen (-status) to reverse the order |
|  | updated_at | prefix with a hyphen (-updated_at) to reverse the order |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | accounting_administrator | Query on a specific accounting_administrator |
|  | anniversary | Query on a specific anniversary |
|  | birthdate | Query on a specific birthdate |
|  | child | Query on a specific child |
|  | created_at | Query on a specific created_at |
|  | first_name | Query on a specific first_name |
|  | gender | Query on a specific gender |
|  | given_name | Query on a specific given_name |
|  | grade | Query on a specific grade |
|  | graduation_year | Query on a specific graduation_year |
|  | id | Query on a specific id |
|  | inactivated_at | Set to an ISO 8601 date or time to make the profile inactive. Set to "null" to reactivate the profile. |
|  | last_name | Query on a specific last_name |
|  | medical_notes | Query on a specific medical_notes |
|  | membership | Query on a specific membership |
|  | mfa_configured | Set to "true" or "false" to filter. Can only be viewed and queried by an Organization Administrator. |
|  | middle_name | Query on a specific middle_name |
|  | nickname | Query on a specific nickname |
|  | people_permissions | Query on a specific people_permissions |
|  | primary_campus_id | Query on a related primary_campus |
|  | remote_id | Query on a specific remote_id |
|  | search_name | Query on a specific search_name |
|  | search_name_or_email | Query on a specific search_name_or_email |
|  | search_name_or_email_or_phone_number | Query on a specific search_name_or_email_or_phone_number |
|  | search_phone_number | Query on a specific search_phone_number |
|  | search_phone_number_e164 | Query on a specific search_phone_number_e164 |
|  | site_administrator | Query on a specific site_administrator |
|  | status | Set to "inactive" to set "inactivated_at" to the current time and make the profile inactive. Set to anything else to clear "inactivated_at" and reactivate the profile. |
|  | updated_at | Query on a specific updated_at |
