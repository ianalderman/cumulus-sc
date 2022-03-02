import React from 'react';
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {catalogEntry, CatalogConnection} from './catalogHelpers'
import { faFolder } from '@fortawesome/free-solid-svg-icons';

export default class CatalogItem extends React.Component<{}, {entry: catalogEntry, name: string, type: string, path: string, description: string, isLoading: boolean}> {
    constructor(props: catalogEntry) {
        super(props);
        this.state = {
            entry: props,
            name: props.name,
            type: props.type,
            description: "",
            path: props.path,
            isLoading: true
        }
    }

    async componentDidMount() {

        const conn = new CatalogConnection();
        //if type  is collectiopn path is name of folder, else if type=item we need the local manifest file
        let manifestPath: string = ""

        /*if (this.state.type == "collection") {
          manifestPath = this.state.path  
        } else {
            manifestPath = "";
        }*/
        
        if (this.state.type == "dir") {
            conn.getManifest(this.state.path)
                .then(manifest => {
                    this.setState({description: manifest.description, isLoading: false});
                })
        }
        
        
    }

    render() {
        console.log(this.state.type)
        if (this.state.type == "item") {
            return(
                <tr>
                    <td><FontAwesomeIcon icon="file-code"/></td>
                    <td>
                        <b>{this.state.name}</b>
                        <br/>
                        <i>{this.state.description}</i>
                    </td>
                </tr>
            )
        }

        if (this.state.type == "dir") {
            let nextLink: string = "/" + this.state.path //.replace("/","_")
            console.log(nextLink)
            return(
                <tr>
                    <td><FontAwesomeIcon icon="folder"/></td>
                    <td>
                        <b><a href={nextLink}>{this.state.name}</a></b>
                        <br/>
                        <i>{this.state.description}</i>
                    </td>
                </tr>
            )
        }

        return(
            <tr>
                <td><FontAwesomeIcon icon="exclamation-triangle"/></td>
            </tr>
        )
    }
}