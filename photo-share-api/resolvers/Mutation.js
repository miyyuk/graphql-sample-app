const { authorizeWithGithub } = require(`../lib`)
const fetch = require('node-fetch')
require(`dotenv`).config()

module.exports = {
    async postPhoto(parent, args, { db, currentUser, pubsub }) {
        if (!currentUser) {
            throw new Error(`only an authorized user can post a photo`)
        }

        var newPhoto = {
            ...args.input,
            userID: currentUser.githubLogin,
            created: new Date()
        }

        const { insertedId } = await db.collection(`photos`).insertOne(newPhoto)
        newPhoto.id = insertedId

        pubsub.publish('photo-added', { newPhoto })

        return newPhoto
    },

    async githubAuth(parent, { code }, { db }) {
        let {
            message,
            access_token,
            avatar_url,
            login,
            name
        } = await authorizeWithGithub({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        })

        if (message) {
            throw new Error(message)
        }

        let latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url
        }

        const { acknowledged } = await db
            .collection(`users`)
            .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })

        if (!acknowledged) {
            throw new Error('db replace failed')
        }

        return { user: { ...latestUserInfo }, token: access_token }
    },

    async fakeUserAuth (parent, { githubLogin }, { db }) {
        var user = await db.collection(`users`).findOne({ githubLogin })

        if (!user) {
            throw new Error(`Cannot find user with githubLogin ${githubLogin}`)
        }

        return {
            token: user.githubToken,
            user,
        }
    },

    addFakeUsers: async (root, { count }, { db }) => {
        var randomUserApi = `https://randomuser.me/api/?results=${count}`

        var { results } = await fetch(randomUserApi)
            .then(res => res.json())
            .catch(error => console.log(error))

        var users = results.map(r => ({
            githubLogin: r.login.username,
            name: `${r.name.first} ${r.name.last}`,
            avatar: r.picture.thumbnail,
            githubToken: r.login.sha1
        }))

        await db.collection(`users`).insertMany(users)

        return users
    }
}