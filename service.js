const fs = require('fs');

class PageReader {
  static readPage(pageFile) {   // Read data from File
    return fs.readFileSync(pageFile, 'utf8');
  }
}

class WordIndexer {
    constructor(pageFiles, excludeWordsFile) { 
      this.pageFiles = pageFiles;
    //   console.log(typeof(this.pageFiles));
      this.excludeWords = fs.readFileSync(excludeWordsFile, 'utf8').split('\n').map(word => word.trim());
      this.wordIndex = new Map();
      this.currentPage = 0;
    }
  
    indexPages() {
      for (const pageFile of this.pageFiles) { // Index array with its value
        // console.log(typeof(this.pageFile));
        const pageText = PageReader.readPage(pageFile);
        // console.log(pageText);
        const arr=["1","2","3","4","5","6","7","8","9","0","10","2010","31"];
        const words1 = pageText.toLowerCase().split(/[^\w']+/).filter(word => !this.excludeWords.includes(word));
        const words = words1.filter(word => !arr.includes(word))
        // console.log(typeof(this.excludeWords[0]));
        // console.log(words);
        this.currentPage++;
  
        for (const word of words) {
          if (!this.wordIndex.has(word)) {
            this.wordIndex.set(word, new Set());
          }
          this.wordIndex.get(word).add(this.currentPage);
          // console.log(this.wordIndex.get(word));
        }
      }
    }
  
    writeIndexToFile(outputIndexFile) { // writing whole list into index.txt File
      const sortedIndex = new Map([...this.wordIndex.entries()].sort());
      const indexLines = [...sortedIndex.entries()].map(([word, pageSet]) => {
        const pages = Array.from(pageSet).join(',');
        return `${word} : ${pages}`;
      });
      fs.writeFileSync(outputIndexFile, indexLines.join('\n'), 'utf8');
    }
  }

  class Main {
    static main() {
      const pageFiles = ['Page1.txt', 'Page2.txt', 'Page3.txt'];
     
      const excludeWordsFile = 'exclude-words.txt';
      const outputIndexFile = 'index.txt';
      const wordIndexer = new WordIndexer(pageFiles, excludeWordsFile);
      wordIndexer.indexPages();
      wordIndexer.writeIndexToFile(outputIndexFile);
    }
  }
  
  Main.main();
  