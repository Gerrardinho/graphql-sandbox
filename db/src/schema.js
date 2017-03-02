import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import Db from './db';

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: '...',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve (author) {
                    return author.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve (book) {
                    return book.title;
                }
            },
            release: {
                type: GraphQLString,
                resolve (book) {
                    return book.release.toISOString();
                }
            },
            author: {
                type: new GraphQLList(AuthorType),
                resolve (book) {
                    return book.getAuthors();
                }
            }
        };
    }
});


const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    description: '...',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve (author) {
                    return author.id;
                }
            },
            firstName: {
                type: GraphQLString,
                resolve (author) {
                    return author.firstName;
                }
            },
            lastName: {
                type: GraphQLString,
                resolve (author) {
                    return author.lastName;
                }
            },
            email: {
                type: GraphQLString,
                resolve (author) {
                    return author.email;
                }
            },
            books: {
                type: new GraphQLList(BookType),
                resolve (author) {
                    return author.getBooks();
                }
            }
        };
    }
});

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Root query',
    fields: () => {
        return {
            authors: {
                type: new GraphQLList(AuthorType),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    }
                },
                resolve (root, args) {
                    return Db.models.author.findAll({ where: args });
                }
            },
            books: {
                type: new GraphQLList(BookType),
                resolve (root, args) {
                    return Db.models.book.findAll({ where: args });
                }
            }
        };
    }
});

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: '...',
    fields () {
        return {
            addAuthor: {
                type: AuthorType,
                args: {
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve (source, args) {
                    return Db.models.author.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase(),
                        books: args.books
                    });
                }
            }
        };
    }
});

const Schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});

export default Schema;

