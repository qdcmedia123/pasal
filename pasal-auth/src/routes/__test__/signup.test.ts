import request from 'supertest';
import {app} from '../../app';

it('throw 401 error, if username and the password is not provided', async() => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
      })
      .expect(400);
      
});