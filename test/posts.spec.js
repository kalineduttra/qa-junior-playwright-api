require('dotenv').config()
const supertest = require('supertest')

const { TOKEN, BASE_URL_API, EMAIL } = process.env
const request = supertest(BASE_URL_API)

const user = { name: "usuario post", email: `post.${EMAIL}`, gender: "male", status: "active" }
const post = { user_id: null, title: "titulo", body: "postagem" }
const updatePostData = { user_id: null, title: "titulo atualizado", body: "comentario atualizado" }

let userId
let postId

beforeAll(async () => {
    // cria usuário
    const userResponse = await request
        .post('/users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(user)
    
    userId = userResponse.body.id
    post.user_id = userId
    updatePostData.user_id = userId
})

afterAll(async () => {
    // deleta o usuário criado
    await request
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .expect(204)
})

test("POST: cria um post com sucesso", async() => {
    const response = await request
    .post('/posts')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(post)
    .expect(201)
    
    postId = response.body.id
    
    expect(response.body).toMatchObject(post)
})

test("GET: valida que o post criado aparece na listagem", async () => {
    const response = await request
    .get('/posts')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200)
    
    const postFound = response.body.find(p => p.id === postId)
    expect(postFound).toBeDefined()
    expect(postFound).toMatchObject(post)
})

test("UPDATE: atualiza um post com sucesso", async () => {
    await request
    .put(`/posts/${postId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(updatePostData)
    .expect(200)
    .expect((resp) => {
        expect(resp.body).toMatchObject(updatePostData)
        expect(resp.body).toHaveProperty('id')
    })
})

test("DELETE: deleta um post com sucesso", async () => {
    await request
    .delete(`/posts/${postId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(204)

    await request
    .get(`/posts/${postId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})