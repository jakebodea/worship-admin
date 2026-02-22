# BirthdayPeople

- App: `people`
- Version: `2025-11-10`
- Vertex ID: `birthday_people`
- Endpoint: `https://api.planningcenteronline.com/people/v2/documentation/2025-11-10/vertices/birthday_people`
- Resource path: `https://api.planningcenteronline.com/people/v2/birthday_people`
- Collection only: `yes`
- Deprecated: `no`


## Description

Returns upcoming birthdays for the organization.

Note: This endpoint will always only return the first 15 people having a birthday in the next 30 days, ordered by birthday, ascending.


## Attributes

| Name | Type | Description | Permission |
| --- | --- | --- | --- |
| id | primary_key (e.g. primary_key) | - | public |


## Inbound Edges

| ID | Name/Path | Details |
| --- | --- | --- |
| birthdaypeople-organization-birthday_people | birthday_people | - |
