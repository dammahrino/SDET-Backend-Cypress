/// <reference types="cypress" />


describe('NASA SDET Challenge using Cypress', () => {
    it(`Retrieve the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on ${Cypress.env('sol')} Martian Sol.`, () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('rovers_url')}/${Cypress.env('rover')}/photos`,
            qs: {
                "sol": Cypress.env('sol'),
                "api_key": Cypress.env('API_KEY')
            }
        }).as('getPhotos');

        // Alliased request validation.
        cy.get('@getPhotos').then(response => {
            expect(response.status).to.equal(200);
            assert.isObject(response.body);
            assert.isArray(response.body.photos);

            const requestedPhotos = response.body.photos.slice(0, Cypress.env('n_photos'));
            assert.lengthOf(requestedPhotos, Cypress.env('n_photos'), `Retrieved ${Cypress.env('n_photos')} photos`);


            requestedPhotos.forEach(photo => {
                expect(photo.sol).is.not.null;
                expect(photo.sol).is.a('number');
                expect(photo.sol).is.equal(Cypress.env('sol'));

                expect(photo.rover).is.an('object');
                expect(photo.rover).is.not.empty;
                expect(photo.rover.name).is.equal(Cypress.env('rover'));

                expect(photo.img_src).is.not.empty;
                expect(photo.img_src).is.a('string', 'img_src is a string');
            });


            requestedPhotos.forEach((photo, index) => {
                cy.log(`Photo ${index + 1}: ${photo.img_src}`);
            })
        })
    });

    it(`Retrieve the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on Earth date equal to ${Cypress.env('sol')} Martian Sol.`, () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('manifests_url')}/${Cypress.env('rover')}`,
            qs: {
                "api_key": Cypress.env('API_KEY')
            }
        }).as('getRoverManifest');

        cy.get('@getRoverManifest').then(response => {
            expect(response.status).is.equal(200);
            assert.isObject(response.body);
            assert.isArray(response.body['photo_manifest'].photos);

            const manifest_object = response.body['photo_manifest'].photos.filter(photo => photo.sol === Cypress.env('sol'));
            expect(manifest_object).is.not.empty;
            expect(manifest_object[0]).is.not.null;
            expect(manifest_object[0].sol).to.be.equal(Cypress.env('sol'));

            const earth_date = manifest_object[0].earth_date;
            expect(earth_date).is.not.empty;
            expect(earth_date).is.a('string');
            expect(earth_date).to.match(/^\d{4}-\d{2}-\d{2}$/, 'Date matches date format');

            // Retrieving photos by Earth Day

            cy.request({
                method: 'GET',
                url: `${Cypress.env('rovers_url')}/${Cypress.env('rover')}/photos`,
                qs: {
                    "earth_date": earth_date,
                    "api_key": Cypress.env('API_KEY')
                }
            }).as('getPhotosByEarthDate');

            // Alliased request validation.
            cy.get('@getPhotosByEarthDate').then(response => {
                expect(response.status).to.equal(200);
                assert.isObject(response.body);
                assert.isArray(response.body.photos);

                const requestedPhotosByEarthDate = response.body.photos.slice(0, Cypress.env('n_photos'));
                assert.lengthOf(requestedPhotosByEarthDate, Cypress.env('n_photos'), `Retrieved ${Cypress.env('n_photos')} photos`);


                requestedPhotosByEarthDate.forEach(photo => {
                    expect(photo.sol).is.not.null;
                    expect(photo.sol).is.a('number');
                    expect(photo.earth_date).is.equal(earth_date);

                    expect(photo.rover).is.an('object');
                    expect(photo.rover).is.not.empty;
                    expect(photo.rover.name).is.equal(Cypress.env('rover'));

                    expect(photo.img_src).is.not.empty;
                    expect(photo.img_src).is.a('string', 'img_src is a string');
                });


                requestedPhotosByEarthDate.forEach((photo, index) => {
                    cy.log(`Photo ${index + 1}: ${photo.img_src}`);
                })
            });
        })
    });

    it(`Retrieve and comparte the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on ${Cypress.env('sol')} and on Earth date equal to ${Cypress.env('sol')} Martial Sol.`, () => {
        let earth_date;
        let requestedPhotosByEarthDate;
        let requestedPhotosBySolDay;
        
        cy.request({
            method: 'GET',
            url: `${Cypress.env('manifests_url')}/${Cypress.env('rover')}`,
            qs: {
                "api_key": Cypress.env('API_KEY')
            }
        }).as('getRoverManifest');

        cy.get('@getRoverManifest').then(response => {
            expect(response.status).is.equal(200);
            assert.isObject(response.body);
            assert.isArray(response.body['photo_manifest'].photos);

            const manifest_object = response.body['photo_manifest'].photos.filter(photo => photo.sol === Cypress.env('sol'));
            expect(manifest_object).is.not.empty;
            expect(manifest_object[0]).is.not.null;
            expect(manifest_object[0].sol).to.be.equal(Cypress.env('sol'));

            earth_date = manifest_object[0].earth_date;
            expect(earth_date).is.not.empty;
            expect(earth_date).is.a('string');
            expect(earth_date).to.match(/^\d{4}-\d{2}-\d{2}$/, 'Date matches date format');
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('rovers_url')}/${Cypress.env('rover')}/photos`,
                qs: {
                    "earth_date": earth_date,
                    "api_key": Cypress.env('API_KEY')
                }
            }).as('getPhotosByEarthDate');

            // Alliased request validation.
            cy.get('@getPhotosByEarthDate').then(response => {
                expect(response.status).to.equal(200);
                assert.isObject(response.body);
                assert.isArray(response.body.photos);

                requestedPhotosByEarthDate = response.body.photos.slice(0, Cypress.env('n_photos'));
                assert.lengthOf(requestedPhotosByEarthDate, Cypress.env('n_photos'), `Retrieved ${Cypress.env('n_photos')} photos`);


                requestedPhotosByEarthDate.forEach(photo => {
                    expect(photo.sol).is.not.null;
                    expect(photo.sol).is.a('number');
                    expect(photo.earth_date).is.equal(earth_date);

                    expect(photo.rover).is.an('object');
                    expect(photo.rover).is.not.empty;
                    expect(photo.rover.name).is.equal(Cypress.env('rover'));

                    expect(photo.img_src).is.not.empty;
                    expect(photo.img_src).is.a('string', 'img_src is a string');
                });
            }).then(() => {
                cy.request({
                    method: 'GET',
                    url: `${Cypress.env('rovers_url')}/${Cypress.env('rover')}/photos`,
                    qs: {
                        "sol": Cypress.env('sol'),
                        "api_key": Cypress.env('API_KEY')
                    }
                }).as('getPhotosBySolDay');

                // Alliased request validation.
                cy.get('@getPhotosBySolDay').then(response => {
                    expect(response.status).to.equal(200);
                    assert.isObject(response.body);
                    assert.isArray(response.body.photos);

                    const requestedPhotosBySolDay = response.body.photos.slice(0, Cypress.env('n_photos'));
                    assert.lengthOf(requestedPhotosBySolDay, Cypress.env('n_photos'), `Retrieved ${Cypress.env('n_photos')} photos`);


                    requestedPhotosBySolDay.forEach(photo => {
                        expect(photo.sol).is.not.null;
                        expect(photo.sol).is.a('number');
                        expect(photo.sol).is.equal(Cypress.env('sol'));

                        expect(photo.rover).is.an('object');
                        expect(photo.rover).is.not.empty;
                        expect(photo.rover.name).is.equal(Cypress.env('rover'));

                        expect(photo.img_src).is.not.empty;
                        expect(photo.img_src).is.a('string', 'img_src is a string');
                    });

                    assert.deepEqual(requestedPhotosBySolDay, requestedPhotosByEarthDate, 'Both photos arrays are equal!' | 'Arrays are different!');
                })
            })
        });
    });
});