/// <reference types="cypress" />
import { restClient } from '../../support/restClient';


describe('NASA SDET Challenge using Cypress', () => {
    it(`Retrieve the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on ${Cypress.env('sol')} Martian Sol.`, () => {
        restClient
            .getMarsPhotosByMarsSol(Cypress.env('rover'), Cypress.env('sol'))
            .as('getPhotos');

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
            });
        });
    });

    it(`Retrieve the first ${Cypress.env('n_photos')} Mars photos made by "${Cypress.env('rover')}" on Earth date equal to ${Cypress.env('sol')} Martian Sol.`, () => {
        restClient
            .getRoverManifest(Cypress.env('rover'))
            .as('getRoverManifest');

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
            restClient
                .getMarsPhotosByEarthDate(Cypress.env('rover'), earth_date)
                .as('getPhotosByEarthDate');

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


        restClient
            .getRoverManifest(Cypress.env('rover'))
            .as('getRoverManifest');

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
            // Retrieving photos by Earth Date
            restClient
                .getMarsPhotosByEarthDate(Cypress.env('rover'), earth_date)
                .as('getPhotosByEarthDate');

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
                // Retrieving photos by Mars Sol
                restClient
                    .getMarsPhotosByMarsSol(Cypress.env('rover'), Cypress.env('sol'))
                    .as('getPhotosBySolDay');

                // Alliased request validation.
                cy.get('@getPhotosBySolDay').then(response => {
                    expect(response.status).to.equal(200);
                    assert.isObject(response.body);
                    assert.isArray(response.body.photos);

                    requestedPhotosBySolDay = response.body.photos.slice(0, Cypress.env('n_photos'));
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
                    cy.log('Images');
                    requestedPhotosByEarthDate.forEach((photo, index) => {
                        cy.log(`Photo ${index + 1}: ${photo.img_src}`);
                    });
                })
            })
        });
    });

    it(`Validate that the amounts of pictures that each "${Cypress.env('rover')}" camera took on ${Cypress.env('sol')} Mars Sols is not greater than 10 times the amount taken by other cameras on the same date.`, () => {
        let roverCameras;

        restClient
            .getRoverManifest(Cypress.env('rover'))
            .as('getRoverManifest');

        cy.get('@getRoverManifest').then(response => {
            expect(response.status).is.equal(200);
            assert.isObject(response.body);
            assert.isArray(response.body['photo_manifest'].photos);

            const manifest_object = response.body['photo_manifest'].photos.filter(photo => photo.sol === Cypress.env('sol'));
            expect(manifest_object).is.not.empty;
            expect(manifest_object[0]).is.not.null;
            expect(manifest_object[0].sol).to.be.equal(Cypress.env('sol'));

            // Retrieving the available cameras on the Sol Day requested.
            roverCameras = manifest_object[0].cameras;
            expect(roverCameras).is.not.empty;
        }).then(() => {
            // Retrieve all the photos of the Sol Day requested
            restClient
                .getMarsPhotosByMarsSol(Cypress.env('rover'), Cypress.env('sol'))
                .as('getPhotosBySolDay');

            // Alliased request validation.
            cy.get('@getPhotosBySolDay').then(response => {
                expect(response.status).to.equal(200);
                assert.isObject(response.body);
                assert.isArray(response.body.photos);

                // Split the photos in each of their cameras
                let photosPerCamera = [];
                roverCameras.forEach(camera => {
                    photosPerCamera.push(response.body.photos.filter(photo => photo.camera.name === camera));
                })

                // Validate all the possible combinations to ensure no camera has more than 10x photos than any other camera.
                for (let camera_index = 0; camera_index < roverCameras.length; camera_index++) {
                    for (let subcamera_index = 0; subcamera_index < roverCameras.length; subcamera_index++) {
                        if (!(camera_index == subcamera_index)) {
                            expect(photosPerCamera[camera_index].length).is.lessThan(10 * photosPerCamera[subcamera_index].length);
                        }
                    }
                }
            });
        });
    });
});