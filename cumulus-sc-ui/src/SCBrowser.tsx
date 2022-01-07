import React from 'react';
import { Octokit } from "@octokit/rest";

import {catalogConnection, catalogCollection, manifest} from './catalogHelpers'
//TO DO: Make these config items
const repoOrg = "egUnicorn";
const catalogRepo = "platform-svc-cat"
//TO DO: Make this oAuth
//const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_PAT });


export default class SCBrowser extends React.Component<{}, {y: manifest | null}> {
    constructor(props: any) {
        super(props);
        this.state = {
            y: null
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
         const conn = new catalogConnection();
         conn.browseCatalog().then(result => this.setState({y: result}));
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

    render() {

        if (this.state.y === null) {
            return (
                <p>Loading...</p>
            )
        }
        else {
            return (
                <p>Hello this is a {this.state.y.catalogEntryType}</p>
            )
        }
    }
    
}


  //each directory in the repo would be a catalogue item
//for each catalogue item pull out the meta file which we use to populate the UI
//parse parameters to present in UI, inc. allowed values etc.
//trigger request