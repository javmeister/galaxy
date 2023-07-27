# Velorum Galaxy Map

The Velorum Galaxy 3D map made with ThreeJS.

## Description

This is a 3D map of the Velorum Galaxy made with ThreeJS. It is served as a very basic Angular application with just a couple of routes. 

The Galaxy contains more than one hundred thousand solar systems, grouped into 2,000+ hexagonal-shaped sectors. The Galaxy was randomly generated and the data for the sectors, solar systems, and planets is stored as compressed JSON files in our CDN.

The map is rendered using WebGL and the ThreeJS library. The map is interactive and allows the user to zoom in and out, rotate, and pan the map. The map also allows the user to select a solar system and view the details of that solar system.

## Getting Started

The app is hosted in this repository's Github Pages with a custom domain: https://galaxy.javierlerones.dev. Feel free to open it, but be aware the CDN data files might be broken or outdated, causing loading errors.

## Galaxy

This is the Galaxy map, the app landing view:

![velorum-galaxy-map-screenshot-01](https://github.com/javmeister/galaxy/assets/5751787/355eefcf-a404-4336-8900-6c4985a2f784)

You can rotate, pan, and zoom in and out. Moving the mouse over the map will highlight the sector that you are pointing at, you can click on it to zoom into the sector itself.

## Sector

This is the Sector map:

![velorum-galaxy-map-screenshot-02](https://github.com/javmeister/galaxy/assets/5751787/679a3901-ba85-4a2b-8b38-c4d94b1ead4d)

The controls are pretty similar, you can rotate and pan. Clicking on a solar system marker, will zoom into it and show the solar system details windows.

## Solar System Details

This is the Solar System details view:

![velorum-galaxy-map-screenshot-03](https://github.com/javmeister/galaxy/assets/5751787/7aa74752-9d53-4eef-9eb5-7a608f9d89bc)

On the left side panel, there is information about the single/binary stars and their stats. Below that there is the list of planets, if the system has any. And finally at the bottom the average distributions of mineral/ore resources estimated to exist in that Solar System.

On the right side panel, the solar system's general details and description are listed, and below that an image of the Solar System itself as generated for the MECO event.

## Next Steps

Go check out the latest version of the game at https://velorum.games


