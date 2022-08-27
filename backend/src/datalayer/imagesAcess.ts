import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ImageItem } from '../models/ImageItem'
import { UpdateImageRequest } from '../requests/UpdateImageRequest'

import * as AWSXRay from 'aws-xray-sdk';
const XAWS = AWSXRay.captureAWS(AWS)

// Implement the dataLayer logic
export class ImagesAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly imagesTable = process.env.IMAGE_TABLE) {
  }

  async getAllImages(userId: string): Promise<ImageItem[]> {
    console.log('Getting all images')

    const params = {
      TableName: this.imagesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }

    const result = await this.docClient.query(params).promise()

    let arr = result.Items as ImageItem[]
    arr.sort(function (a, b) {
      var keyA = new Date(a.createdAt),
        keyB = new Date(b.createdAt);
      // Compare the 2 dates (desc)
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });

    return arr
  }

  async createImage(image: ImageItem): Promise<ImageItem> {
    await this.docClient.put({
      TableName: this.imagesTable,
      Item: image
    }).promise()

    return image
  }

  async updateImage(imageId: string, userId: string, updatedImage: UpdateImageRequest): Promise<void> {
    await this.docClient.update({
      TableName: this.imagesTable,
      Key: {
        imageId,
        userId
      },
      ExpressionAttributeNames: {
        '#N': 'imageName'
      },
      UpdateExpression: 'SET #N = :imageName',
      ExpressionAttributeValues: {
        ':imageName': updatedImage.imageName,
      }
    }).promise()
  }

  async deleteImage(imageId: string, userId: string): Promise<void> {
    try {
      await this.docClient.delete({
        TableName: this.imagesTable,
        Key: {
          imageId,
          userId
        }
      }).promise()
    } catch (err) {
      createLogger(`Error while deleting document: ${err}`)
    }
  }

  async getImage(imageId: string, userId: string) {
    const result = await this.docClient
      .get({
        TableName: this.imagesTable,
        Key: {
          imageId,
          userId
        }
      })
      .promise()

    return result.Item
  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}