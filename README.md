# 🗺️ Cubemap format converter

An online tool to convert cubemaps between different formats.

## Supported formats

Upon uploading an image, the current format will be automatically detected.  
The example cubemap images are taken from the [Godot documentation](https://docs.godotengine.org/en/stable/classes/class_cubemap.html).

| Format           |                               Example                               |
| :--------------- | :-----------------------------------------------------------------: |
| Row (6x1)        |       <img src="./docs/img/cubemap_6x1.png" width="200px" />        |
| Column (1x6)     |       <img src="./docs/img/cubemap_1x6.png" height="200px" />       |
| Row (3x2)        |       <img src="./docs/img/cubemap_3x2.png" width="200px" />        |
| Column (2x3)     |       <img src="./docs/img/cubemap_2x3.png" height="200px" />       |
| Horizontal Cross | <img src="./docs/img/cubemap_horizontal_cross.png" width="200px" /> |
| Vertical Cross   | <img src="./docs/img/cubemap_vertical_cross.png" height="200px" />  |
| Equirectangular  | <img src="./docs/img/cubemap_equirectangular.png" width="200px" />  |

You can use this image to test the tool (from [Learn OpenGL](https://learnopengl.com/Advanced-OpenGL/Cubemaps)):
![Sample cubemap](./docs/img/cubemap_skybox.png)

## Project Setup

This project is made with Vue.js.

### Install dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
