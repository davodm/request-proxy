const axios = require("axios");
const Joi = require("joi");
const qs = require("qs");

const DEFAULT_USERAGENT = process?.env?.USER_AGENT || "Proxy-API";

// Joi schema for validating incoming requests
const requestSchema = Joi.object({
  url: Joi.string().uri().required(),
  method: Joi.string()
    .valid("GET", "POST", "PUT", "DELETE", "PATCH")
    .default("GET"),
  headers: Joi.object().optional(),
  params: Joi.object().optional(),
  body: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
  timeout: Joi.number().min(100).max(10000).default(5000),
});

exports.handler = async (event) => {
  try {
    // Validate API key
    const apiKey = event.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Forbidden: Invalid API key" }),
      };
    }

    // Parse and validate the request using Joi
    const input = JSON.parse(event.body || "{}");
    const { error, value } = requestSchema.validate(input);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      };
    }

    const {
      url,
      method,
      headers,
      params,
      body,
      timeout,
    } = value;

    // Default user agent
    if(!headers?.["User-Agent"]) {
      headers["User-Agent"] = DEFAULT_USERAGENT;
    }
    // Default content type
    if(!headers?.["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Configure request headers and options
    const requestOptions = {
      method,
      url,
      headers,
      params,
      timeout,
      data: headers?.["Content-Type"] === "application/json" ? body : qs.stringify(body),
    };

    // Make the request
    const response = await axios(requestOptions);

    // Return the response back to the client
    return {
      statusCode: response.status,
      headers: response.headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Request failed:", error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
