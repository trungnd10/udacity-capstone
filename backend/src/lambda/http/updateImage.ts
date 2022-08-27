import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateImage, imageExists } from '../../businesslogic/images'
import { UpdateImageRequest } from '../../requests/UpdateImageRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const log = createLogger(`Event: ${event}`);

    const imageId = event.pathParameters.imageId
    console.log(`imageId 1: ${imageId}`)
    log.info(`imageId 2: ${imageId}`)
    const updatedImage: UpdateImageRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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

    await updateImage(imageId, userId, updatedImage)

    return {
      statusCode: 204,
      body: JSON.stringify({})
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
