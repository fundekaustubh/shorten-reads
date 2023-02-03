// Module imports.
const express = require('express');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const NewsAPI = require('newsapi');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const cors = require('cors');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

// Configurations.
const app = express();
const newsapi = new NewsAPI(process.env.NEWS_API_API_KEY);
const configuration = new Configuration({
    apiKey: process.env.SIMPLIFICATION_API_API_KEY,
});
const openai = new OpenAIApi(configuration);
const CORSWhitelist = [process.env.FRONTEND_URL];

// Middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        const originIsWhitelisted = CORSWhitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
}))

/**
 * This function checks if an attribute with the given key is present in the provided object and is not equal to null,
 * undefined, or an empty string.
 *
 * @param {Object} object - The object to check
 * @param {String} key - The key of the attribute to check for
 *
 * @returns {Boolean} True if the attribute is present and not equal to null, undefined, or an empty string. False otherwise.
 */
const checkAttributePresence = (object, key) => {
    return Object.keys(object).includes(key) && ![null, undefined, ''].includes(object[key]);
}

/**
 * This function is an asynchronous handler for fetching news articles from the News API.
 * It takes in the request and response objects and returns the articles in the form of a JSON object.
 * If the request body contains the `q` or `sources` or `domains` attribute, the function will send a request to the 
 * News API's `everything` endpoint. Otherwise, it will send a request to the `topHeadlines` endpoint.
 * In case of any errors, the function will return a 500 Internal Server Error status code with the error message.
 * @async
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} The news articles in the form of a JSON object.
 */

app.post('/articles', async (req, res) => {
    try {
        let newsAPIResponse;
        // Request body contains the query in the form of a JSON object, which will be sent to the news API.
        if (checkAttributePresence(req.body, 'q') ||
            checkAttributePresence(req.body, 'sources') ||
            checkAttributePresence(req.body, 'domains')) {
            newsAPIResponse = await newsapi.v2.everything({
                ...req.body,
                language: 'en'
            });
            newsAPIResponse['topHeadlines'] = false;
        }
        else {
            newsAPIResponse = await newsapi.v2.topHeadlines({
                ...req.body,
                language: 'en'
            })
            newsAPIResponse['topHeadlines'] = true;
        }
        return res.json(newsAPIResponse);
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).send(err);
    }
})

/**
 * This function is an asynchronous handler for the `/article` endpoint.
 * It takes in the request body, which should contain an `article` object with a `url` attribute,
 * and returns the text content of the article fetched from the given URL.
 * In case of any errors, the function will return a 500 Internal Server Error status code with the error message.
 * @async
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} An object with a `textContent` attribute containing the text content of the article.
 */

app.post('/article', async (req, res) => {
    try {
        const { article } = req.body;
        const { url } = article;
        const HTMLContentForTheArticleURL = await axios.get(url);
        const DOMContentForTheArticleURL = new JSDOM(HTMLContentForTheArticleURL.data, { url });
        const _article = new Readability(DOMContentForTheArticleURL.window.document).parse();
        return res.status(200).send({
            'textContent': _article.textContent,
            'innerHTML': _article.innerHTML
        })
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).send(err);
    }
})

/**
 * Handles POST requests to the '/simplify' endpoint.
 * Performs text simplification using the OpenAI API and returns the simplified text in the response.
 * In case of any errors, the function will return a 500 Internal Server Error status code with the error message.
 * @async
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} A JSON object containing the simplified text with a status code of 200 on success. 
 */

app.post('/simplify', async (req, res) => {
    console.log("Simplification endpoint called!");
    try {
        const { text } = req.body;
        const simplificationResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Summarize this text and don't leave any summarized sentence incomplete:\n" + text,
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        console.log("Simplified text is: ", simplificationResponse.data.choices[0].text);
        return res.status(200).send({
            'text': simplificationResponse.data.choices[0].text
        })
    }
    catch (err) {
        console.log("Error: ", err);
        return res.status(500).send(err);
    }
})

/**
 * This function logs a message to the console indicating that the server has started on the specified port.
 * The port number is taken from the `BACKEND_PORT` environment variable.
 *
 * @returns {void}
 */

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server started on port ${process.env.BACKEND_PORT}.`);
})