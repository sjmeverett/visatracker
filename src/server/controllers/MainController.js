
import * as web from 'express-decorators';
import {config} from 'src/server';
import moment from 'moment';
import ProcessingTimeCalculator from './lib/ProcessingTimeCalculator';


@web.controller('/')
export default class MainController {
  constructor() {
    this.calculator = new ProcessingTimeCalculator(config.url, config.submitted);
  }

  @web.get('/:to?')
  async getPercentAction(request, response) {
    let date = request.params.to || new Date();
    let data = await this.calculator.calculate(date);
    data.date = moment(date).format('YYYY-MM-DD');
    response.render('index', data);
  }
};
