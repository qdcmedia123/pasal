import request from 'supertest';
import {app} from '../../app';

it('throw 400 bad request error if no email address is supplied', async() => {
   await request(app)
     .post('/api/users/reset_password')
     .send({})
     .expect(400)
});

