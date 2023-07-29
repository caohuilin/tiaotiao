/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import { Helmet } from '@modern-js/runtime/head';

import './css/index.scss';
import './css/radio.scss';
import './css/style.scss';
import { BOOKS } from './constants/books';
import {
  DefaultBook,
  DefaultFamilyName,
  DefaultNameAmount,
  LocalStarKey,
} from './constants/config';
import { Book, NameObj, Namer } from './model/namer';

const Index = () => {
  const [bookKind, setBookKind] = useState(DefaultBook);
  const [familyName, setFamilyName] = useState(DefaultFamilyName);
  const [names, setNames] = useState<NameObj[]>([]);
  const [stars, setStars] = useState<string[]>([]);

  // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const book: Book[] = require(`./json/${bookKind}.json`);

  useEffect(() => {
    const stars: string[] = JSON.parse(
      localStorage.getItem(LocalStarKey) || '[]',
    );
    setStars(stars);

    document.addEventListener('keydown', handleKeyDown);
  }, []);

  const handleNamer = () => {
    const namer = new Namer(book);
    const names = [];
    while (names.length < DefaultNameAmount) {
      const nameObj = namer.genName();
      if (nameObj.name) {
        names.push(nameObj);
      }
    }
    setNames(names);
  };

  const handleStar = (name: string) => {
    if (stars.includes(name)) {
      return;
    }
    const newStart = [...stars, name];
    localStorage.setItem(LocalStarKey, JSON.stringify(newStart));
    setStars(newStart);
  };

  const handleKeyDown = (event: any) => {
    if (event.code === 'Enter') {
      handleNamer();
    }
  };

  return (
    <div className="wrapper">
      <Helmet>
        <meta
          name="description"
          content="你的名字-用诗经 楚辞 唐诗 宋词起名字"
        />
        <meta name="keywords" content="起名,诗经,楚辞,唐诗,宋词" />
        <title>你的名字-用诗经 楚辞 唐诗 宋词起名字</title>
      </Helmet>
      <div className="input-container">
        <h3 className="title">
          你的名字<small> 古诗文起名V2.0</small>
        </h3>
        <div className="book-selector">
          {BOOKS.map(b => (
            <div key={b.name} className="inputGroup">
              <input
                id={b.value}
                name="book"
                type="radio"
                defaultChecked={b.value === bookKind}
                onChange={() => setBookKind(b.value)}
              />
              <label htmlFor={b.value}>{b.name}</label>
            </div>
          ))}
        </div>
        <p className="family">
          <label htmlFor="family-name">姓氏 </label>
          <input
            type="text"
            name="family-name"
            defaultValue={familyName}
            placeholder="输入姓氏"
            onChange={e => setFamilyName(e.target.value)}
          />
        </p>
        <button className="btn-go" onClick={handleNamer}>
          起名
        </button>
      </div>
      <div className="result">
        <ul className="result-container">
          {names
            .filter(n => Boolean(n) && n.name)
            .map(({ name, sentence, title, author, book, dynasty }) => {
              const allName = `${familyName}${name}`;
              return (
                <li
                  className={`name-box ${
                    stars.includes(allName) ? 'name-box-star' : ''
                  }`}
                  key={name}
                  onClick={() => handleStar(allName)}
                >
                  <h3>{allName}</h3>
                  <p className="sentence">
                    <span>「</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          sentence?.replace(
                            new RegExp(`[${name}]`, 'ig'),
                            char => `<i>${char}</i>`,
                          ) || '',
                      }}
                    ></span>
                    <span>」</span>
                  </p>
                  <div className="source-row">
                    <div className="book">
                      {book}&nbsp;•&nbsp;{title}
                    </div>
                    <div className="author">
                      [{dynasty}]&nbsp;{author || '佚名'}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Index;
