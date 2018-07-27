const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');
const app = express();

// CORS
const cors = require('cors')({ origin: true });
app.use(cors);

/**
 * Create todo
 */
app.post('/v1/todos', (req, res) => {
    let todosRef = admin.database().ref('todos');
    const data = req.body;
    const timestamp = new Date().getTime()
    let todo = {
        text: data.text,
        checked: false,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    res.header('Content-Type', 'application/json; charset=utf-8');
    todosRef.push(todo).then(snapshots => {
        todo.id = snapshots.key;
        res.status(201).send(todo);
    });
});

/**
 * Find todos
 */
app.get('/v1/todos', (req, res) => {
    let todosRef = admin.database().ref('todos').orderByChild('createdAt');
    todosRef.once('value', snapshots => {
        let items = [];
        snapshots.forEach(snapshot => {
            let todo = snapshot.val();
            todo.id = snapshot.key;
            items.push(todo);
        });
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(items);
    });
});

/**
 * Find todo
 */
app.get('/v1/todos/:id', (req, res) => {
    let id = req.params.id;
    let todoRef = admin.database().ref(`todos/${id}`);
    todoRef.once('value', snapshot => {
        let todo = snapshot.val();
        todo.id = snapshot.key;
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.status(200).send(todo);
    });
});

/**
 * Update todo
 */
app.put('/v1/todos/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let todoRef = admin.database().ref(`todos/${id}`);
    todoRef.once('value', snapshot => {
        let todo = Object.assign(snapshot.val(), data);
        todo.updatedAt = new Date().getTime();
        todoRef.update(todo, s => {
            todo.id = id;
            res.header('Content-Type', 'application/json; charset=utf-8');
            res.status(200).send(todo);
        });
    });
});

/**
 * Delete todo
 */
app.delete('/v1/todos/:id', (req, res) => {
    let id = req.params.id;
    let todoRef = admin.database().ref(`todos/${id}`);
    todoRef.remove(() => {
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.status(200).json({ result: 'ok' });
    });
});

const main = express();
main.use('/api', app);

exports.main = functions.https.onRequest(main);