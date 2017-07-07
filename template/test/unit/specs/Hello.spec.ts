import Vue from 'vue';
import Hello from '../../../src/components/Hello.vue';
import {expect} from 'chai';
describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const vm = new Hello();
    vm.$mount();
    expect(vm.myVar).to.equal('hi there');
    // expect(vm.$el.querySelector('.hello h1').textContent)
    //   .to.equal('Welcome to Your Vue.js App')
  });
});
