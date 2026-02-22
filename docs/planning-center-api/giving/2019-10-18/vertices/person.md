# Person

- App: `giving`
- Version: `2019-10-18`
- Vertex ID: `person`
- Endpoint: `https://api.planningcenteronline.com/giving/v2/documentation/2019-10-18/vertices/person`
- Resource path: `https://api.planningcenteronline.com/giving/v2/people`
- Collection only: `no`
- Deprecated: `no`


## Description

A Planning Center `Person` record that has been added to Giving.

The `Person` object in Planning Center is so crucial that we have an entire product dedicated to managing, keeping track of, editing, and creating these records and metadata around them. For additional info, take a look at the [Planning Center People API Docs](https://developer.planning.center/docs/#/apps/people).


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| addresses | array (e.g. []) | An array of addresses for a person. Can be managed via People. Example: ```   [     {       "street_line_1": "2790 Gateway Rd",       "street_line_2": "",       "city": "Carlsbad",       "state": "CA",       "zip": "92009",       "location": "Home",       "primary": true,       "street": "2790 Gateway Rd",       "line_1": "2790 Gateway Rd",       "line_2": "Carlsbad, CA 92009"     }   ] ``` | public |
| donor_number | integer (e.g. 1) | The donor number for a person, if applicable. See our product documentation for more information on [donor numbers](https://pcogiving.zendesk.com/hc/en-us/articles/360012298634-donor-numbers). | public |
| email_addresses | array (e.g. []) | An array of email addresses for a person. Can be managed via People. Example: ```   [     {       "address": "support@planningcenter.com",       "location": "Home",       "blocked": false,       "primary": true     }   ] ``` | public |
| first_donated_at | date_time (e.g. 2000-01-01T12:00:00Z) | Timestamp of a person's first donation or `null` if they have never donated. | public |
| first_name | string (e.g. string) | A person's first name. | public |
| id | primary_key (e.g. primary_key) | The unique identifier for a person. | public |
| last_name | string (e.g. string) | A person's last name. | public |
| permissions | string (e.g. string) | The level of Giving access granted to a person. See our product documentation for more information on [permissions in Giving](https://pcogiving.zendesk.com/hc/en-us/articles/206541708-Permissions-in-Giving).  Possible values: `administrator`, `reviewer`, `counter`, or `bookkeeper` | public |
| phone_numbers | array (e.g. []) | An array of phone numbers for a person. Can be managed via People. Example: ```   [     {       "number": "(123) 456-7890",       "carrier": "PC Mobile",       "location": "Mobile",       "primary": true     }   ] ``` | public |


## Relationships

| ID | Name/Path | Details |
| --- | --- | --- |
| primary_campus | primary_campus | - |


## Outbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| batchgroup-person-batch_groups | batch_groups | - |
| batch-person-batches | batches | - |
| donation-person-donations | donations | - |
| inkinddonation-person-in_kind_donations | in_kind_donations | - |
| paymentmethod-person-payment_methods | payment_methods | - |
| pledge-person-pledges | pledges | - |
| campus-person-primary_campus | primary_campus | - |
| recurringdonation-person-recurring_donations | recurring_donations | - |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| person-batchgroup-owner | owner | - |
| person-batch-owner | owner | - |
| person-inkinddonation-person | person | - |
| person-organization-people | people | - |
| person-pledge-joint_giver | joint_giver | - |


## Can Query

| ID | Name/Path | Details |
| --- | --- | --- |
|  | first_name | Query on a specific first_name |
|  | last_name | Query on a specific last_name |
