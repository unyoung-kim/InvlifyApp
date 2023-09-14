const {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs')

const client = new CloudWatchLogsClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
})

const consoleLogAndSendToAWS = async (msg, { consoleLogOverride } = {}) => {
  try {
    console.log(consoleLogOverride ?? msg)

    const input = {
      logGroupName: 'invlify-server-logs',
      logStreamName: 'main',
      logEvents: [
        {
          timestamp: Date.now(),
          message: msg,
        },
      ],
    }

    const command = new PutLogEventsCommand(input)
    await client.send(command)
  } catch (error) {
    console.warn('Error logging to CloudWatch', error)
  }
}

module.exports = { consoleLogAndSendToAWS }
