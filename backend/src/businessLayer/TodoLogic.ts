import * as uuid from 'uuid';

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/TodoAccess';

import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('todosBusinessLayer');

const todoAccess = new TodoAccess();

export async function updateTodoUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Entering updateTodoUrl function');
    const url = await todoAccess.updateTodoUrl(todoId, userId);
    return url;
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Entering getTodos function');
    return todoAccess.getTodos(userId)
}
export async function deleteTodo(todoId: string, userId: string) {
    logger.info('Entering deleteTodo function');
    return await todoAccess.deleteTodo(todoId, userId);
}
export async function createTodo( createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

    logger.info('Entering createTodo function');

    const todoId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
     });
}

export async function updateTodo( todoId: string,  updateTodoRequest: UpdateTodoRequest, userId: string
){

    logger.info('Entering updateTodo function');

    await todoAccess.updateTodo({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done,
    },
        todoId,
        userId);
}
