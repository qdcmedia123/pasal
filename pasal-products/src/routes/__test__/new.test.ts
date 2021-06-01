
import {app} from '../../app';
import request from 'supertest';


it('throw 401 un autorized error when there is no authentication', async() => {
    await request(app)
     .post('/api/products/v1/new')
     .send({})
     .expect(401);
});