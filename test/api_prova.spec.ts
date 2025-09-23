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
    it('deve responder 200 no GET /objects', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects`)
        .expectStatus(StatusCodes.OK);
    });

    it('deve responder 404 para um ID inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/objects/999999`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /objects', () => {
    it('deve adicionar um objeto e validar a resposta', async () => {
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
  });
});
