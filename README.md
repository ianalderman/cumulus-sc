# Cumulus-SC #
Sample code to put a Service Catalogue wrapper UI over a GitOps based Service Catalogue.  

## Pre-Reqs ##
You need the following environment variables at the current time (I used .env.development file for dev):

REACT_APP_GITHUB_PAT - PAT with Read access to the repo
REPO_ORG - Repo Owner / Organisation
CATALOG_REPO - Repo containing the service catalogue
MANIFEST_FILE_NAME - name of the file that contains the mainfest, e.g., manifest.json

### Manifest file ###
The manifest file is used by the app to determine what to display on screen:

```
{
    "catalogEntryType": "root",
    "name": "Platform Services",
    "description": "Platform Services Catalog!"
}
```

Valid values from catalogEntryType: ```root```, ```collection```, ```item```