game.display = {
    container: "",

    layer: {
        name: "",
        canvas: "",
        context2D: "",
        posX: null,
        posY: null,
        width: "",
        height: "",
        backgroundColor: "",
        zIndex: "",

        clear: function () {
            this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    sprite: {
        width: 0,
        height: 0,
        posX: null,
        posY: null,
        imagePath: "",
        img: null
    },

    createSprite: function(width, height, posX, posY, imagePath) {
        let sprite = Object.create(this.sprite);

        sprite.width = width;
        sprite.height = height;
        sprite.posX = posX;
        sprite.posY = posY;
        sprite.imagePath = imagePath;
        sprite.img = new Image();
        sprite.img.src = imagePath;
        sprite.img.width = width;
        sprite.img.height = height;

        return sprite;
    },

    createLayer: function(name, width, height, htmlContainer, zIndex, backgroundColor, x, y) {
        let layer = Object.create(this.layer);

        layer.canvas = window.document.createElement("canvas");
        layer.canvas.id = name;

        if (backgroundColor !== undefined) {
            layer.canvas.style.background = backgroundColor;
        }

        layer.zIndex = zIndex;
        layer.canvas.style.zIndex = zIndex;

        layer.width = width;
        layer.canvas.width = width;

        layer.height = height;
        layer.canvas.height = height;

        if (x !== undefined) {
            layer.posX = x;
            layer.canvas.style.left = x;
        }
        if (y !== undefined) {
            layer.posY = y;
            layer.canvas.style.top = y;
        }

        layer.canvas.style.position = "absolute";

        if (htmlContainer !== undefined) {
            htmlContainer.appendChild(layer.canvas);
        } else {
            document.body.appendChild(layer.canvas);
        }

        layer.context2D = layer.canvas.getContext('2d');

        return layer;
    },

    drawRectangleInLayer: function(targetLayer, width, height, color, x, y) {
        targetLayer.context2D.fillStyle = color;
        targetLayer.context2D.fillRect(x, y, width, height);
    },

    drawTextInLayer: function(targetLayer, text, font, color, x, y) {
        targetLayer.context2D.font = font;
        targetLayer.context2D.fillStyle = color;
        targetLayer.context2D.fillText(text, x, y);
    },

    drawImageInLayer: function(targetLayer, image, x, y, width, height) {
        targetLayer.context2D.drawImage(image,x ,y, width, height);
    },

    drawCircleInLayer: function(targetLayer, x, y, color, width, height) {
        targetLayer.context2D.strokeStyle = color;
        targetLayer.context2D.fillStyle = color;
        targetLayer.context2D.arc(targetLayer.width/2, targetLayer.height/2, 45, 0, 2 * Math.PI);
        targetLayer.context2D.stroke();
    }
};