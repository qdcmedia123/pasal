import request from 'supertest';
import {app} from '../../app';

it("fail when a email that does not exits supplied", async() => {
   await request(app)
       .post("/api/users/signin")
       .send({
           email: "bharatrose1@gmail.com",
           password: "password"
       })
       .expect(200)
    
});
