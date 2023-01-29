import './styles.css';
import { useEffect, useRef } from 'react';

function App() {
  const searchText = useRef(null);
  const searchStartingDate = useRef(null);
  const searchEndingDate = useRef(null);
  const searchType = useRef(null);

  const handleSearch = async (evt) => {
    evt.preventDefault();
    // include sources as well
    const searchBody = {
      q: searchText.current.value,
      from: searchStartingDate.current.value,
      to: searchEndingDate.current.value,
      sortBy: searchType.current.value
    };
    const articles = [];
    return articles;
  }

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <input type="text" ref={searchText} />
        <input placeholder="From" type="date" ref={searchStartingDate} />
        <input placeholder="To" type="date" ref={searchEndingDate} />
        <select ref={searchType}>
          <option value="popularity" selected>Popularity</option>
          <option value="relevancy">Relevancy</option>
          <option value="publishedAt">Published At</option>
        </select>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
