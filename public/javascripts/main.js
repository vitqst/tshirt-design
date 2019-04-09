// Canvas dimensions as constants.
let CANVAS_WIDTH = 750
let CANVAS_HEIGHT = 600

// Array to keep track of the history.
let state = []
let mods = 0

function putImageOnCanvas(url, isUserAdded = true) {
  fabric.Image.fromURL(url, function(oImg) {
    let imageWidth = isUserAdded ? canvas.getWidth() * 0.35 : canvas.getWidth() * 0.9
    oImg.scaleToWidth(imageWidth)
    // Adds image to canvas.
    canvas.add(oImg)
    canvas.centerObject(oImg)
    // Need this line, or else the new image cannot be edited.
    oImg.setCoords()
    if (isUserAdded) {
      canvas.setActiveObject(oImg)
    }
    canvas.renderAll()
    updateModifications(true)
    canvas.counter++
  })
}

function setTshirtImage(url) {
  let center = canvas.getCenter()
  canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas), {
    backgroundImageOpacity: 1,
    backgroundImageStretch: false,
    scaleX: 2,
    scaleY: 2,
    top: center.top,
    left: center.left,
    originX: "center",
    originY: "center"
  })
  canvas.renderAll()
}

// Canvas initialization.
let canvas = new fabric.Canvas("canvas")
let whiteShirtUrl = "/public/art/tat.jpeg"

canvas.setWidth(CANVAS_WIDTH)
canvas.setHeight(CANVAS_HEIGHT)

setTshirtImage(whiteShirtUrl)

// Menu button listeners.
$(".upload-btn").on("click", function() {
  $("#upload-input").click()
  $(".progress-bar").text("0%")
  $(".progress-bar").width("0%")
})

$(".upload").on("click", function() {
  $("#text-area").hide()

  $(".menuArrow").show()
  $("#uploads").show()
  $("#uploads").css("display", "inline-block")
})

$(".text-insert").on("click", function() {
  $("#uploads").hide()

  $(".menuArrow").show()
  $("#text-area").show()
  $("#text-area").css("display", "inline-block")
})

$(".load-saved").on("click", function() {
  $("#uploads").hide()
  $("#text-area").hide()

  $(".menuArrow").show()
  $("#load-saved-design").show()
  $("#load-saved-design").css("display", "inline-block")

})

// Listener for the load design function.
$("#load-button").on("click", function() {
  $.ajax({
    url: "/load",
    type: "POST",
    data: { "value": $("#load-id-input").val() },
    success: function(data) {
      // Show the relevant notifications for load success/failure.
      if (data == "undefined") {
        sweetAlert({
          title: "Id does not exist!",
          type: "warning"
        })
      } else {
        sweetAlert({
          title: "Load Success!",
          type: "success"
        })
        console.log("Load successful!\n")
        canvas.clear().renderAll()

        canvas.loadFromJSON(data)
        setTshirtImage(whiteShirtUrl)

        canvas.renderAll()
      }

    }
  })
})

