var app = require('../app.js');
var chai = require('chai');
var expect = chai.expect;

describe('date function tests',() => {

    it('it should contain name and age',() => {
        var value = app.formatDateSince((1506601680946));
        expect(value).to.have.property('name'&&'value');
        
    })

    it('It should produce a date greater than 30 minutes',() => {
        var value = app.formatDateSince((1506601680946));
        expect(value.value).to.be.above(30);     
    })

    it('it should make sure the current date is 0 Seconds from itself',() => {
        var value = app.formatDateSince((Date.now()));
        expect(value.value).to.be.equal(0);     
        expect(value.name).to.be.equal('Seconds');             
    })

    it('It should count 5 seconds, for a date 5 seconds ago', function(done){
        var value = app.formatDateSince((Date.now()-5000));
        this.timeout(6000);
        setTimeout(() => {
            expect(value.value).to.be.equal(5); 
            expect(value.name).to.be.equal('Seconds'); 
            done();
        },5000)

    })
})  

describe('geo location testing',()=>{
    it('it should find Sydney',()=>{
        var req = {headers:{'x-forwarded-for':'115.64.64.83'}};
        var result = app.getloc(req,'115.64.64.83','city')

        expect(result).to.be.equal("Sydney");
    })

    it('it should find Vilnius',()=>{
        var req = {headers:{'x-forwarded-for':'78.56.164.133'}};
        var result = app.getloc(req,'78.56.164.133','city')

        expect(result).to.be.equal("Vilnius");
    })

    it('it should find Nuremberg',()=>{
        var req = {headers:{'x-forwarded-for':'213.239.207.147'}};
        var result = app.getloc(req,'213.239.207.147','city')

        expect(result).to.be.equal("Nürnberg");
    })

    it('it should find Shenzhen',()=>{
        var req = {headers:{'x-forwarded-for':'58.60.165.48'}};
        var result = app.getloc(req,'58.60.165.48','city')

        expect(result).to.be.equal("Shenzhen");
    })

    it('it should find Unknown Location (no city information)',()=>{
        var req = {headers:{'x-forwarded-for':'185.121.177.0'}};
        var result = app.getloc(req,'185.121.177.0','city')

        expect(result).to.be.equal("an Unknown Location");
    })

    it('it should find Unknown Location (Garbage IP)',()=>{
        var req = {headers:{'x-forwarded-for':'sdas.17w7.0'}};
        var result = app.getloc(req,'1asw.s7.0','city')
        expect(result).to.be.equal("an Unknown Location");
    })
})