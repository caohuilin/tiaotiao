/* eslint-disable react/no-danger */
import { useState } from 'react';
import { Helmet } from '@modern-js/runtime/head';

import './css/index.scss';
import './css/radio.scss';
import './css/style.scss';
import { BOOKS } from './constants/books';
import {
  DefaultBook,
  DefaultFamilyName,
  DefaultNameAmount,
} from './constants/config';
import { Book, NameObj, Namer } from './model/namer';

const Index = () => {
  const [bookKind, setBookKind] = useState(DefaultBook);
  const [familyName, setFamilyName] = useState(DefaultFamilyName);
  const [names, setNames] = useState<NameObj[]>([]);

  // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const book: Book[] = require(`./json/${bookKind}.json`);

  console.log(book);
  console.log('nameObj', names);

  const handleNamer = () => {
    const namer = new Namer(book);
    const names = [];
    for (let i = 0; i < DefaultNameAmount; i++) {
      names.push(namer.genName());
    }
    setNames(names);
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
          {names.map(({ name, sentence, title, author, book, dynasty }) => {
            return (
              <li className="name-box" key={name}>
                <h3>
                  {familyName}
                  {name}
                </h3>
                <p className="sentence">
                  <span>「</span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        sentence?.replace(
                          new RegExp(`[${name}]`, 'ig'),
                          char => `<i>${char}</i>`,
                        ) || '',
                    }}
                  ></div>
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
