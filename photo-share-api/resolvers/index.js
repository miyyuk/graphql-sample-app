const Query = require('./Query')
const Mutation = require('./Mutation')
const Type = require('./Type')

const resolvers = {
    Query,
    Mutation,
    Subscription: {
        newPhoto: {
            subscribe: (parent, args, { pubsub }) => {
                return pubsub.asyncIterator('photo-added')
            }
        }
    },
    ...Type
}

module.exports = resolvers