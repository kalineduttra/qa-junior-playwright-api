require('dotenv').config()
const supertest = require('supertest')

const { TOKEN, BASE_URL_API, EMAIL } = process.env
const request = supertest(BASE_URL_API)

const user = { name: "JP", email: EMAIL, gender: "male", status: "active" }
const updateUserData = { name: "Amanda", email: EMAIL, gender: "female", status: "inactive" }

const id = {
    notFound: 12,
}

let userId

test("POST: cria um usuário com sucesso", async() => {
    const response = await request
    .post('/users')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(user)
    .expect(201)
    
    userId = response.body.id
    
    expect(response.body).toMatchObject(user)
})

test("POST: retorna status 422 e valida mensagem de erro de campo em branco" ,async () => {
    await request 
    .post('/users')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send({
        name: "Tam",
        gender: "female",
        status: "active"
    })
    .expect(422)
    .expect((resp) => {
        expect(resp.body).toMatchObject([{
            field: "email",
            message: "can't be blank"
        }])
    })
})

test("POST: retorna status 422 e valida mensagem de erro de email duplicado", async() => {
    await request
    .post('/users')
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(user)
    .expect(422)
    .expect((resp) => {
        expect(resp.body).toMatchObject([{
            field: 'email',
            message: 'has already been taken'
        }])
    })
})

test('GET: busca todos os usuários', async () => {
    await request
    .get('/users')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200)
})

test("GET: retorna status 404 para usuário não encontrado", async () => {
    await request
    .get(`/users/${id.notFound}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})

test("UPDATE: atualiza um usuário com sucesso", async () => {
    await request
    .put(`/users/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(updateUserData)
    .expect(200)
    .expect((resp) => {
        expect(resp.body).toMatchObject(updateUserData)
    })
})

test("UPDATE: retorna status 404 ao tentar atualizar usuário inexistente", async () => {
    await request
    .put(`/users/${id.notFound}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(updateUserData)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})

test("DELETE: deleta um usuário com sucesso", async () => {
    await request
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(204)

    await request
    .get(`/users/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})

test("DELETE: retorna status 404 ao tentar deletar usuário inexistente", async () => {
    await request
    .delete(`/users/${id.notFound}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(404)
    .expect((resp) => {
        expect(resp.body).toMatchObject({
            message: "Resource not found"
        })
    })
})