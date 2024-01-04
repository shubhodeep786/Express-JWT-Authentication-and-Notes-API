import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from './sequelize';
import User from './models/Users';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;
const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

sequelize.addModels([__dirname + "./models/users"]);

/**
 * Asynchronous function that connects to the database using Sequelize and logs a success message if the connection is established, or an error message if the connection fails.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection is established or rejects with an error if the connection fails.
 */
const connectToDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

connectToDB();

app.use(express.json());

const signToken = (data: object): string => {
  /**
   * Generates a JSON Web Token (JWT) using the provided data.
   * 
   * @param {object} data - The data to be included in the JWT payload.
   * @returns {string} The generated JWT as a string.
   */
  return jwt.sign(data, secretKey, { algorithm: 'HS256' });
};

/**
 * Verifies the authenticity of a JSON Web Token (JWT) by decoding and verifying the token using the secret key.
 * 
 * @param token - The JWT to be verified.
 * @returns The decoded token if it is valid, or null if the token is invalid or expired.
 * 
 * @example
 * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
 * const decodedToken = verifyToken(token);
 * console.log(decodedToken);
 * // Output: { userId: '1234567890', iat: 1516239022 }
 */
const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, secretKey, { algorithms: ['HS256'] }) as object;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware function to authenticate JWT token in the request header.
 * If the token is valid, the decoded token data is attached to the request object.
 * If the token is missing or invalid, appropriate HTTP responses are sent.
 * @param req - The request object containing the HTTP request information.
 * @param res - The response object used to send the HTTP response.
 * @param next - The next function to be called in the middleware chain.
 */
const authenticateToken = (req: Request, res: Response, next: () => void) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  const decodedToken = verifyToken(token);
  if (!decodedToken) return res.sendStatus(403);

  (req as any).user = decodedToken;
  next();
};

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, password } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user.id });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.use(authenticateToken);

/**
 * Retrieves all notes for the authenticated user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns An array of notes for the authenticated user.
 */
app.get('/api/notes', async (req: Request, res: Response) => {
  try {
    const notes = await User.findAll({ where: { userId: (req as any).user.userId } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

/**
 * Retrieves a specific note by its ID for the authenticated user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns import JWT_SECRET from '' A specific note for the authenticated user.
 */
app.get('/api/notes/:id', async (req: Request, res: Response) => {
  const noteId = req.params.id;
  try {
    const note = await User.findOne({ where: { id: noteId, userId: (req as any).user.userId } });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

/**
 * Creates a new note for the authenticated user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns The newly created note for the authenticated user.
 */
app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const newNote = await User.create({ ...req.body, userId: (req as any).user.userId });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new note' });
  }
});

/**
 * Updates a specific note by its ID for the authenticated user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns No content (204) if the note was successfully updated.
 */
app.put('/api/notes/:id', async (req: Request, res: Response) => {
  const noteId = req.params.id;
  try {
    const [updatedRowsCount] = await User.update(req.body, { where: { id: noteId, userId: (req as any).user.userId } });
    if (updatedRowsCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

/**
 * Deletes a specific note by its ID for the authenticated user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns No content (204) if the note was successfully deleted.
 */
app.delete('/api/notes/:id', async (req: Request, res: Response) => {
  const noteId = req.params.id;
  try {
    const deletedRowsCount = await User.destroy({ where: { id: noteId, userId: (req as any).user.userId } });
    if (deletedRowsCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

/**
 * Shares a specific note with another user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A success message if the note was successfully shared.
 */
app.post('/api/notes/:id/share', async (req: Request, res: Response) => {
  try {
    const noteId = req.params.id;
    const { sharedWithUserId } = req.body;

    const note = await User.findOne({ where: { id: noteId, userId: (req as any).user.userId } });
    if (!note) {
      return res.status(404).json({ error: 'Note not found or does not belong to the authenticated user' });
    }

    const userToShareWith = await User.findOne({ where: { id: sharedWithUserId } });
    if (!userToShareWith) {
      return res.status(404).json({ error: 'User to share with not found' });
    }

    await note.addSharedUser(userToShareWith);

    res.status(200).json({ message: 'Note shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to share the note' });
  }
});

/**
 * Searches for users based on their username.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns An array of users matching the search query.
 */
app.get('/api/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const users = await User.findAll({ 
    where: {
      username: {
        [Op.like]: `%${query}%`
      }
    }
  });
  const results = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email
  }));
  res.json(results);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
