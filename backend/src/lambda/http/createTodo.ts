import 'source-map-support/register'
import * as uuid from 'uuid'
import { createTodo } from '../../businessLayer/TodoLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger';

const logger = createLogger('create Todo Item');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    logger.info('jwtToken: ', { jwtToken: jwtToken });

    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });
    // if user is not authenticated, error message

    if (!authorization) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: 'Not a valid user'
            })
        }
    }


        // TODO: Implement creating a new TODO item
        //TODO item fields: todoId, name, createdAt, done, dueDate, attachmenturl, userId
        const todoId = uuid.v4()
        const timestamp = new Date().toISOString()
        const done = "false"
        const newItem = {
            todoId,
            timestamp,
            done,
            userId,
            ...newTodo,//name and duedate
        }

    // Create Todo item
    const todoitem = await createTodo(newItem, userId);
    logger.info('todo item created: ', { todoitem: todoitem });

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                todoitem
            })

        }
    
}
