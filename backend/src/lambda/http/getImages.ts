import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllImages } from '../../businesslogic/images'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const mainHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger(`Event: ${event}`);

  // Write your code here
  const userId = getUserId(event)
  const images = await getAllImages(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({ items: images })
  }
}

// TODO: Get all TODO items for a current user
export const handler = middy(mainHandler);
// export const handler = mainHandler;

handler.use(
  cors({
    credentials: true
  })
)
