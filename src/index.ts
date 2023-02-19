import express, { Request, Response } from 'express';
import createDb from './common/db/database';
import { User } from './common/db/schemas/user.schema';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const port = 3001;

createDb();

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

app.use(cors()); // Not save to leave like this in prod, add whitelist
app.use(express.json());
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/register', async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, // hashing and salting will be done in User model
      });
      await user.save();
      res.status(201).send({ data: user, message: 'Registration successful!' });
    } else {
      res.status(409).send({ data: null, message: 'User with that email already exists.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: null, message: 'Error occurred while creating user.' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send({ data: null, message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await user.comparePassword(req.body.password);
    if (!isPasswordValid) {
      res.status(400).send({ message: 'Invalid email or password' });
      return;
    }

    req.session.userId = user._id;
    res.send({ data: user, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: null, message: 'An error occurred while logging in' });
  }
});

app.post('/logout', async (req: Request, res: Response) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ data: null, message: 'An error occurred while logging out.' });
        return;
      }

      res.send({ data: { success: true }, message: 'Logout successful.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while logging out' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
