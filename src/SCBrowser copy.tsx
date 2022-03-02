import React from 'react';
import { Octokit } from "@octokit/rest";
import queryString from 'querystring'
import {CatalogConnection, catalogList, ICatalogCollection, catalogEntry, IManifest} from './catalogHelpers'
import CatalogCollection from './CatalogCollection';
import CatalogItem from './CatalogItem';
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

//TO DO: Make these config items
const repoOrg = "egUnicorn";
const catalogRepo = "platform-svc-cat"
//TO DO: Make this oAuth
//const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });

export default class SCBrowser extends React.Component<{}, {catalog: catalogList | null, catalogPath: string | null}> {

    constructor(props: any) {
        const {location: {search }} = props
        const searchParams = new URLSearchParams(search)
        super(props);
        this.state = {
            catalog: null,
            catalogPath: searchParams.get("catalogPath")
        };
    }

    async componentDidMount() {
        //
        //octokit.rest.repos.get({
        //    owner: repoOrg,
        //    repo: repo
        //  })
        /* octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            //octokit.request('GET /orgs/{org}/repos', {
            owner: repoOrg,
            repo: catalogRepo,
            path: ''
          })
          .then(({ data }) => {
            // handle data
            console.log(data);
          });
          */
         //const search = useLocation().search
         //let catalogPath = new URLSearchParams(search).get('catalogPath');

         let catalogPath = "";

         if (!catalogPath) { catalogPath = "/"}
         const conn = new CatalogConnection();
         conn.browseCatalog(catalogPath).then(result => this.setState({catalog: result}));

         
         //let x: manifest =  conn.browseCatalog().then(console.log("yo"));
         //let x:manifest = conn.browseCatalog().then(function(result) {
         //   return result
         //});

         //this.setState({y: x})
         /*const getCatalog = async() => {
            const response = await conn.browseCatalog();
            this.setState({y: response});
            console.log(response);
         }*/
         //conn.browseCatalog().then(function (result:manifest) {
            
            //console.log(x);
            //this.setState({y: x});
        // })
         
    }

    CatalogItemElement(item: catalogEntry) {
        if (item.type == "dir") {
            return <CatalogCollection/>
        } else if (item.type == "file") {
            return <CatalogItem {...item}/>
        }
    }

    CatalogCurrentItem(manifest: IManifest) {
        return
            <h2>Hello!</h2>;
        
    }
    render() {


        if (this.state.catalog === null) {
            return (
                <p>Loading...</p>
            )
        }

        if (!Array.isArray(this.state.catalog)) {
            return(
                <p>Error loading Catalog - empty!</p>
            )
        }
        
        else {       
            let catalogItems = this.state.catalog.map((item: catalogEntry) => {
                if (item.type == "dir") {
                    //return <CatalogCollection key={item.name} />
                    return <CatalogItem key={item.name} {...item}/>
                } 
                /*if (item.type == "file") {
                    return <CatalogItem key={item.name} {...item}/>
                } */           
            })!

            
            return (
                <div>
                    <h1>
                        Hello
                    </h1>
                    <table>
                        <tbody>
                        {catalogItems}
                        </tbody>
                    </table>
                </div>
                
            )
        }
    }
    
}


  //each directory in the repo would be a catalogue item
//for each catalogue item pull out the meta file which we use to populate the UI
//parse parameters to present in UI, inc. allowed values etc.
//trigger request