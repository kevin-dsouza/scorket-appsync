import gql from 'graphql-tag';

export default gql`
subscription NewPlayerSub {
    onCreatePlayer {
        id
        firstName
        lastName
    }
}`;