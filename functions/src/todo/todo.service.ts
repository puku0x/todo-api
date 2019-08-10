import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  async create(todo: Partial<Todo>): Promise<Todo> {
    const todosRef = admin.firestore().collection('todos');
    const timestamp = new Date().getTime();
    const data = {
      text: todo.text || '',
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const snapshot = await todosRef.add(data);
    return {
      ...data,
      id: snapshot.id
    };
  }

  async findAll(offset?: number, limit?: number): Promise<Todo[]> {
    const todosRef = admin
      .firestore()
      .collection('todos')
      .orderBy('createdAt');
    const snapshot = await todosRef.get();
    const todos: Todo[] = [];
    snapshot.forEach(child => {
      const data = child.data() as Todo;
      todos.push({
        ...data,
        id: child.id
      });
    });
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    const todoRef = admin
      .firestore()
      .collection('todos')
      .doc(id);
    const snapshot = await todoRef.get();
    const data = snapshot.data() as Todo;
    return {
      ...data,
      id: snapshot.id
    };
  }

  async update(id: string, todo: Todo): Promise<Todo> {
    const todoRef = admin
      .firestore()
      .collection('todos')
      .doc(id);
    const timestamp = new Date().getTime();
    const snapshot = await todoRef.get();
    const data = snapshot.data() as Todo;
    const updateData: Todo = {
      ...data,
      id: snapshot.id,
      text: todo.text,
      updatedAt: timestamp
    };
    await todoRef.update(updateData);
    return updateData;
  }

  async remove(id: string): Promise<void> {
    const todoRef = admin
      .firestore()
      .collection('todos')
      .doc(id);
    await todoRef.delete();
  }
}
