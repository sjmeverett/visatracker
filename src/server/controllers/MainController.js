
import * as web from 'express-decorators';
import {config} from 'src/server';
import HolidayFeed from 'uk-bank-holidays';
import moment from 'moment';
import ProcessingTimesScraper from './lib/ProcessingTimesScraper';
import regression from './lib/regression';
import 'moment-weekday-calc';

let cacheDate;
let cacheValue;
let cacheDays;

require('bluebird').longStackTraces();

@web.controller('/')
export default class MainController {
  constructor() {
    this.scraper = new ProcessingTimesScraper(config.url);
  }

  @web.get('/')
  async getPercentAction(request, response) {
    let value;
    let days;

    if (cacheDate && cacheDate.isSame(moment(), 'day')) {
      value = cacheValue;
      days = cacheDays;

    } else {
      let feed = new HolidayFeed();
      await feed.load();

      let holidays = feed
        .divisions('england-and-wales')
        .holidays(config.submitted)
        .map((x) => x.date);

      days = moment().weekdayCalc({
        rangeStart: config.submitted,
        rangeEnd: moment().format('YYYY-MM-dd'),
        weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        exclusions: holidays
      });

      let data = await this.scraper.getData();
      let predict = regression(data);
      value = Math.round(predict(days));

      cacheValue = value;
      cacheDays = days;
      cacheDate = moment();
    }

    response.render('index', {days, value});
  }
};
