import React, { useEffect, useState } from "react";
import axios from 'axios';
import Loader from "../Loader";
// import { PersonPinIcon } from '@mui/icons-material';
import './styles.css';

const Article = ({ article, setExpandMode }) => {
    const [scrapedArticle, setScrapedArticle] = useState(undefined);
    const [scrapeArticleIsPending, setScrapeArticleIsPending] = useState(false);
    const [scrapeArticleError, setScrapeArticleError] = useState(undefined);
    const [isArticleToBeSimplified, setIsArticleToBeSimplified] = useState(false);
    const [simplifiedArticleText, setSimplifiedArticleText] = useState(undefined);
    const [simplifyArticleTextIsPending, setSimplifyArticleTextIsPending] = useState(false);
    const [simplifyArticleTextError, setSimplifyArticleTextError] = useState(undefined);
    const [isSimplifiedArticleToBeViewed, setIsSimplifiedArticleToBeViewed] = useState(false);

    useEffect(() => {
        if (isArticleToBeSimplified) {
            simplifyArticle();
        }
    }, [isArticleToBeSimplified])

    const simplifyArticle = async () => {
        try {
            setSimplifyArticleTextIsPending(true);
            const simplifyArticleResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/simplify`, { text: scrapedArticle.textContent });
            setSimplifiedArticleText(simplifyArticleResponse.data.text);
        }
        catch (err) {
            setSimplifyArticleTextError(err);
        }
        finally {
            setSimplifyArticleTextIsPending(false);
        }
    }


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
                <>
                    <section className="SimplificationStatusContainer">
                        {isArticleToBeSimplified ?
                            simplifyArticleTextIsPending ?
                                <section>Article is being simplified...</section> :
                                simplifyArticleTextError ?
                                    <section>Error simplifying article!</section> :
                                    isSimplifiedArticleToBeViewed ?
                                        <section>
                                            <button onClick={(e) => {
                                                setIsSimplifiedArticleToBeViewed(false);
                                            }}>Click to view the long form article...</button>
                                        </section> :
                                        <section>
                                            <button onClick={(e) => {
                                                setIsSimplifiedArticleToBeViewed(true);
                                            }}> Click to view the simplified article...</button>
                                        </section> :
                            <button onClick={(e) => {
                                setIsArticleToBeSimplified(true);
                            }}>Simplify</button>}
                    </section>
                    {isSimplifiedArticleToBeViewed === true ?
                        <main className="ArticleContent">
                            {simplifiedArticleText}
                        </main> :
                        <main className="ArticleContent">
                            {scrapedArticle.textContent}
                        </main>
                    }
                </>
            }

            {scrapeArticleIsPending && <Loader />}

            {scrapeArticleError && <section>Error!</section>}
        </article>
    );
}

export default Article;