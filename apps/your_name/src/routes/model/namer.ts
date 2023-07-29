import * as rand from '../utils/rand';

export interface Book {
  content: string;
  title: string;
  author: string;
  book: string;
  dynasty: string;
}

export type NameObj = Partial<
  Book & { name: string | undefined; sentence: string }
>;

export class Namer {
  book: Book[] | null = null;

  constructor(book: Book[]) {
    this.book = book;
  }

  formatStr(str: string) {
    let res = str.replace(/(\s|　|”|“){1,}|<br>|<p>|<\/p>/g, '');
    res = res.replace(/\(.+\)/g, '');
    return res;
  }

  splitSentence(content: string) {
    if (!content) {
      return [];
    }
    let str = this.formatStr(content);
    str = str.replace(/！|。|？|；/g, s => `${s}|`);
    str = str.replace(/\|$/g, '');
    let arr = str.split('|');
    arr = arr.filter(item => item.length >= 2);
    return arr;
  }

  // 清除标点符号
  cleanPunctuation(str: string) {
    const puncReg = /[<>《》！*(^)$%~!@#…&%￥—+=、。，？；‘’“”：·`]/g;
    return str.replace(puncReg, '');
  }

  cleanBadChar(str: string) {
    const badChars =
      '胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱'.split(
        '',
      );
    return str
      .split('')
      .filter(char => badChars.indexOf(char) === -1)
      .join('');
  }

  genName(): NameObj {
    if (!this.book) {
      return {};
    }
    // const len = this.book.length;
    try {
      const passage = rand.choose<Book>(this.book);
      const { content, title, author, book, dynasty } = passage;
      if (!content) {
        return {};
      }

      const sentenceArr = this.splitSentence(content);

      if (!(Array.isArray(sentenceArr) && sentenceArr.length > 0)) {
        return {};
      }

      // if (Array.isArray(sentenceArr) && sentenceArr.length <= 0) {
      //   log({ passage, sentenceArr });
      // }

      const sentence = rand.choose(sentenceArr);

      const cleanSentence = this.cleanBadChar(this.cleanPunctuation(sentence));
      if (cleanSentence.length <= 2) {
        return {};
      }

      // log({ content, sentence });
      // const charList = this.cleanBadChar(cleanSentence);
      const name = this.getTwoChar(cleanSentence.split(''));
      const res = {
        name,
        sentence,
        content,
        title,
        author,
        book,
        dynasty,
      };
      return res;
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  getTwoChar(arr: string[]) {
    const len = arr.length;
    const first = rand.between(0, len);
    let second = rand.between(0, len);
    let cnt = 0;
    while (second === first) {
      second = rand.between(0, len);
      cnt++;
      if (cnt > 100) {
        break;
      }
    }
    return first <= second
      ? `${arr[first]}${arr[second]}`
      : `${arr[second]}${arr[first]}`;
  }
}
