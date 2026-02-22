# Organization

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `organization`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/organization`
- Resource path: `https://api.planningcenteronline.com/people/v2`
- Collection only: `no`
- Deprecated: `no`


## Description

The organization represents a single church. Every other resource is scoped to this record.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| avatar_url | string (e.g. string) | - | public |
| church_center_subdomain | string (e.g. string) | - | public |
| contact_website | string (e.g. string) | - | public |
| country_code | string (e.g. string) | - | public |
| created_at | date_time (e.g. 2000-01-01T12:00:00Z) | - | public |
| date_format | integer (e.g. 1) | - | public |
| grades | array (e.g. []) | - | public |
| id | primary_key (e.g. primary_key) | - | public |
| name | string (e.g. string) | - | public |
| time_zone | string (e.g. string) | - | public |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| address-organization-addresses | addresses | - |
| app-organization-apps | apps | - |
| backgroundcheck-organization-background_checks | background_checks | - |
| birthdaypeople-organization-birthday_people | birthday_people | - |
| campus-organization-campuses | campuses | - |
| carrier-organization-carriers | carriers | - |
| email-organization-emails | emails | - |
| fielddatum-organization-field_data | field_data | - |
| fielddefinition-organization-field_definitions | field_definitions | - |
| formcategory-organization-form_categories | form_categories | - |
| form-organization-forms | forms | - |
| household-organization-households | households | - |
| inactivereason-organization-inactive_reasons | inactive_reasons | - |
| listcategory-organization-list_categories | list_categories | - |
| list-organization-lists | lists | - |
| maritalstatus-organization-marital_statuses | marital_statuses | - |
| messagegroup-organization-message_groups | message_groups | - |
| message-organization-messages | messages | - |
| nameprefix-organization-name_prefixes | name_prefixes | - |
| namesuffix-organization-name_suffixes | name_suffixes | - |
| notecategory-organization-note_categories | note_categories | - |
| notecategorysubscription-organization-note_category_subscriptions | note_category_subscriptions | - |
| note-organization-notes | notes | - |
| person-organization-people | people | - |
| peopleimport-organization-people_imports | people_imports | - |
| personmerger-organization-person_mergers | person_mergers | - |
| phonenumber-organization-phone_numbers | phone_numbers | - |
| report-organization-reports | reports | - |
| schooloption-organization-school_options | school_options | - |
| socialprofile-organization-social_profiles | social_profiles | - |
| spamemailaddress-organization-spam_email_addresses | spam_email_addresses | - |
| organizationstatistics-organization-stats | stats | - |
| tab-organization-tabs | tabs | - |
| workflow-organization-workflows | workflows | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| organization-person-organization | organization | - |
