
import {expect} from 'chai';
import ProcessingTimesScraper from '../src/server/controllers/lib/ProcessingTimesScraper';

describe('ProcessingTimesScraper', function () {
  describe('getData', function () {
    this.timeout(10000);

    it('should get the data', async function () {
      let scraper = new ProcessingTimesScraper('https://visa-processingtimes.homeoffice.gov.uk/y/united-states/settlement-visas/settlement');
      let data = await scraper.getData();
      console.log(data);
    });
  });
});
