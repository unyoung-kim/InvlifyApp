const isProd = process.env.NODE_ENV === 'production'

const useAWS = isProd
const useQuickBooksProd = isProd

/* DNS */
const localDomain = 'https://774b-24-17-127-170.ngrok-free.app'
const AWSDomain = 'https://locavorapi.com'
const domainToUse = useAWS ? AWSDomain : localDomain

/* Pub/Sub */
const localPubSubSubscription =
  'projects/gmail-api-sandbox-391202/subscriptions/my-sub'
const AWSPubSubSubscription =
  'projects/gmail-api-sandbox-391202/subscriptions/invlify-prod-sub'
const pubSubSubscriptionToUse = useAWS
  ? AWSPubSubSubscription
  : localPubSubSubscription

const localPubSubTopic = 'projects/gmail-api-sandbox-391202/topics/my-topic'
const AWSPubSubTopic = 'projects/gmail-api-sandbox-391202/topics/invlify-prod'
const pubSubTopicToUse = useAWS ? AWSPubSubTopic : localPubSubTopic

/* QuickBooks */
const quickbooksClientId = useQuickBooksProd
  ? process.env.INTUIT_CLIENT_ID_PROD
  : process.env.INTUIT_CLIENT_ID
const quickbooksClientSecret = useQuickBooksProd
  ? process.env.INTUIT_CLIENT_SECRET_PROD
  : process.env.INTUIT_CLIENT_SECRET

module.exports = {
  domainToUse,
  pubSubSubscriptionToUse,
  pubSubTopicToUse,
  quickbooksClientId,
  quickbooksClientSecret,
  useQuickBooksProd,
}
