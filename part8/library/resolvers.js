const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const { GraphQLError } = require("graphql");
const Author = require("./models/author");
const Book = require("./models/book");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre) {
        return Book.find({}).populate("author");
      }

      return Book.find({ genres: args.genre }).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id });
      return books.length;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
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

      const populatedBook = await newBook.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });

      return populatedBook;
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const existingAuthor = await Author.findOne({ name: args.name });
      if (!existingAuthor) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      existingAuthor.born = args.setBornTo;
      try {
        await existingAuthor.save();
      } catch (error) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            message: error.message,
          },
        });
      }

      return existingAuthor;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw (
          (new GraphQLError("Creating the user failed"),
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              message: error.message,
            },
          })
        );
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
