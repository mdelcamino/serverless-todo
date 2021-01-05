import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

//const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import {  TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

    constructor(
        private readonly s3_image = process.env.IMAGES_S3_BUCKET,
        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4' // Use Sigv4 algorithm
        }),
        private readonly expirationtime = parseInt(process.env.SIGNED_URL_EXPIRATION),
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
      
          const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId', 
            ExpressionAttributeValues: { ':userId': userId },
            ScanIndexForward: false
           }).promise()
            const items = result.Items
            return items as TodoItem[]    
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()

        return todo
    }

    async deleteTodo(todoId: string, userId: string) {
   
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise();

           }
    async updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
        var params = {
            TableName: this.todoTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
           
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done,
            }
        };


        this.docClient.update(params, function (err, data) {
            if (err) console.log(err);
            else console.log(data);
        });

    }



    async updateTodoUrl(todoId: string, userId: string): Promise<string> {

        const url = this.s3.getSignedUrl("putObject", {
            Bucket: this.s3_image,
            Key: todoId,
            Expires: this.expirationtime
        });
        await this.docClient.update({
            TableName: this.todoTable,
            Key: { userId, todoId },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
                ":URL": url.split("?")[0]
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
    return url;
    }
    
}

