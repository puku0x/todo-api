import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

// Initialize
admin.initializeApp(functions.config().firebase);

// App
const app = express();

// CORS
app.use(cors({ origin: true }));

// Todo interface
interface Todo {
    id?: string;
    text?: string;
    checked?: boolean;
    createdAt?: number;
    updatedAt?: number;
}

/**
 * Create todo
 */
app.post('/todos', async (req, res) => {
    const todosRef = admin.firestore().collection('todos');
    const data = req.body;
    const timestamp = new Date().getTime();
    const todo: Todo = {
        text: data.text,
        checked: false,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    const snapshot = await todosRef.add(todo);
    todo.id = snapshot.id;
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send(todo);
});

/**
 * Find todos
 */
app.get('/todos', async (req, res) => {
    const todosRef = admin.firestore().collection('todos').orderBy('createdAt');
    const snapshot = await todosRef.get();
    const items = [];
    snapshot.forEach(child => {
        const todo = child.data() as Todo;
        todo.id = child.id;
        items.push(todo);
    });
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(items);
});

/**
 * Find todo
 */
app.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const todoRef = admin.firestore().collection('todos').doc(id);
    const snapshot = await todoRef.get();
    const todo = snapshot.data();
    todo.id = snapshot.id;
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(todo);
});

/**
 * Update todo
 */
app.put('/todos/:id', async (req, res) => {
    const id: string = req.params.id;
    const data = req.body;
    const timestamp = new Date().getTime();
    const todoRef = admin.firestore().collection('todos').doc(id);
    const snapshot = await todoRef.get();
    const todo: Todo = snapshot.data();
    todo.text = data.text;
    todo.updatedAt = timestamp;
    await todoRef.update(todo);
    todo.id = snapshot.id;
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(todo);
});

/**
 * Delete todo
 */
app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const todoRef = admin.firestore().collection('todos').doc(id);
    todoRef.delete();
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ result: 'ok' });
});

exports.v1 = functions.https.onRequest(app);