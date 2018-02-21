import React, { Component } from 'react';
import _ from 'lodash';


class AllPlayers extends Component {
    constructor(props) {
        super(props);
        console.log("~~~~~ props: "+ props.players);
    }

    componentWillMount(){
        this.props.subscribeToNewPosts();
    }
    render() { 
        return ( <div>
            <h1> AllPlayers Component </h1>
            {_.map(this.props.players, (player, index) => {
                return <h1 key={index}> {player.firstName + " " + player.lastName} </h1>;
            })
            }
            </div> )
    }
}
 
export default AllPlayers;