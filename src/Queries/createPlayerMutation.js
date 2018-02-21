import gql from 'graphql-tag';

export default gql`
query CreatePlayer ($id : ID!, $firstName : String!, $lastName: String!) {
createPlayer(input: {
    id: $id,
    firstName: $firstName,
    lastName: $lastName
    }) {
    _typename
    id
    firstName
    lastName
    }
}`;  