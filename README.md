# Utrecht Time Machine - Front-end
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.6.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project.

## Production deployment
To deploy to production (https://utrechttimemachine.nl), simply push to the main branch. A GitHub Action builds and pushes a Docker image to the VPS over SSH automatically.

## Development deployment
> [!CAUTION]
> Do **NOT** copy the **robots.txt** file to the development environment, to ensure the website is not indexed by search engines.

To deploy to the development environment (http://dev.utrechttimemachine.nl/), run `npm run build:dev` and place all `dist/` files **except for the `robots.txt` file** in the `/var/www/dev.utrechttimemachine.nl/public_html` folder on the VPS.

Note that this development environment **does not use [SSR](https://angular.dev/guide/ssr)**, so functionality on dev might not be a perfect representation of how things will perform on production.
