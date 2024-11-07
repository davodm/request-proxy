# Request Proxy API Lambda

This Lambda function acts as a proxy API that validates incoming requests, forwards them to the specified URL, and returns the response. It allows for custom headers, methods, parameters, and timeout settings, and supports both JSON and URL-encoded content types. The function is secured by an API key.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the project with the following environment variables:
```plaintext
USER_AGENT=YourUserAgent
API_KEY=YourApiKey
```

3. Deploy the Lambda function:

```bash
npm run deploy
```

It's actually updating the existing function, so you can run this command once it's created for the first time.

## Example Request

You can use [Axios](https://github.com/axios/axios) to make a sample request to the Lambda function.

```javascript
const axios = require("axios");

(async () => {
  try {
    const response = await axios.post("https://your-lambda-endpoint.amazonaws.com", {
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "GET",
      headers: { "x-api-key": "YourApiKey" },
      timeout: 5000
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
})();
```

## Request Parameters

- `url` (string, required): The URL to forward the request to.
- `method` (string, optional): HTTP method, default is `GET`. Supported values are `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
- `headers` (object, optional): Custom headers for the request. Default includes a custom `User-Agent`.
- `params` (object, optional): Query parameters.
- `body` (object/string, optional): Body content for methods like `POST`.
- `timeout` (number, optional): Request timeout in milliseconds, default is `5000`.

**Note:** Ensure you include the correct API key in the `x-api-key` header to authenticate requests.

## Response

- Returns the HTTP status code and response from the forwarded request.
- In case of errors, returns an error message and relevant status code.
