import gql from 'graphql-tag';

export default gql`
query ListPlayers {
    listPlayers {
        items {
            id
            firstName
            lastName
        }
    }
}`;