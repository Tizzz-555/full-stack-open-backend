const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!] 
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre) {
        return Book.find({});
      }

      return Book.find({ genres: args.genre }).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author, bookCount: 1 });
      } else {
        author.bookCount += 1;
      }

      try {
        await author.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Author validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              message: error.message,
            },
          });
        }
        throw new GraphQLError("Saving author failed", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const existingBook = await Book.findOne({
        title: args.title,
        author: author._id, // Store authors as ObjectIds
        published: args.published,
      });

      if (existingBook) {
        throw new GraphQLError("Book must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: [args.title, args.author, args.published],
          },
        });
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      });

      try {
        await newBook.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          throw new GraphQLError("Book validation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              message: error.message,
            },
          });
        }
        throw new GraphQLError("Saving book failed", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return newBook.populate("author");
    },

    editAuthor: async (root, args) => {
      const existingAuthor = await Author.findOne({ name: args.name });
      if (!existingAuthor) {
        return null;
      }

      existingAuthor.born = args.setBornTo;
      try {
        await existingAuthor.save();
      } catch (e) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }

      return existingAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
