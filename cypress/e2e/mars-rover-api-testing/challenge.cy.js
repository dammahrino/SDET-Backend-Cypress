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


            requestedPhotos.forEach( (photo, index) => {
                cy.log(`Photo ${index + 1}: ${photo.img_src}`);
            })
        })
    });

    it(`Retrieve the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on Earth date equal to ${Cypress.env('sol')} Martian Sol.`, () => {
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


            requestedPhotos.forEach( (photo, index) => {
                cy.log(`Photo ${index + 1}: ${photo.img_src}`);
            })
        })
    });
});