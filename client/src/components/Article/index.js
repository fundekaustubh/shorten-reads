import React from "react";
import './styles.css';
const Article = ({ article, key }) => {

    const monthMapping = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    /**
     * Modifies the format of a date string.
     *
     * @param {String} date - The original date string.
     * @return {String} The modified date string in the format: "Month Day, Year".
     */
    const modifyDateFormat = (date) => {
        const publishingDate = new Date(date);
        return `${monthMapping[publishingDate.getMonth()]} ${publishingDate.getDate()}, ${publishingDate.getFullYear()}`;
    }

    return (
        article.author && article.description ?
            <li key={key}>
                {article.description} -
                <span className="Author"><i>{article.author} [{modifyDateFormat(article.publishedAt)}]</i></span>
            </li> :
            <li key={key}>
                {article.description}
            </li>
    );
}

export default Article;