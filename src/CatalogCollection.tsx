import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {catalogEntry, CatalogConnection, IManifest} from './catalogHelpers'

export default class CatalogCollection extends React.Component<{},{name: string, catalogEntryType: string, description: string}> {
    constructor(props: IManifest) {
        super(props);
        this.state = {
            name: props.name,
            catalogEntryType: props.catalogEntryType,
            description: props.description
        }
    }  
    //For collection need icon for collection and read the manifest from the sub dir to pull up description.

    render() {
        return(
            <div>
                <h2>{this.state.name}</h2>
                <p>{this.state.description}</p>
                <hr/>
            </div>
        )
    }
}