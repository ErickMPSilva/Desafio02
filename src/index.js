const express = require('express')
const { uuid, isUuid } = require('uuidv4')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

function validateRepoId(request, response, next) {
    const { id } = request.params

    if(!isUuid(id)) {
        return response.status(400).json({ error: "Invalida ID" })
    }
    return next()
}

function blockLikeUpdate(request, response, next) {
    const body = request.body

    if(body.likes != null) {
        console.log('aqui')
        return response.status(400).json({ error: "Invalid Update: You can't update the likes"})
    }

    return next()
}

function blockIdUpdate(request, response, next) {
    const body = request.body

    if(body.id != null) {
        console.log('aqui')
        return response.status(400).json({ error: "Invalid Update: You can't update the ID"})
    }

    return next()
}
app.use(blockLikeUpdate)

const repositories = []

app.post('/repositories', (request, response) => {
    const { title, url, techs } = request.body
    const likes = 0

    const project = {
        id: uuid(),
        title,
        url,
        techs,
        likes
    }
    repositories.push(project)

    return response.json(project)
})

app.get('/repositories', (request, response) => {
    return response.json(repositories)
})

app.put('/repositories/:id', validateRepoId, (request, response) => {
    const { id } = request.params
    const { title, url, techs } = request.body

    const projectIndex = repositories.findIndex(project => project.id == id)

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' })
    }

    const project = {
        id,
        title,
        url,
        techs,
        likes: repositories[projectIndex].likes
    }
    
    repositories[projectIndex] = project

    return response.json(project)
})

app.delete('/repositories/:id', validateRepoId, (request, response) => {
    const { id } = request.params

    const projectIndex = repositories.findIndex(project => project.id == id)

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' })
    }

    repositories.splice(projectIndex, 1)
    
    return response.status(204).send()
})

app.post('/repositories/:id/likes', validateRepoId, (request, response) => {
    const { id } = request.params
    const { title, url, techs } = request.body

    const projectIndex = repositories.findIndex(project => project.id == id)

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' })
    }

    like = repositories[projectIndex].likes + 1
    
    repositories[projectIndex].likes = like

    return response.json(repositories[projectIndex])
})

app.listen(3332)
