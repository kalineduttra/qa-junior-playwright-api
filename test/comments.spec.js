require('dotenv').config()
const supertest = require('supertest')

const { TOKEN, BASE_URL_API, EMAIL } = process.env
const request = supertest(BASE_URL_API)

const user = { name: "usuario comentario", email: `comments.${EMAIL}`, gender: "male", status: "active" }
const post = { user_id: null, title: "titulo", body: "postagem" }
const comment = { post_id: null, name: "user comentario", email: "comment@test.com", body: "conteúdo do comentário" }
const updateCommentData = { post_id: null, name: "nome usuario atualizado", email: "comment.updt@test.com", body: "conteúdo do comentário" }

let userId
let postId
let commentId

beforeAll(async () => {
    // cria usuário e post para comentar
    const userResponse = await request
        .post('/users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(user)
    
    userId = userResponse.body.id
    post.user_id = userId
    
    const postResponse = await request
        .post('/posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(post)
    
    postId = postResponse.body.id
    comment.post_id = postId
    updateCommentData.post_id = postId
})

afterAll(async () => {
    // deleta o post e o usuário criado
    await request
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .expect(204)

    await request
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .expect(204)
})

test("POST: cria um comentário com sucesso", async() => {
    const response = await request
    .post('/comments')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(comment)
    .expect(201)
    
    commentId = response.body.id
    
    expect(response.body).toMatchObject(comment)
})

test("GET: valida que o comentário criado aparece na listagem", async () => {
    const response = await request
    .get('/comments')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200)
    
    const commentFound = response.body.find(c => c.id === commentId)
    expect(commentFound).toBeDefined()
    expect(commentFound).toMatchObject(comment)
})

test("UPDATE: atualiza um comentário com sucesso", async () => {
    await request
    .put(`/comments/${commentId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(updateCommentData)
    .expect(200)
    .expect((resp) => {
        expect(resp.body).toMatchObject(updateCommentData)
        expect(resp.body).toHaveProperty('id')
    })
})

test("DELETE: deleta um comentário com sucesso", async () => {
    await request
    .delete(`/comments/${commentId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(204)

    await request
    .get(`/comments/${commentId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})