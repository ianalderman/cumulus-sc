
import { Octokit } from "@octokit/rest";
import { paths, components } from '@octokit/openapi-types'

type GetRepoContentResponseDataFile = components["schemas"]["content-file"]
type GetRepoContentResponseDataDir = components["schemas"]["content-directory"]

export interface catalogItem {
    name: string,
    path: string,
    currentVersion: string
    description: string,
    owner: string | null,
    lastUpdated: string | null,
    type: string | null
}

export interface catalogCollection {
    name: string,
    path: string,
    description: string
}

export interface manifest {
    name: string,
    catalogEntryType: string,
    description: string
}
/*
export class catalogItem {
    constructor(pathToItem: string) {

    }
}*/

export class catalogConnection extends Octokit {

    repoOrg: string
    catalogRepo: string
    manifestFileName: string
    octokit: Octokit

    constructor() {
        super();
        //TO DO: Make these config items
        this.repoOrg = "egUnicorn"
        this.catalogRepo = "platform-svc-cat"
        this.manifestFileName = "manifest.json"
        //TO DO: Make this oAuth
        this.octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });
    }

    async browseCatalog(catalogPath:string = ""):  Promise<manifest> {
        //browseCatalog(catalogPath:string = ""):  manifest {
        /*this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            //octokit.request('GET /orgs/{org}/repos', {
            owner: this.repoOrg,
            repo: this.catalogRepo,
            path: catalogPath
          })*/

          //1. Read the manifest file for a given path are we looking at a collection or an item?
          let manifestPath: string

          if (catalogPath == "") {
              manifestPath = this.manifestFileName;
          } else {
              manifestPath = catalogPath + '/' + this.manifestFileName
          }

          let z = await this.octokit.rest.repos.getContent({
            mediaType: {
              format: "raw",
            },
            owner: this.repoOrg,
            repo: this.catalogRepo,
            path: manifestPath,
          })
          .then((response) => {
            const f = response.data as GetRepoContentResponseDataFile
            console.log(f);
            let manifestFile: manifest = JSON.parse(f.toString());
            console.log(manifestFile.catalogEntryType);
            return manifestFile
    
          })
          .catch(error => {
            
            console.log("Unable to load manifest! " + error);
            return error;
            //throw ("Error checking Manifes file - does it exist? Expected Manifest file name: " + this.manifestFileName + ", path: " + catalogPath);
            //return "Hello"
          });

          console.log(z);
          return z;
         //z.then(
         //    onSuccess()
        // )
          this.octokit.rest.repos.getContent({
            owner: this.repoOrg,
            repo: this.catalogRepo,
            path: catalogPath
          })
            .then((response) => {
                if (!Array.isArray(response.data)) {
                    console.log("Not An Array!")
                } else {
                    console.log("Array!")
                    
                    const repoData = response.data as GetRepoContentResponseDataDir
                    //OK this is a directory we need to load the manifest item to identify if we are at a collection or item
                    

                    repoData.forEach(function(item) {
                       console.log(item)
                    })
                }
                //console.log (response.data)
                
                //for (var x in response.data) {
                //    console.log(x);
                //}
                //return response.json();
                
            })
            
        /*.then(reponse => {
            // handle data
            data.forEach(element => {
                if (element.)
            });
            console.log (data);
            return data;
          });*/
    }
}
