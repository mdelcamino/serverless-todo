import 'source-map-support/register'
import { updateTodoUrl } from '../../businessLayer/TodoLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('create Todo Item');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const todoId = event.pathParameters.todoId


    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });

    const url = await updateTodoUrl(todoId, userId)
    logger.info('todo url: ', { url: url });
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
            //'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: url
        })

    }

}


