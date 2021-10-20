## Some Docs
https://reactnativeelements.com/docs 
I think I solved flex woes with this: https://medium.com/@peterpme/taming-react-natives-scrollview-with-flex-144e6ff76c088

This should come in handy when trying to link users to resources
https://aws.amazon.com/blogs/mobile/aws-amplify-allows-you-to-mix-and-match-authorization-modes-in-datastore/

10/14/21 => So to deal with data go to amplify backend: GrahpQlAPI. This is where you push/pull the house (???). AppSync
is where you build the schema and query the database, create dummy data here. DynamoDB is where the actual data lives. There
seems to be a natural chain of command here: AmpAdmin => AppSync => Dynamo. Good video here for creating data: https://www.youtube.com/watch?v=pZ61oDwrCK0

10/19/21 => took this out of schema? @key(name: "booksByPosition",fields: ["type","position"],queryField: "booksByPosition")
I think this was sorting the resources by position

## Bugs
PanResponder seems to give up after a few rapid touches. Not completely bulletproof. Priority: High