import 'source-map-support/register'
import { deleteTodo } from '../../businessLayer/TodoLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('create Todo Item');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const todoId = event.pathParameters.todoId;

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    logger.info('jwtToken: ', { jwtToken: jwtToken });

    const userId = parseUserId(jwtToken);
    logger.info('userId: ', { userId: userId });
    
    // TODO: Remove a TODO item by id
    await deleteTodo(todoId, userId)
    logger.info('todo deleted: ', { todoId: todoId });

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    };
    
}
