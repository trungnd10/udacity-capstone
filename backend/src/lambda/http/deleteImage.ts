import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteImage, imageExists } from '../../businesslogic/images'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    createLogger(`Event: ${event}`);

    const imageId = event.pathParameters.imageId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)
    const validImage = await imageExists(imageId, userId)

    if (!validImage) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Image does not exist'
        })
      }
    }

    await deleteImage(imageId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
