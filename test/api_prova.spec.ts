import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Objects API - Teste Básico', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.restful-api.dev';

  const payload = {
    name: 'Apple MacBook Pro 16',
    data: {
      year: 2019,
      price: 1849.99,
      'CPU model': 'Intel Core i9',
      'Hard disk size': '1 TB'
    }
  };

  p.request.setDefaultTimeout(15000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('GET /objects', () => {
    it('Deve retornar status 200 e a lista de objetos quando o /objects é acessado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects`)
        .expectStatus(StatusCodes.OK);
    });

    it('Deve retornar status 404 ao tentar buscar um objeto com um ID inexistente.', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects/999999`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    it('Deve criar e depois buscar um objeto pelo ID', async () => {
      const id = await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson(payload)
        .expectStatus(StatusCodes.OK)
        .returns('id');

      await p
        .spec()
        .get(`${baseUrl}/objects/${id}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id, name: payload.name });
    });
  });

  describe('POST /objects', () => {
    it('Deve criar um novo objeto e retornar os dados enviados na resposta.', async () => {
      await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson(payload)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: payload.name,
          data: payload.data
        });
    });

    it('Deve retornar erro 400 quando tentar criar um objeto sem payload.', async () => {
      await p
        .spec()
        .post(`${baseUrl}/objects`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });

  describe('PUT /objects', () => {
    it('Deve atualizar um objeto existente', async () => {
      const id = await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson(payload)
        .expectStatus(StatusCodes.OK)
        .returns('id');

      await p
        .spec()
        .put(`${baseUrl}/objects/${id}`)
        .withJson({
          name: 'Apple MacBook Pro 16',
          data: {
            year: 2019,
            price: 2049.99,
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
            color: 'silver'
          }
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: 'Apple MacBook Pro 16',
          data: {
            price: 2049.99,
            color: 'silver'
          }
        });
    });

    it('Deve retornar 404 ao tentar atualizar um ID inexistente', async () => {
      await p
        .spec()
        .put(`${baseUrl}/objects/999999`)
        .withJson({
          name: 'Objeto Inexistente',
          data: {
            year: 2025
          }
        })
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('PATCH /objects', () => {
    it('Deve atualizar o nome de um objeto existente', async () => {
      const id = await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson(payload)
        .expectStatus(StatusCodes.OK)
        .returns('id');

      const newName = 'Apple MacBook Pro 16 (Updated Name)';

      await p
        .spec()
        .patch(`${baseUrl}/objects/${id}`)
        .withJson({ name: newName })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id, name: newName });

      await p
        .spec()
        .get(`${baseUrl}/objects/${id}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id, name: newName });
    });

    it('Deve retornar 404 ao tentar fazer PATCH em um ID inexistente', async () => {
      await p
        .spec()
        .patch(`${baseUrl}/objects/999999`)
        .withJson({ name: 'Qualquer Nome' })
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /objects', () => {
    it('Deve excluir um objeto existente e garantir que não possa ser acessado após a exclusão.', async () => {
      const id = await p
        .spec()
        .post(`${baseUrl}/objects`)
        .withJson(payload)
        .expectStatus(StatusCodes.OK)
        .returns('id');

      await p
        .spec()
        .delete(`${baseUrl}/objects/${id}`)
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('has been deleted');

      await p
        .spec()
        .get(`${baseUrl}/objects/${id}`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    it('Deve retornar status 404 ao tentar excluir um objeto com um ID inexistente.', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/objects/999999`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });  
});
