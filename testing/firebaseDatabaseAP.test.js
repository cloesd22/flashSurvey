var fbd = require('../firebaseDatabaseAP');
var chai = require('chai');
var expect = chai.expect;
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
var axios =

    describe('Database diagnostics test - ', () => {

        var db;
        var dbCounter;
        before(() => {
            db = new fbd.FirebaseDBAAP('logs');
            dbCounter = new fbd.FirebaseDBAAP('counter');
        })

        it('it connects to the database and reads the logs file identifying each element has a userIP and vote', (done) => {

            db.ReadALLRT().then((data) => {


                Object.keys(data).forEach((key) => {
                    expect(data).to.have.nested.property(key + '.userIP');
                    expect(data).to.have.nested.property(key + '.vote');
                })

                done();
            });

        }).timeout(3500);

        it('looks for specified userIP record and returns it', (done) => {
            db.ReadSPEC('userIP', '78.56.164.133').then((result) => {
                if (typeof (result) != 'string') {
                    Object.keys(result).forEach((key) => {
                        expect(result).to.have.nested.property(key + '.userIP');
                        expect(result).to.have.nested.property(key + '.vote');
                        done();
                    })
                } else {
                    expect(result).to.be.equal('empty');
                    done();
                }

            });
        })

        it('looks for fake non-existent record and returns empty', (done) => {
            db.ReadSPEC('userIP', 'xttw.dosafnauewqe3').then((result) => {
                if (typeof (result) != 'string') {
                    Object.keys(result).forEach((key) => {
                        expect(result).to.have.nested.property(key + '.userIP');
                        expect(result).to.have.nested.property(key + '.vote');
                        done();
                    })
                } else {
                    expect(result).to.be.equal('empty');
                    done();
                }

            });
        })

        it('searches for undefined', (done) => {
            db.ReadSPEC('userIP', undefined).then((result) => {
                if (typeof (result) != 'string') {
                    Object.keys(result).forEach((key) => {
                        expect(result).to.have.nested.property(key + '.userIP');
                        expect(result).to.have.nested.property(key + '.vote');
                        done();
                    })
                } else {
                    expect(result).to.be.equal('empty');
                    done();
                }

            });
        })

        it('looks for specified record and returns it', (done) => {
            db.ReadSPEC('userIP', 'Unknown15pt8joj86f90uu').then((result) => {
                if (typeof (result) != 'string') {
                    Object.keys(result).forEach((key) => {
                        expect(result).to.have.nested.property(key + '.userIP');
                        expect(result).to.have.nested.property(key + '.vote');
                        done();
                    })
                } else {
                    expect(result).to.be.equal('empty');
                    done();
                }

            });
        })


        it('it should push a vote log into the database', (done) => {
            db.CreateSPEC({ 'userIP': '192.168.1.1', vote: 1 }).then((returned) => {
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    expect(result).to.not.be.equal('empty');
                    expect(returned).to.have.string('Success');
                    done();
                })

            })
        })

        it('it should erase a vote log into the database', (done) => {
            db.DeleteSPEC('userIP', '192.168.1.1').then((returned) => {
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    expect(result).to.be.equal('empty');
                    expect(returned).to.have.string('Success');
                    done();
                })
            })
        })

        it('it should fail to push an empty log into the database', (done) => {
            db.CreateSPEC(null).then((returned) => {
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    expect(result).to.be.equal('empty');
                    expect(returned).to.have.string('Invalid');
                    done();
                })
            }).catch((err) => {
                expect(err).to.have.string('Invalid');
                done();
            })
        })

        it('it should not fail on a request to erase non-existent vote from the database', (done) => {
            db.DeleteSPEC('userIP', '192.168.1.1').then((returned) => {
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    expect(result).to.be.equal('empty');
                    done();
                })
            })
        })

        it('it should fail to push an invalid log into the database', (done) => {
            db.CreateSPEC({ 'userIP': '192.168.1.1', vote: 6 }).then((returned) => {
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    done();
                })
            }).catch((err) => {
                expect(err).to.have.string('Invalid');
                db.ReadSPEC('userIP', '192.168.1.1').then((result) => {
                    expect(result).to.be.equal('empty');
                    done();
                })
            })
        })

        it('should over-write the counter succesfully', (done) => {
            var currentVote;
            dbCounter.ReadALLRT().then((data) => {
                currentVOTE = data;


                dbCounter.OverwriteSPEC({ against: 5, date: Date.now(), for: 3, value: 86 }).then((result) => {
                    dbCounter.ReadALLRT().then((data) => {
                        expect(data.against).to.be.equal(5);
                        expect(data.for).to.be.equal(3);
                        expect(data.value).to.be.equal(86);
                        dbCounter.OverwriteSPEC(currentVOTE).then((result) => {
                            dbCounter.ReadALLRT().then((data) => {
                                expect(data.against).to.be.equal(currentVOTE.against);
                                expect(data.for).to.be.equal(currentVOTE.for);
                                expect(data.value).to.be.equal(currentVOTE.value);
                            })
                            done();
                        })
                    })
                })
            })
        })

        it('should setup a listener, and trigger on counterChange events', (done) => {
            //save current counter status
            //setup listener
            //trigger 3 event adds, check each triggers the listener,
            //reset initial counter status.

            var currentVOTE;
            var counterChanges = [];

            dbCounter.ReadALLRT().then((data) => {
                currentVOTE = data;


                var recordChanges = (data) => {
                    counterChanges.push(data);
                }

                var count = dbCounter.addChangeListener(recordChanges).then((refData) => {
                    dbCounter.OverwriteSPEC({ against: 1, date: Date.now(), for: 1, value: 1 }).then((result) => {
                        dbCounter.OverwriteSPEC({ against: 2, date: Date.now(), for: 2, value: 2 }).then((result) => {
                            dbCounter.OverwriteSPEC({ value: 3, against: 3, date: Date.now(), for: 3 }).then((result) => {
                                expect(counterChanges.length).to.be.equal(4);
                                dbCounter.OverwriteSPEC(currentVOTE).then((result) => {
                                    done();                                    
                                })

                            })
                        })
                    })


                })
            })
        }).timeout(7000);
    })
