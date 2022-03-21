import { LitElement, html, css } from 'lit';

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  getDocs,
  getDoc,
} from 'firebase/firestore/lite';

class FooBar extends LitElement {
  static get properties() {
    return {
      db: {
        attribute: false,
        type: Object,
      },
      depositList: {
        attribute: false,
        type: Array,
      },
      latestExchangeRate: {
        attribute: false,
        type: Object,
      },
      sortBy: {
        attribute: false,
        type: String,
      },
    };
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.depositList = [];
    this.latestExchangeRate = {};
    this.sortBy = 'time_deposit_account';
    this.init();
  }

  // createRenderRoot() {
  //   const root = super.createRenderRoot();
  //   return root;
  // }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('configinjected', this);
  }

  disconnectedCallback() {
    window.removeEventListener('configinjected', this);
    super.disconnectedCallback();
  }

  handleEvent(event) {
    const { firebaseConfig } = event.detail;
    if (
      event.type === 'configinjected' &&
      typeof firebaseConfig === 'object'
    ) {
      this.init(firebaseConfig);
    }
  }

  init(firebaseConfig) {
    if (!firebaseConfig) {
      console.warn('[Warn] firebaseConfig is not defined.');
      this.enableInject();
      return false;
    }
    let app;
    try {
      app = initializeApp(firebaseConfig);
    } catch(e) {
      console.error('[Error] Failed to initialize.', e);
      this.enableInject();
    } finally {
      this.db = getFirestore(app);
      console.info('[Info] Firebase has initialized.');

      // fetch('/api/currency')
      //   .then((res) => res.json())
      //   .then((res) => {
      //     this.latestExchangeRate = res;
      //   });
      this.latestExchangeRate = {"time":"2022/03/21 11:32","USD":28.415,"AUD":20.96,"NZD":19.55,"CNY":4.44};

      // this.getDeposits().then(res => {
      //   this.depositList = res || [];
      // });
      this.depositList = [{"time_deposit_account":"41702079119","exchange_rate":24.79032,"history":[{"interest_rate":1.82,"interest_start_year":2016,"received_gross_interest_amount":74.26,"time_deposit_amount":4080},{"received_gross_interest_amount":63.14,"interest_rate":1.52,"interest_start_year":2017,"time_deposit_amount":4154.26},{"time_deposit_amount":4217.4,"received_gross_interest_amount":64.1,"interest_start_year":2018,"interest_rate":1.52},{"interest_start_year":2019,"interest_rate":1.52,"time_deposit_amount":4281.5,"received_gross_interest_amount":65.08},{"received_gross_interest_amount":29.12,"interest_start_year":2020,"time_deposit_amount":4346.58,"interest_rate":0.67}],"terminated":false,"year":2016,"month":4,"currency":"AUD","cost":99161,"day":25},{"time_deposit_account":"41702084173","history":[{"interest_rate":1.67,"received_gross_interest_amount":66.81,"time_deposit_amount":4000.8,"interest_start_year":2016},{"received_gross_interest_amount":61.83,"time_deposit_amount":4067.61,"interest_rate":1.52,"interest_start_year":2017},{"received_gross_interest_amount":62.77,"interest_start_year":2018,"time_deposit_amount":4129.44,"interest_rate":1.52},{"interest_start_year":2019,"interest_rate":1.52,"received_gross_interest_amount":63.72,"time_deposit_amount":4192.21},{"interest_rate":0.57,"interest_start_year":2020,"time_deposit_amount":4255.93,"received_gross_interest_amount":24.26}],"currency":"AUD","month":5,"day":26,"exchange_rate":23.54282,"cost":94171,"year":2016},{"time_deposit_account":"41702089196","history":[{"time_deposit_amount":4078.92,"received_gross_interest_amount":68.12,"interest_rate":1.67,"interest_start_year":2016},{"time_deposit_amount":4147.04,"interest_start_year":2017,"received_gross_interest_amount":69.26,"interest_rate":1.67},{"received_gross_interest_amount":70.41,"interest_start_year":2018,"time_deposit_amount":4216.3,"interest_rate":1.67},{"time_deposit_amount":4286.71,"interest_rate":1.47,"received_gross_interest_amount":63.01,"interest_start_year":2019},{"received_gross_interest_amount":26.97,"interest_rate":0.62,"time_deposit_amount":4349.72,"interest_start_year":2020}],"day":28,"month":6,"cost":85229,"exchange_rate":21.3073,"year":2016,"currency":"NZD"},{"time_deposit_account":"41702105646","exchange_rate":22.89412,"month":9,"currency":"AUD","day":13,"year":2016,"cost":189366,"history":[{"interest_start_year":2016,"received_gross_interest_amount":123.84,"interest_rate":1.52,"time_deposit_amount":8147.53},{"interest_rate":1.52,"interest_start_year":2017,"received_gross_interest_amount":125.72,"time_deposit_amount":8271.37},{"interest_start_year":2018,"interest_rate":1.52,"received_gross_interest_amount":127.64,"time_deposit_amount":8397.09},{"interest_rate":1.22,"interest_start_year":2019,"time_deposit_amount":8524.73,"received_gross_interest_amount":104},{"received_gross_interest_amount":31.93,"time_deposit_amount":8628.73,"interest_start_year":2020,"interest_rate":0.37}]},{"time_deposit_account":"41702128626","history":[{"received_gross_interest_amount":125.84,"interest_start_year":2016,"time_deposit_amount":8279,"interest_rate":1.52},{"time_deposit_amount":8404.84,"received_gross_interest_amount":127.75,"interest_start_year":2017,"interest_rate":1.52},{"interest_start_year":2018,"time_deposit_amount":8532.59,"received_gross_interest_amount":129.7,"interest_rate":1.52},{"time_deposit_amount":8662.29,"interest_rate":1.07,"interest_start_year":2019,"received_gross_interest_amount":92.69},{"time_deposit_amount":8754.98,"interest_rate":0.17,"interest_start_year":2020,"received_gross_interest_amount":14.88}],"year":2016,"month":12,"exchange_rate":25.498875,"currency":"AUD","day":30,"cost":203991},{"time_deposit_account":"41702135787","exchange_rate":4.96455,"history":[{"interest_start_year":2017,"received_gross_interest_amount":666.05,"interest_rate":3.3,"time_deposit_amount":20183.21},{"time_deposit_amount":20849.26,"received_gross_interest_amount":750.57,"interest_rate":3.6,"interest_start_year":2018},{"interest_rate":2.8,"interest_start_year":2019,"time_deposit_amount":21599.83,"received_gross_interest_amount":604.8},{"interest_start_year":2020,"time_deposit_amount":22204.63,"received_gross_interest_amount":532.91,"interest_rate":2.4},{"time_deposit_amount":22737.54,"interest_rate":1.32,"received_gross_interest_amount":300.14,"interest_start_year":2021}],"currency":"CNY","month":1,"day":26,"cost":99291,"year":2017},{"time_deposit_account":"41702135924","history":[{"interest_rate":3.3,"time_deposit_amount":20145.6,"interest_start_year":2017,"received_gross_interest_amount":664.8},{"received_gross_interest_amount":749.17,"interest_start_year":2018,"interest_rate":3.6,"time_deposit_amount":20810.4},{"time_deposit_amount":21559.57,"received_gross_interest_amount":603.67,"interest_start_year":2019,"interest_rate":2.8},{"interest_rate":2.4,"interest_start_year":2020,"received_gross_interest_amount":531.92,"time_deposit_amount":22163.24},{"received_gross_interest_amount":299.58,"interest_rate":1.32,"time_deposit_amount":22695.16,"interest_start_year":2021}],"exchange_rate":4.8464,"year":2017,"currency":"CNY","day":26,"cost":96928,"month":1},{"time_deposit_account":"41702139448","month":2,"history":[{"interest_rate":3.4,"received_gross_interest_amount":680,"interest_start_year":2017,"time_deposit_amount":20000},{"time_deposit_amount":20680,"interest_start_year":2018,"received_gross_interest_amount":723.8,"interest_rate":3.5},{"received_gross_interest_amount":567.2,"interest_start_year":2019,"time_deposit_amount":21403.8,"interest_rate":2.65},{"interest_start_year":2020,"time_deposit_amount":21971,"interest_rate":2.35,"received_gross_interest_amount":516.32},{"interest_start_year":2021,"time_deposit_amount":22487.32,"interest_rate":1.32,"received_gross_interest_amount":296.83}],"cost":95722,"year":2017,"day":9,"exchange_rate":4.7861,"currency":"CNY"},{"time_deposit_account":"41702139497","month":2,"year":2017,"currency":"CNY","day":9,"cost":98309.25,"exchange_rate":4.9154625,"history":[{"interest_rate":3.4,"received_gross_interest_amount":689.46,"interest_start_year":2017,"time_deposit_amount":20278.31},{"interest_rate":3.5,"received_gross_interest_amount":733.87,"interest_start_year":2018,"time_deposit_amount":20967.77},{"time_deposit_amount":21701.64,"interest_start_year":2019,"received_gross_interest_amount":575.09,"interest_rate":2.65},{"interest_rate":2.35,"received_gross_interest_amount":523.5,"time_deposit_amount":22276.73,"interest_start_year":2020},{"interest_rate":1.32,"time_deposit_amount":22800.23,"interest_start_year":2021,"received_gross_interest_amount":300.96}]},{"time_deposit_account":"41702139504","history":[{"interest_rate":3.4,"interest_start_year":2017,"time_deposit_amount":22119.34,"received_gross_interest_amount":752.06},{"time_deposit_amount":22871.4,"interest_start_year":2018,"interest_rate":3.5,"received_gross_interest_amount":800.5},{"interest_rate":2.65,"interest_start_year":2019,"time_deposit_amount":23671.9,"received_gross_interest_amount":627.31},{"interest_start_year":2020,"received_gross_interest_amount":571.03,"interest_rate":2.35,"time_deposit_amount":24299.21},{"received_gross_interest_amount":328.29,"interest_rate":1.32,"time_deposit_amount":24870.24,"interest_start_year":2021}],"cost":104168,"day":9,"year":2017,"currency":"CNY","month":2,"exchange_rate":4.7178},{"time_deposit_account":"41702163764","year":2017,"exchange_rate":23.93204,"cost":95728,"day":26,"history":[{"received_gross_interest_amount":63.26,"time_deposit_amount":4161.97,"interest_start_year":2017,"interest_rate":1.52},{"interest_start_year":2018,"interest_rate":1.52,"received_gross_interest_amount":64.22,"time_deposit_amount":4225.23},{"time_deposit_amount":4289.45,"interest_rate":1.52,"interest_start_year":2019,"received_gross_interest_amount":65.2},{"interest_start_year":2020,"received_gross_interest_amount":29.18,"time_deposit_amount":4354.65,"interest_rate":0.67}],"month":4,"currency":"AUD"},{"time_deposit_account":"41702163804","history":[{"interest_rate":3.3,"interest_start_year":2017,"time_deposit_amount":20000,"received_gross_interest_amount":660},{"interest_start_year":2018,"received_gross_interest_amount":743.76,"interest_rate":3.6,"time_deposit_amount":20660},{"interest_rate":2.65,"time_deposit_amount":21403.76,"received_gross_interest_amount":567.2,"interest_start_year":2019},{"received_gross_interest_amount":384.49,"interest_start_year":2020,"interest_rate":1.75,"time_deposit_amount":21970.96}],"cost":87377,"exchange_rate":4.36885,"currency":"CNY","day":26,"month":4,"year":2017},{"time_deposit_account":"41702184832","year":2017,"history":[{"time_deposit_amount":20000,"interest_rate":3.4,"received_gross_interest_amount":680,"interest_start_year":2017},{"interest_start_year":2018,"time_deposit_amount":20680,"received_gross_interest_amount":765.16,"interest_rate":3.7},{"interest_start_year":2019,"interest_rate":2.55,"time_deposit_amount":21445.16,"received_gross_interest_amount":546.85},{"received_gross_interest_amount":334.28,"time_deposit_amount":21992.01,"interest_start_year":2020,"interest_rate":1.52}],"currency":"CNY","exchange_rate":4.50544,"month":7,"day":24,"cost":90109},{"time_deposit_account":"41702212233","exchange_rate":20.5089,"day":21,"currency":"NZD","month":11,"history":[{"time_deposit_amount":4000.27,"received_gross_interest_amount":66.8,"interest_rate":1.67,"interest_start_year":2017},{"interest_start_year":2018,"interest_rate":1.67,"time_deposit_amount":4067.07,"received_gross_interest_amount":67.92},{"interest_rate":1.17,"received_gross_interest_amount":48.38,"time_deposit_amount":4134.99,"interest_start_year":2019},{"time_deposit_amount":4183.37,"interest_rate":0.37,"interest_start_year":2020,"received_gross_interest_amount":15.48}],"year":2017,"cost":82036},{"time_deposit_account":"41702218228","day":14,"cost":91006,"year":2017,"currency":"CNY","history":[{"interest_rate":3.4,"received_gross_interest_amount":680,"time_deposit_amount":20000,"interest_start_year":2017},{"interest_rate":3.4,"received_gross_interest_amount":703.12,"interest_start_year":2018,"time_deposit_amount":20680},{"interest_start_year":2019,"time_deposit_amount":21383.12,"interest_rate":2.4,"received_gross_interest_amount":513.19},{"time_deposit_amount":21896.31,"received_gross_interest_amount":289.03,"interest_start_year":2020,"interest_rate":1.32}],"exchange_rate":4.55031,"month":12},{"time_deposit_account":"41702249738","day":16,"currency":"CNY","cost":92402,"exchange_rate":4.6201,"history":[{"interest_rate":3.6,"time_deposit_amount":20000,"received_gross_interest_amount":720,"interest_start_year":2018},{"received_gross_interest_amount":538.72,"interest_rate":2.6,"interest_start_year":2019,"time_deposit_amount":20720},{"interest_start_year":2020,"received_gross_interest_amount":499.58,"interest_rate":2.35,"time_deposit_amount":21258.72}],"month":3,"year":2018},{"time_deposit_account":"41702266659","history":[{"interest_start_year":2018,"received_gross_interest_amount":680,"time_deposit_amount":20000,"interest_rate":3.4},{"received_gross_interest_amount":527.34,"interest_rate":2.55,"time_deposit_amount":20680,"interest_start_year":2019},{"time_deposit_amount":21207.34,"interest_start_year":2020,"interest_rate":1.52,"received_gross_interest_amount":322.35}],"day":24,"month":5,"year":2018,"currency":"CNY","cost":93957,"exchange_rate":4.69786},{"time_deposit_account":"41702268124","currency":"CNY","history":[{"time_deposit_amount":20000,"interest_start_year":2018,"received_gross_interest_amount":720,"interest_rate":3.6},{"interest_rate":2.65,"interest_start_year":2019,"received_gross_interest_amount":549.08,"time_deposit_amount":20720},{"received_gross_interest_amount":323.29,"interest_rate":1.52,"interest_start_year":2020,"time_deposit_amount":21269.08}],"year":2018,"cost":93399,"day":1,"month":6,"exchange_rate":4.66995},{"time_deposit_account":"41702269445","history":[{"interest_rate":3.6,"time_deposit_amount":20000,"received_gross_interest_amount":720,"interest_start_year":2018},{"received_gross_interest_amount":549.08,"interest_start_year":2019,"time_deposit_amount":20720,"interest_rate":2.65},{"time_deposit_amount":21269.08,"interest_start_year":2020,"interest_rate":1.52,"received_gross_interest_amount":323.29}],"day":8,"exchange_rate":4.66397,"month":6,"currency":"CNY","cost":93279,"year":2018},{"time_deposit_account":"41702273373","exchange_rate":4.62309,"year":2018,"day":27,"currency":"CNY","history":[{"interest_start_year":2018,"received_gross_interest_amount":720,"interest_rate":3.6,"time_deposit_amount":20000},{"received_gross_interest_amount":549.08,"interest_rate":2.65,"time_deposit_amount":20720,"interest_start_year":2019},{"time_deposit_amount":21269.08,"interest_start_year":2020,"interest_rate":1.52,"received_gross_interest_amount":323.29}],"cost":92462,"month":6},{"time_deposit_account":"41702275811","year":2018,"month":7,"day":5,"exchange_rate":4.60415,"cost":92083,"history":[{"interest_start_year":2018,"time_deposit_amount":20000,"received_gross_interest_amount":740,"interest_rate":3.7},{"time_deposit_amount":20740,"received_gross_interest_amount":528.87,"interest_start_year":2019,"interest_rate":2.55},{"interest_start_year":2020,"interest_rate":1.52,"time_deposit_amount":21268.87,"received_gross_interest_amount":323.29}],"currency":"CNY"},{"time_deposit_account":"41702277601","currency":"CNY","month":7,"history":[{"interest_rate":3.7,"received_gross_interest_amount":740,"interest_start_year":2018,"time_deposit_amount":20000},{"time_deposit_amount":20740,"received_gross_interest_amount":528.87,"interest_start_year":2019,"interest_rate":2.55},{"interest_rate":1.52,"received_gross_interest_amount":323.29,"interest_start_year":2020,"time_deposit_amount":21268.87}],"cost":91485,"day":11,"year":2018,"exchange_rate":4.57424},{"time_deposit_account":"41702279757","history":[{"interest_rate":3.7,"time_deposit_amount":20000,"interest_start_year":2018,"received_gross_interest_amount":740},{"interest_start_year":2019,"time_deposit_amount":20740,"received_gross_interest_amount":528.87,"interest_rate":2.55},{"time_deposit_amount":21268.87,"interest_rate":1.52,"received_gross_interest_amount":323.29,"interest_start_year":2020}],"day":18,"cost":90946,"exchange_rate":4.54732,"month":7,"currency":"CNY","year":2018},{"time_deposit_account":"41702316457","year":2018,"day":28,"exchange_rate":20.67856,"history":[{"interest_start_year":2018,"interest_rate":1.67,"time_deposit_amount":6000,"received_gross_interest_amount":100.2},{"interest_start_year":2019,"interest_rate":1.17,"received_gross_interest_amount":71.37,"time_deposit_amount":6100.2},{"received_gross_interest_amount":22.83,"interest_start_year":2020,"interest_rate":0.37,"time_deposit_amount":6171.57}],"month":12,"currency":"NZD","cost":124071},{"time_deposit_account":"41702322937","history":[{"interest_rate":2.17,"received_gross_interest_amount":217,"time_deposit_amount":10000,"interest_start_year":2019},{"interest_start_year":2020,"time_deposit_amount":10217,"interest_rate":1.57,"received_gross_interest_amount":160.41},{"interest_rate":0.3,"time_deposit_amount":10377.41,"received_gross_interest_amount":31.13,"interest_start_year":2021}],"currency":"USD","month":1,"cost":307550,"exchange_rate":30.755,"year":2019,"day":31},{"time_deposit_account":"41702335379","day":8,"exchange_rate":30.845,"history":[{"interest_start_year":2019,"time_deposit_amount":9000,"interest_rate":2.17,"received_gross_interest_amount":195.3},{"interest_rate":0.77,"received_gross_interest_amount":70.8,"interest_start_year":2020,"time_deposit_amount":9195.3}],"cost":277605,"year":2019,"month":4,"currency":"USD"}]

      console.info('[Info] Loading data...');
    }
  }

  enableInject() {
    window.inject = function inject(firebaseConfig) {
      window.dispatchEvent(new CustomEvent('configinjected', {
        detail: {
          firebaseConfig,
        },
      }));
    }
  }

  sortByAccountAsc() {
    const dup = [...this.depositList];
    dup.sort((a, b) => a.time_deposit_account - b.time_deposit_account);
    this.depositList = dup;
  }
  // https://stackoverflow.com/questions/6129952/sort-javascript-array-by-two-numeric-fields
  sortByAccountDesc() {
    const dup = [...this.depositList];
    dup.sort((a, b) => b.time_deposit_account - a.time_deposit_account);
    this.depositList = dup;
  }
  sortByMonth() {
    const dup = [...this.depositList];
    dup.sort((a, b) => {
      if (a.month === b.month) {
        return a.day - b.day;
      }
      return a.month - b.month;
    });
    this.depositList = dup;
  }
  sortByCurrency() {
    const dup = [...this.depositList];
    dup.sort((a, b) => {
      return a.currency.localeCompare(b.currency);
    });
    this.depositList = dup;
  }

  // Create
  async createDepositAccount(timeDepositAccount, data) {
    console.log('*** createDepositAccount ***');
    await setDoc(
      doc(this.db, 'foreign-time-deposit-account', timeDepositAccount),
      data
    );
  }
  async addDepositAccount() {
    // 定期存款帳戶: <input id="time_deposit_account" type="text"><br/>
    //   幣別: <input id="currency" type="text"><br/>
    //   成本(NTD): <input id="cost" type="text"><br/>
    //   原始利率: <input id="exchange_rate" type="text"><br/>
    //   起始日期: <input id="init_date" type="text"><br/>
    const d = this.shadowRoot.getElementById('init_date').value.split('/');
    const time_deposit_account = this.shadowRoot.getElementById('time_deposit_account').value;
    const data = {
      currency: this.shadowRoot.getElementById('currency').value,
      exchange_rate: +this.shadowRoot.getElementById('exchange_rate').value,
      cost: +this.shadowRoot.getElementById('cost').value,
      year: +d[0],
      month: +d[1],
      day: +d[2],
    };
    console.log('*** addDepositAccount ***', data);
    await this.createDepositAccount(time_deposit_account, data);
    this.depositList = [{ time_deposit_account, ...data }, ...this.depositList];
  }

  // Read
  async getDeposits() {
    console.log('*** getDeposits ***');
    const depositsCol = collection(this.db, 'foreign-time-deposit-account');
    const depositSnapshot = await getDocs(depositsCol);
    const depositList = depositSnapshot.docs.map(doc => ({
      time_deposit_account: doc.id,
      ...doc.data(),
    }));
    return depositList;
  }
  async getDeposit(timeDepositAccount) {
    console.log('*** getDeposit ***');
    const depositRef = doc(this.db, 'foreign-time-deposit-account', timeDepositAccount);
    const depositSnapshot = await getDoc(depositRef);
    if (depositSnapshot.exists()) {
      const deposit = depositSnapshot.data();
      deposit.time_deposit_account = timeDepositAccount;
      return deposit;
    }
    return null;
  }

  getDepositIndex(timeDepositAccount) {
		return this.depositList.map(
      (el) => el.time_deposit_account
    ).indexOf(timeDepositAccount);
	}
  // Update
  async updateDeposit(timeDepositAccount, data) {
    console.log('*** updateDeposit ***', timeDepositAccount, data);
    const depositRef = doc(this.db, 'foreign-time-deposit-account', timeDepositAccount);
    await updateDoc(depositRef, {
      history: arrayUnion(data)
    });
    const index = this.getDepositIndex(timeDepositAccount);
    const deposit = await this.getDeposit(timeDepositAccount);
    if (deposit) {
      this.depositList = [
        ...this.depositList.slice(0, index),
        deposit,
        ...this.depositList.slice(index + 1)
      ];
    } else {
      this.depositList = [
        ...this.depositList.slice(0, index),
        ...this.depositList.slice(index + 1)
      ];
    }
  }
  addDepositHistory(evt) {
    console.log('*** addDepositHistory ***');
    if (evt.target.tagName !== 'BUTTON') return;
    const tr = evt.currentTarget;
    console.log('@@@@@ good', evt.target.tagName, tr,
      tr.querySelector('[name=time_deposit_account]').value,
      tr.querySelector('[name=interest_start_year]').value,
      tr.querySelector('[name=time_deposit_amount]').value,
      tr.querySelector('[name=received_gross_interest_amount]').value,
      tr.querySelector('[name=interest_rate]').value,
    );
    this.updateDeposit(
      tr.querySelector('[name=time_deposit_account]').value,
      {
        interest_start_year: +tr.querySelector('[name=interest_start_year]').value,
        time_deposit_amount: +tr.querySelector('[name=time_deposit_amount]').value,
        received_gross_interest_amount: +tr.querySelector('[name=received_gross_interest_amount]').value,
        interest_rate: +tr.querySelector('[name=interest_rate]').value,
      }
    );
  }

  // Delete
  async removeDepositAccount(evt) {
    const { timeDepositAccount } = evt.target.dataset;
    console.log('*** removeDepositAccount ***', timeDepositAccount);
    await deleteDoc(doc(this.db, 'foreign-time-deposit-account', timeDepositAccount));

    const index = this.getDepositIndex(timeDepositAccount);
    this.depositList = [
      ...this.depositList.slice(0, index),
      ...this.depositList.slice(index + 1)
    ];
  }

  render() {
    const costByCurrency = {};
    const valueByCurrency = {};
    const diff = {};
    const value = {};
    let totalCost = 0;
    let totalValue = 0;
    this.depositList.forEach((el) => {
      costByCurrency[el.currency] = (costByCurrency[el.currency] || 0) + el.cost;
      totalCost += el.cost;
      if (el.history) {
        const last = el.history[el.history.length - 1];
        valueByCurrency[el.currency] = (valueByCurrency[el.currency] || 0) + last.time_deposit_amount + last.received_gross_interest_amount;
      }
    });
    for (const key in valueByCurrency) {
      valueByCurrency[key] = valueByCurrency[key].toFixed(2);
      if (key in this.latestExchangeRate) {
        const v = (valueByCurrency[key] * this.latestExchangeRate[key]).toFixed(2);
        value[key] = v;
        diff[key] = (valueByCurrency[key] * this.latestExchangeRate[key] - costByCurrency[key]).toFixed(2);
        totalValue += +v;
        // valueByCurrency[key] += ` (NTD$${v} / <font color="${diff >= 0 ? 'red' : 'green'}">${diff}</font>)`;
      }
    }

    if (!this.db) {
      return html`<h1>Not initialized</h1>`
    }

    return html`
      <link href="base.css" rel="stylesheet">
      <link href="mobile.css" rel="stylesheet">

      <div id="container">
        <div class="summary container">
          <div>
            <div class="summary title">
              Amount<br/>
              <div class="summary time">(In NTD Equivalent)</div>
            </div>
            <ul>
            ${Object.keys(costByCurrency).sort().map((key) =>
              html`<li>(${key}) NTD$${costByCurrency[key]}</li>`
            )}
            </ul>
            <div class="summary value">${totalCost}</div>
          </div>
          <div>
            <div class="summary title">
              Exchange Rate<br/>
              <div class="summary time">(${this.latestExchangeRate.time})</div>
            </div>
            <ul>
            ${Object.keys(this.latestExchangeRate)
              .filter((key) => key !== 'time').sort().map((key) =>
                  html`<li>${key}: ${this.latestExchangeRate[key]}</li>`
            )}
            </ul>

          </div>
          <div>
            <div class="summary title">估值 (NTD)</div>
            <ul>
            ${Object.keys(diff).map((key) => {
              return html`<li>(${key}: ${valueByCurrency[key]}) NTD$${value[key]}, <font color="${diff[key] >= 0 ? '#FF5230' : '#65DD39'}">${diff[key]}</font></li>`
            })}
            </ul>
            <div class="summary value">${totalValue.toFixed(2)}</div>
            <div class="summary value">
              (<font color="${totalValue >= totalCost ? '#FF5230' : '#65DD39'}">${(totalValue - totalCost).toFixed(2)}</font>)
            </div>
          </div>
        </div>

        <div id="operating_area">
          <div id="sorting">
            <button @click=${this.sortByAccountAsc}>sort by time_deposit_account(asc)</button><br/>
            <button @click=${this.sortByAccountDesc}>sort by time_deposit_account(desc)</button><br/>
            <button @click=${this.sortByMonth}>sort by month</button><br/>
            <button @click=${this.sortByCurrency}>sort by currency</button><br/>
          </div>

          <div id="addition">
            定期存款帳戶: <input id="time_deposit_account" type="text"><br/>
            幣別:
            <select id="currency">
              <option value="USD" selected="selected">USD</option>
              <option value="CNY">CNY</option>
              <option value="AUD">AUD</option>
              <option value="NZD">NZD</option>
            </select><br/>
            NTD: <input id="cost" type="text"><br/>
            原始匯率: <input id="exchange_rate" type="text"><br/>
            起始日期: <input id="init_date" type="text" placeholder="${new Date().toLocaleDateString('zh-TW')}"><br/>
            <button @click=${this.addDepositAccount}>add</button>
          </div>
        </div>

        <div id="details">
        ${this.depositList.map((deposit) => {
          const expiryDate = deposit.history
            ? `${deposit.history[deposit.history.length - 1].interest_start_year + 2}/${deposit.month}/${deposit.day}`
            : null;
          let currVal = 0;
          if (deposit.history) {
            const lastRec = deposit.history[deposit.history.length - 1];
            currVal = (
              (lastRec.time_deposit_amount + lastRec.received_gross_interest_amount).toFixed(2) *
              this.latestExchangeRate[deposit.currency]
            ).toFixed(4);
          }
          return html`<div style="border: 1px solid #3B6BA7; background-color: white; margin: 5px; padding: 5px;">
            <button hidden @click=${this.removeDepositAccount} data-time-deposit-account="${deposit.time_deposit_account}">
              delete
            </button><br/>
            (${deposit.time_deposit_account}) 幣別: ${deposit.currency}, NTD: ${deposit.cost}, 匯率: ${deposit.exchange_rate},
            目前估值: ${currVal}
            (<font color="${currVal >= deposit.cost ? 'red' : 'green'}">${(currVal - deposit.cost).toFixed(4)}</font>)
            <table>
              <tr>
                <th>Interest Start Date</th>
                <th>Interest End Date</th>
                <th>Amount</th>
                <th>Gross Interest Amount</th>
                <th>Interest Rate (%)</th>
                <th>(Net Worth)</th>
              </tr>
              ${deposit.history ? deposit.history.map(rec => {
                return html`<tr>
                  <td>${rec.interest_start_year}/${deposit.month}/${deposit.day}</td>
                  <td>${rec.interest_start_year + 1}/${deposit.month}/${deposit.day}</td>
                  <td>${rec.time_deposit_amount}</td>
                  <td>${rec.received_gross_interest_amount}</td>
                  <td>${rec.interest_rate + '%'}</td>
                  <td>${(rec.time_deposit_amount + rec.received_gross_interest_amount).toFixed(2)}</td>
                </tr>`;
              }) : null}
              ${!deposit.history
                ? html`<tr @click=${this.addDepositHistory}>
                  <td>
                    <input
                      name="interest_start_year"
                      type="hidden"
                      value="${deposit.year}"
                    >
                    <span>
                      ${deposit.year}/${deposit.month}/${deposit.day}
                    </span>
                  </td>
                  <td>
                    <input name="time_deposit_account" type="hidden" value="${deposit.time_deposit_account}">
                    <span>${deposit.year + 1}/${deposit.month}/${deposit.day}</span>
                  </td>
                  <td><input name="time_deposit_amount" type="text"></td>
                  <td><input name="received_gross_interest_amount" type="text"></td>
                  <td><input name="interest_rate" type="text"></td>
                  <td><button>新增</button></td>
                </tr>`
                : null}
              ${(deposit.history && +new Date(expiryDate) < Date.now())
              ? html`<tr @click=${this.addDepositHistory}>
                <td>
                  <input
                    name="interest_start_year"
                    type="hidden"
                    value="${deposit.history[deposit.history.length - 1].interest_start_year + 1}"
                  >
                  <span>
                    ${deposit.history[deposit.history.length - 1].interest_start_year + 1}/${deposit.month}/${deposit.day}
                  </span>
                </td>
                <td>
                  <input name="time_deposit_account" type="hidden" value="${deposit.time_deposit_account}">
                  <span>${expiryDate}</span>
                </td>
                <td><input name="time_deposit_amount" type="text"></td>
                <td><input name="received_gross_interest_amount" type="text"></td>
                <td><input name="interest_rate" type="text"></td>
                <td><button>新增</button></td>
              </tr>`
              : null}
            </table>
          </div>`;
        })}
        </div>
      </div>
    `;
  }
}

customElements.define('foo-bar', FooBar);
