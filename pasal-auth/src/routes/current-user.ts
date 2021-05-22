import express from "express";
import {currentUser} from '@pasal/common'

const router = express.Router();


router.get("/api/users/currentuser",  currentUser, (req, res) => {
  //!req.session || !req.session.jwt is equal to
  res.send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
