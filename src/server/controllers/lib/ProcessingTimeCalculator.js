
import HolidayFeed from 'uk-bank-holidays';
import moment from 'moment';
import ProcessingTimesScraper from './ProcessingTimesScraper';
import regression from './regression';
import 'moment-weekday-calc';


export default class ProcessingTimeCalculator {
  constructor(url, submitted) {
    this.cache = {};
    this.scraper = new ProcessingTimesScraper(url);
    this.submitted = submitted;
  }


  async calculate(to) {
    let toStr = moment(to).format('YYYY-MM-DD');

    if (!this.cache[toStr]) {
      let days = await this.getNumberOfWorkingDays(to);
      let value = await this.predict(days);

      this.cache[toStr] = {days, value};
    }

    return this.cache[toStr];
  }


  async predict(days) {
    let data = await this.scraper.getData();
    let fn = regression(data);
    return Math.round(fn(days));
  }


  async getHolidays() {
    if (!this.holidays) {
      let feed = new HolidayFeed();
      await feed.load();

      this.holidays = feed
        .divisions('england-and-wales')
        .holidays(this.submitted)
        .map((x) => x.date);
    }

    return this.holidays;
  }


  async getNumberOfWorkingDays(to) {
    return moment().weekdayCalc({
      rangeStart: this.submitted,
      rangeEnd: to,
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      exclusions: await this.getHolidays()
    });
  }
};
