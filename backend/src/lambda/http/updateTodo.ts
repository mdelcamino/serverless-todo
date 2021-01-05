import 'source-map-support/register'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { updateTodo } from '../../businessLayer/TodoLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('update Todo Item');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    await updateTodo(todoId, updatedTodo, userId)
    logger.info('updated todo: ', { updatedTodo: updatedTodo });

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''

    };

}
