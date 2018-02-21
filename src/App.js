import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import CreatePlayer from './Queries/createPlayerMutation';
import ListPlayersQuery from './Queries/listPlayersQuery';
import NewPlayerSub from './Queries/NewPlayerSubscription';
import AllPlayers from './Components/AllPlayers';
import AWSAppSyncClient from "aws-appsync";
import AppSync from './AppSync.js';
import { Rehydrated } from 'aws-appsync-react';
import { graphql, ApolloProvider, compose } from 'react-apollo';
// import * as AWS from 'aws-sdk';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <AllPlayersWithData/>
        </div>
      </div>
    );
  }
}

const client = new AWSAppSyncClient({
  url: AppSync.graphqlEndpoint,
  region: AppSync.region,
  auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: AppSync.apiKey,

      // type: AUTH_TYPE.AWS_IAM,
      // Note - Testing purposes only
      /*credentials: new AWS.Credentials({
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
      })*/

      // Amazon Cognito Federated Identities using AWS Amplify
      //credentials: () => Auth.currentCredentials(),

      // Amazon Cognito user pools using AWS Amplify
      // type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      // jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
  disableOffline: false
});


const AllPlayersWithData = compose(
  graphql(ListPlayersQuery, {
      options: {
          fetchPolicy: 'cache-and-network'
      },
      // onAdd: post => this.props.mutate({
      //   variables: post,
      //   optimisticResponse: () => ({ createPlayer: { __typename: 'Player', ups: 1, downs: 1, content: '', url: '', version: 1, ...post } }),
      // }),
      props: (props) => ({
        // posts: props.data.allPost && props.data.allPost.posts,
        players: props.data.listPlayers && props.data.listPlayers.items,
        // START - NEW PROP :
        subscribeToNewPosts: params => {
            props.data.subscribeToMore({
                document: NewPlayerSub,
                updateQuery: (prev, { subscriptionData: { data : { onCreatePlayer } } }) => ({
                      ...prev,
                      listPlayers: {
                          items: [onCreatePlayer, ...prev.listPlayers.items.filter(post => onCreatePlayer && post.id !== onCreatePlayer.id)], __typename: 'PlayerConnection' 
                        }
                  })
            });
        },
        // END - NEW PROP
    })
      
      
      
      
    //   props: (props) => ({
    //     players: props.data.listPlayers && props.data.listPlayers.items,

    //     subscribeToNewPosts: params => {
    //       return props.data.subscribeToMore({
    //           document: NewPlayerSub,
    //           updateQuery: (prev, {subscriptionData}) => {

    //             console.log('subscriptionData: '+subscriptionData.data.onCreatePlayer);
    //             if(!subscriptionData || !subscriptionData.data) {
    //               return prev;
    //             }

    //             const newItem = subscriptionData.data.onCreatePlayer;


    //             if (!prev.listPlayers.items.find((player) => player.id === newItem.id)) {
    //               let updatedPlayers = Object.assign({}, prev, {  items: [newItem, ...prev.listPlayers.items] });
    //               return updatedPlayers;
    //             } else {
    //               return prev;
    //             }
    //           }
    //       });
    //   }
    // })
  })
  )(AllPlayers);



const WithProvider = () => (
  <ApolloProvider client={client}>
      <Rehydrated>
          <App />
      </Rehydrated>
  </ApolloProvider>
);

export default WithProvider;