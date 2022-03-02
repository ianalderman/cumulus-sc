
import { Octokit } from "@octokit/rest";
import { paths, components } from '@octokit/openapi-types'
import {Buffer} from 'buffer';

type GetRepoContentResponseDataFile = components["schemas"]["content-file"]
type GetRepoContentResponseDataDir = components["schemas"]["content-directory"]

/*export interface ICatalogItem {
    name: string,
    path: string,
    currentVersion: string
    description: string,
    owner: string | null,
    lastUpdated: string | null,
    type: string | null
}*/

export interface ICatalogCollection {
    name: string,
    path: string,
    description: string    
}

export interface IManifest {
    name: string,
    catalogEntryType: string,
    description: string,
    currentVersion?: string,
    owner?: string,
    lastUpdated?: string 
}

export type catalogEntry = {
  type: string
  name: string
  path: string
}

export interface ICatalogList extends Array<catalogEntry> {}

export type catalogList = ICatalogList

export class CatalogConnection extends Octokit {

    repoOrg: string
    catalogRepo: string
    manifestFileName: string
    octokit: Octokit

    constructor() {
        super();

        if (process.env.REACT_APP_REPO_ORG) {this.repoOrg = process.env.REACT_APP_REPO_ORG} else { throw "Repo Owner not set" }
        if (process.env.REACT_APP_CATALOG_REPO) {this.catalogRepo = process.env.REACT_APP_CATALOG_REPO} else { throw "Repository Name not set" }
        if (process.env.REACT_APP_MANIFEST_FILE_NAME) { this.manifestFileName = process.env.REACT_APP_MANIFEST_FILE_NAME} else { throw "Manifest filename not set"}

        //TO DO: Make this oAuth
        this.octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });
    }

    async getManifest(catalogPath: string): Promise<IManifest> {
      
      let manifestPath: string

      if (catalogPath == "") {
        manifestPath = this.manifestFileName
      } else {
        manifestPath = catalogPath + '/' + this.manifestFileName
      }
      console.log (manifestPath)
      
      let manifest = await this.octokit.rest.repos.getContent({
        owner: this.repoOrg,
        repo: this.catalogRepo,
        path: manifestPath
      })
      .then((response) => {
        const manifestContent = response.data as GetRepoContentResponseDataFile
        let manifestObject: IManifest = JSON.parse(Buffer.from(manifestContent.content, 'base64').toString());
        return manifestObject
      })
      .catch(error => {
        console.log("Unable to load manifest! " + error);
        return error;
      });
      return manifest
    }

    async browseCatalog(catalogPath:string = ""):  Promise<catalogList> {
      
      let catalog = await this.octokit.rest.repos.getContent({
          owner: this.repoOrg,
          repo: this.catalogRepo,
          path: catalogPath
        })
          .then((response) => {
              if (!Array.isArray(response.data)) {
                  console.log("Not An Array!")
              } else {
                  let catalogContent: catalogList = new Array<catalogEntry>();

                  const repoData = response.data as GetRepoContentResponseDataDir
                  
                  repoData.forEach(function(item) {
                    let newItem: catalogEntry = {
                      type: item.type,
                      name: item.name,
                      path: item.path
                    }

                    catalogContent.push(newItem);
                  })
                  console.log("We have content!")
                  return catalogContent
              }              
          })
          .catch(error => {
            console.log("Unable to load catalog! " + error);
            return error;
          });
        return catalog;
  }
}


//type of html element can be inferred.  By default it is a text box, if it is secure it is a masked textbox.  If there are allowed values it is a select
export interface IParameterObject {
  name: string;
  dataType: string;
  secure: boolean;
  description: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  allowedValues?: string[]
}

export interface IParameterList extends Array<IParameterObject> {}


type objectParameterObject = {
  name: string;
  value: object;
}

export class parameterObject {

  name: string;
  dataType: string;
  secure: boolean;
  description: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  allowedValues?: string[]

  constructor() {
    this.name = "";
    this.description = "";
    this.required = false;
    this.dataType = "";
    this.secure = false;
    
  }
}

export class BicepParameterParser {
  async parseParameterFile(fileURL: string) {
    //const url = "http://www.puzzlers.org/pub/wordlists/pocket.txt"
    fetch(fileURL)
      .then( fileObject => fileObject.text() )
      .then( fileText => {
        const lines = fileText.split("\n");

        let decoratingAllow:boolean = false;
        let parameterWIP: boolean = false;
        let newParameter = new parameterObject();
        let parameterList: IParameterList = [];
        let allowList: string[] = [];

        lines.forEach(function (line) {
        
          if(line.length > 0) {    
            if (decoratingAllow) {
              if (line.substring(0,1) == "]") {
                decoratingAllow = false;
              } else {
                const startPos = line.indexOf("\"")
                const endPos = line.lastIndexOf("\"")
                allowList.concat(line.substring(startPos,endPos+1))
              }
            }

            if (line.length > 5) {
              if (line.substring(0,5) == "param") {
                  if (!parameterWIP) {
                    newParameter = new parameterObject();
                    parameterWIP = true;
                  }
                  
                  let paramParts: string[] = line.split(" ");

                  if (paramParts[1] == "") {
                    throw 'Malformed Parameter line - unable to determine parameter name.  Ensure there is only single spaces between values'
                  }

                  newParameter.name = paramParts[1]
                  newParameter.dataType = paramParts[2]
                  
                  if (paramParts.length == 5) {
                    newParameter.defaultValue = paramParts[4]
                  }
                  parameterList.concat(newParameter);

                  //re-init tracking values
                  allowList = [];
                  decoratingAllow = false;
                  parameterWIP = false;
                  newParameter = new parameterObject();
              }
            }

            if (line.substring(0,1) == "@")  {
              //decoratingParamter = true;

              if (!parameterWIP) {
                newParameter = new parameterObject();
                parameterWIP = true;
              }

              const bracketIndex = line.indexOf("(");
              const endBracketIndex = line.lastIndexOf(")")
              const decorator = line.substring(1,bracketIndex)
              const value = line.substring(bracketIndex + 1, endBracketIndex)

              switch (decorator.toLowerCase()) {
                case "allowed":
                  decoratingAllow = true;
                  break;
                case "description":
                  newParameter.description = value
                  break;
                case "maxlength":
                  newParameter.maxLength = parseInt(value)
                  break;
                case "maxvalue":
                  newParameter.maxValue = parseInt(value)
                  break;
                case "metadata":
                  break;
                case "minlength":
                  newParameter.minLength = parseInt(value)
                  break;
                case "minvalue":
                  newParameter.maxLength = parseInt(value)
                  break;
                case "secure":
                  newParameter.secure = true;
                  break;
              }
            }
          }
        });
        return parameterList;
      }); 
  }
};