// Listener for the insert text button.
$("#text-button").on("click", function() {
  // Make sure the text field is centered when inserted.
  let center = canvas.getCenter()
  let newTextBox = new fabric.IText("Click here to edit text!", {
    fontFamily: "arial black",
    scaleX: 0.60,
    scaleY: 0.60,
    top: center.top,
    left: center.left,
    originX: "center",
    originY: "center"
  })
  canvas.add(newTextBox)
  canvas.setActiveObject(newTextBox)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

// Listeners for the text box menu.
$("#text-color").on("change", function() {
  canvas.getActiveObject().setFill(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-bg-color").on("change", function() {
  canvas.getActiveObject().setBackgroundColor(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-lines-bg-color").on("change", function() {
  canvas.getActiveObject().setTextBackgroundColor(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-stroke-color").on("change", function() {
  canvas.getActiveObject().setStroke(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-stroke-width").on("change", function() {
  canvas.getActiveObject().setStrokeWidth(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#font-family").on("change", function() {
  canvas.getActiveObject().setFontFamily(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-font-size").on("change", function() {
  canvas.getActiveObject().setFontSize(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-line-height").on("change", function() {
  canvas.getActiveObject().setLineHeight(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

$("#text-align").on("change", function() {
  canvas.getActiveObject().setTextAlign(this.value)
  canvas.renderAll()
  updateModifications(true)
  canvas.counter++
})

// Text style radio button handler.
radios5 = document.getElementsByName("fonttype")
for (let i = 0, max = radios5.length; i < max; i++) {
  radios5[i].onclick = function() {

    if (document.getElementById(this.id).checked == true) {
      if (this.id == "text-cmd-bold") {
        canvas.getActiveObject().set("fontWeight", "bold")
      }
      if (this.id == "text-cmd-italic") {
        canvas.getActiveObject().set("fontStyle", "italic")
      }
      if (this.id == "text-cmd-underline") {
        canvas.getActiveObject().set("textDecoration", "underline")
      }
      if (this.id == "text-cmd-linethrough") {
        canvas.getActiveObject().set("textDecoration", "line-through")
      }
      if (this.id == "text-cmd-overline") {
        canvas.getActiveObject().set("textDecoration", "overline")
      }

    } else {
      if (this.id == "text-cmd-bold") {
        canvas.getActiveObject().set("fontWeight", "")
      }
      if (this.id == "text-cmd-italic") {
        canvas.getActiveObject().set("fontStyle", "")
      }
      if (this.id == "text-cmd-underline") {
        canvas.getActiveObject().set("textDecoration", "")
      }
      if (this.id == "text-cmd-linethrough") {
        canvas.getActiveObject().set("textDecoration", "")
      }
      if (this.id == "text-cmd-overline") {
        canvas.getActiveObject().set("textDecoration", "")
      }
    }
    updateModifications(true)
    canvas.counter++

    canvas.renderAll()
  }
}

$("#upload-input").on("change", function() {
  // sweetAlert({
  //   title: "This function not develop yet",
  //   type: "warning"
  // })

  let file = $(this).get(0).files[0];
  let reader = new FileReader();

  reader.addEventListener("load", function() {
    let url = reader.result;
    putImageOnCanvas(url);
    $(this).val("");
  }, false)

  if (file) {
    reader.readAsDataURL(file)
  }

  // let uploadImageUrl = ""
  // let uploadUrlPrefix = "uploads/"
  // if (files.length > 0) {
  //   let formData = new FormData()
  //
  //   for (let i = 0; i < files.length; i++) {
  //     let file = files[i]
  //     // add the files to formData object for the data payload
  //     formData.append("uploads[]", file, file.name)
  //     uploadImageUrl = uploadUrlPrefix + file.name
  //   }
  //
  //   $.ajax({
  //     url: "/upload",
  //     type: "POST",
  //     data: formData,
  //     processData: false,
  //     contentType: false,
  //     success: function(data) {
  //       sweetAlert({
  //         title: "Upload Success!",
  //         type: "success"
  //       })
  //       console.log("Upload successful!\n" + data)
  //       console.log(data)
  //       putImageOnCanvas(uploadImageUrl)
  //
  //     },
  //     xhr: function() {
  //       // Create an XMLHttpRequest.
  //       let xhr = new XMLHttpRequest()
  //
  //       // Listen to the 'progress' event.
  //       xhr.upload.addEventListener("progress", function(evt) {
  //
  //         if (evt.lengthComputable) {
  //           // Calculate the percentage of upload completed.
  //           let percentComplete = evt.loaded / evt.total
  //           percentComplete = parseInt(percentComplete * 100)
  //
  //           // Update the Bootstrap progress bar with the new percentage.
  //           $(".progress-bar").text(percentComplete + "%")
  //           $(".progress-bar").width(percentComplete + "%")
  //
  //           // Once the upload reaches 100%, set the progress bar text to done.
  //           if (percentComplete === 100) {
  //             $(".progress-bar").html("Done")
  //           }
  //
  //         }
  //
  //       }, false)
  //
  //       return xhr
  //     }
  //   })
  // }
})

$("#save-button").on("click", function() {
  var link = document.getElementById("link")
  link.setAttribute("download", "my-design" + ".png")
  link.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
  link.click()
  // $.ajax({
  //   url: "/save",
  //   type: "POST",
  //   data: { "value": JSON.stringify(canvas).toString() },
  //   success: function(data) {
  //     console.log("Save successful!\n")
  //     sweetAlert({
  //       title: "Save success! Your id is  " + data,
  //       type: "success"
  //     })
  //
  //   }
  // })
})

// Handling editing history.
canvas.on(
  "object:modified", function() {
    updateModifications(true)
  },
  "object:added", function() {
    updateModifications(true)
  })

function updateModifications(savehistory) {
  if (savehistory === true) {
    myjson = JSON.stringify(canvas)
    state.push(myjson)
  }
}

$("#undo-button").on("click", function undo() {
  let stateNum = state.length - 1 - mods - 1

  if (mods < state.length) {
    canvas.clear().renderAll()
    canvas.loadFromJSON(state[stateNum])
    setTshirtImage(whiteShirtUrl)
    canvas.renderAll()
    mods++
  }
})

$("#redo-button").on("click", function redo() {
  if (mods > 0) {
    canvas.clear().renderAll()
    canvas.loadFromJSON(state[state.length - 1 - mods + 1])
    setTshirtImage(whiteShirtUrl)
    canvas.renderAll()
    mods--
  }
})

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#scene-container' );

  // create a Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set( 0, 0, 10 );

  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
  // if you run into problems here
  const texture = textureLoader.load( 'textures/uv_test_bw.png' );

  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  const material = new THREE.MeshStandardMaterial( {
    map: texture,
  } );

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene object
  scene.add( mesh );

  // Create a directional light
  const light = new THREE.DirectionalLight( 0xffffff, 3.0 );

  // move the light back and up a bit
  light.position.set( 10, 10, 10 );

  // remember to add the light to the scene
  scene.add( light );

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // set the gamma correction so that output colors look
  // correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();

