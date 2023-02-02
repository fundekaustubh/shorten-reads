import React, { useEffect, useState } from "react";
import axios from 'axios';
import Loader from "../Loader";
// import { PersonPinIcon } from '@mui/icons-material';
import './styles.css';

const Article = ({ article, setExpandMode }) => {
    const [scrapedArticle, setScrapedArticle] = useState(undefined);
    const [scrapeArticleIsPending, setScrapeArticleIsPending] = useState(false);
    const [scrapeArticleError, setScrapeArticleError] = useState(undefined);

    /**
     * Scrapes an article using axios and sets the scraped article data.
     * Handles errors and sets scrape article error if applicable.
     *
     * @async
     */
    const scrapeArticle = async () => {
        try {
            setScrapeArticleIsPending(true);
            const expandedArticle = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/article`, { article });
            console.log("Expanded aricle is: ", expandedArticle);
            setScrapedArticle(expandedArticle.data);
        }
        catch (err) {
            setScrapeArticleError(err);
        }
        finally {
            setScrapeArticleIsPending(false);
        }
    }

    /**
     * Formats a given timestamp into a date string with the format:
     * weekday, month date, year.
     *
     * @param {number} timestamp - The timestamp to be formatted.
     * @returns {string} - The formatted date string.
     */
    const getFormattedPublishingDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('default', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return formattedDate;
    }

    useEffect(() => {
        console.log("Use effect called for article", article);
        scrapeArticle();
    }, [article])

    return (
        <article className="Article">
            <header className="ArticleHeader">{article.title}</header>
            {
                article.author &&
                <section className="ArticleMetadata">
                    <span className="ArticleAuthor">- {article.author} </span>
                    {article.publishedAt && <span className="ArticleTimestamp">({getFormattedPublishingDate(article.publishedAt)})</span>}
                </section>
            }
            {
                scrapedArticle &&
                <main className="ArticleContent">{scrapedArticle.textContent}</main>
            }

            {scrapeArticleIsPending && <Loader />}

            {scrapeArticleError && <section>Error!</section>}
        </article>
    );
}

export default Article;