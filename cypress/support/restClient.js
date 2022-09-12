export class RestClient {
    /**
     * 
     * @param {string} rover Rover name to query the API
     * @param {int} sol The requested Martian Sol day
     * @returns Cypress.request()
     */
    getMarsPhotosByMarsSol = (rover, sol) => {
        return cy.request({
            method: 'GET',
            url: `${Cypress.env('rovers_url')}/${rover}/photos`,
            qs: {
                "sol": sol,
                "api_key": Cypress.env('API_KEY')
            }
        })
    }

    /**
     * 
     * @param {string} rover Rover name
     * @param {string} earth_date Date in format yyyy-mm-dd
     * @returns Cypress.request()
     */
     getMarsPhotosByEarthDate = (rover, earth_date) => {
        return cy.request({
            method: 'GET',
            url: `${Cypress.env('rovers_url')}/${rover}/photos`,
            qs: {
                "earth_date": earth_date,
                "api_key": Cypress.env('API_KEY')
            }
        })
    }

    /**
     * 
     * @param {string} rover Rover name
     * @returns Cypress.request()
     */
    getRoverManifest = (rover) => {
        return cy.request({
            method: 'GET',
            url: `${Cypress.env('manifests_url')}/${rover}`,
            qs: {
                "api_key": Cypress.env('API_KEY')
            }
        })
    }
}

export const restClient = new RestClient();