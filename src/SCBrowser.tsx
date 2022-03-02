import React from 'react';
import { Octokit } from "@octokit/rest";
import queryString from 'querystring'
import {CatalogConnection, catalogList, ICatalogCollection, catalogEntry, IManifest} from './catalogHelpers'
import CatalogCollection from './CatalogCollection';
import CatalogItem from './CatalogItem';
import PropTypes from "prop-types";


//TO DO: Make these config items
const repoOrg = "egUnicorn";
const catalogRepo = "platform-svc-cat"
//TO DO: Make this oAuth
//const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });

export default class SCBrowser extends React.Component<{}, {catalog: catalogList | null, isLoading: boolean | null, entryManifest: IManifest | null}> {

    constructor(props: any) {
       
        super(props);
        
        this.state = {
            catalog: null,
            isLoading: true,
            entryManifest: null
        };
    }

    async componentDidMount() {

        let catalogPath = decodeURI(window.location.pathname)
     
         if (catalogPath == "/") { catalogPath = ""}
        
        const conn = new CatalogConnection();
        
        await conn.getManifest(catalogPath)
            .then(manifest => {
                this.setState({entryManifest: manifest});
        })

        
        await conn.browseCatalog(catalogPath).then(result => this.setState({catalog: result}));
        this.setState({isLoading: false})
         
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


        if (this.state.isLoading) {
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
                    <CatalogCollection {...this.state.entryManifest}/>
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