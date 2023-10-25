import { gql } from "@apollo/client";

export const ALL_POSTS = gql`
    query AllPosts {
        posts: AllPosts {
            _id
            text
            user
            parentPost
            createdAt
        }         
    }
`