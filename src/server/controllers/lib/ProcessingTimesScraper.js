
import _ from 'lodash';
import cheerio from 'cheerio';
import moment from 'moment';
import request from 'request-promise';


export default class ProcessingTimesScraper {
  constructor(url) {
    this.url = url;
    this.cacheDate = new Date(0);
  }

  async getData() {
    if (moment().diff(this.cacheDate, 'days') > 1) {
      let html = await request(this.url);
      let $ = cheerio.load(html);

      let data = $('.times-results tr')
        .get()
        .map((row) =>
          $(row)
            .find('td')
            .get()
            .map((x) => parseInt(($(x).text().match(/^([0-9]+)/) || [])[0]))
            .filter((x) => !isNaN(x))
        );

      this.cached = _.zipWith.apply(null, data, (a, b) => [a, b]);
    }

    return this.cached;
  }
};
