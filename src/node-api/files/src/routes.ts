import { Application, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Book } from './index.types';

const writeFile = promisify(fs.writeFile),
       readFile = promisify(fs.readFile);

const booksSourcePath = path.join(__dirname, 'mock/books.json');


type Router = (app: Application) => void;

export const routeApp: Router = (app: Application): void => {
    app.get('/', async (_: Request, res: Response) => {
        const booksJson     = await readFile(booksSourcePath, { encoding: 'utf-8' });
        const books: Book[] = JSON.parse(booksJson);

        res.status(200).send(
            `<body><ul>${books.map(book => `<li>${book.title}, ${book.year}</li>`).join('')}</ul></body>`
            );
    });

    app.get('/books', async (_: Request, res: Response) => {
        const booksJson     = await readFile(booksSourcePath, { encoding: 'utf-8' });
        const books: Book[] = JSON.parse(booksJson);

        res.status(200).json(books);
    });

    app.get('/book/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({error: 'ID route parameter is needed (value from 1-100'});
        } else {
            const booksJson = await readFile(booksSourcePath, { encoding: 'utf-8' });
            const books: Book[] = JSON.parse(booksJson);
            const book = books.find(b => b.id === Number(id));
            book ? res.status(200).json(book) : res.status(404).json({ err: 'Book not found' });
        }
    });

    app.post('/book', async (req: Request, res: Response) => {
        const book: Book = req.body;

        if (!book) {
            res.status(400).json({error: 'Invalid POST request'});
        } else {
            const booksJson = await readFile(booksSourcePath, { encoding: 'utf-8' });
            const books: Book[] = JSON.parse(booksJson);
            const maxId = Math.max(...books.map(b => Number(b.id)));
            const bookToAdd = { ...book, id: maxId + 1 };

            await writeFile(booksSourcePath, JSON.stringify(books.concat(bookToAdd)));
            res.status(200).json({ book: bookToAdd });
        }
    });

    app.put('/book/:id', async (req: Request, res: Response) => {
        const { id }        = req.params;
        const booksJson     = await readFile(booksSourcePath, { encoding: 'utf-8' });
        const books: Book[] = JSON.parse(booksJson);
        const updateIdx     = books.findIndex(book => book.id === Number(id));

        if (updateIdx > -1) {
            const updatedBook = { ...books[updateIdx], ...req.body  };
            books.splice(updateIdx, 1, updatedBook);
            await writeFile(booksSourcePath, JSON.stringify(books));
            res.status(200).json({ id });
        } else {
            res.json({ error: `Book with id: ${id} not found.`});
        }
    });

    app.delete('/book/:id', async (req: Request, res: Response) => {
        const { id }        = req.params;
        const booksJson     = await readFile(booksSourcePath, { encoding: 'utf-8' });
        const books: Book[] = JSON.parse(booksJson);
        const deletionIdx   = books.findIndex(book => book.id === Number(id));

        if (deletionIdx > -1) {
            books.splice(deletionIdx, 1);
            await writeFile(booksSourcePath, JSON.stringify(books));
            res.status(200).json({ id });
        } else {
            res.json({ error: `Book with id: ${id} not found.`});
        }
    });
};
