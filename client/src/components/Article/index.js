import React, { useEffect, useState } from "react";
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const Article = ({ article, setExpandMode }) => {
    const [scrapedArticle, setScrapedArticle] = useState(undefined);
    const [scrapeArticleIsPending, setScrapeArticleIsPending] = useState(false);
    const [scrapeArticleError, setScrapeArticleError] = useState(undefined);

    const scrapeArticle = async () => {
        try {
            // code for scraping article
            const { url } = article;
            const x = await axios.get(url);
            const dom = new JSDOM(x.data, { url });
            const _article = new Readability(dom.window.document).parse();
            console.log(_article.textContent);
            setScrapeArticleIsPending(false);
        }
        catch (err) {
            // error
            setScrapeArticleError(err);
        }
        finally {
            setScrapeArticleIsPending(false);
        }
    }

    useEffect(() => {
        console.log("Use effect called for article", article);
        scrapeArticle();
    }, [article])

    return (
        <div onClick={(e) => {
            setExpandMode(false);
        }}>Hi</div>
    );
}

export default Article;