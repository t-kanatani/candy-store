  var spots = {
    default: "taniguchi_outside",
    animationDur: 2000,
    spotList: {
      "taniguchi_outside": {
        img: "images/taniguchi_outside.jpg",
        rotation: "0 110 0",
        moveSpot: {
          front: "taniguchi_entrance"
        }
      },
      "taniguchi_entrance": {
        img: "images/taniguchi_entrance.jpg",
        rotation: "0 0 0",
        moveSpot: {
          front_r: "taniguchi_right01",
          right: "taniguchi_right02",
          left: "taniguchi_center02",
          back: "taniguchi_outside",
        }
      },
      "taniguchi_center02": {
        img: "images/taniguchi_center02.jpg",
        rotation: "0 0 0",
        moveSpot: {
          left: "taniguchi_left02",
          front: "taniguchi_center01",
          right: "taniguchi_entrance",
        }
      },
      "taniguchi_left02": {
        img: "images/taniguchi_left02.jpg",
        rotation: "0 0 0",
        moveSpot: {
          front: "taniguchi_left01",
          right: "taniguchi_center02",
        }
      },
      "taniguchi_left01": {
        img: "images/taniguchi_left01.jpg",
        rotation: "0 0 0",
        moveSpot: {
          right: "taniguchi_center01",
          back: "taniguchi_left02",
        }
      },
      "taniguchi_center01": {
        img: "images/taniguchi_center01.jpg",
        rotation: "0 0 0",
        moveSpot: {
          right: "taniguchi_right01",
          back: "taniguchi_center02",
          left: "taniguchi_left01",
        }
      },
      "taniguchi_right01": {
        img: "images/taniguchi_right01.jpg",
        rotation: "0 0 0",
        moveSpot: {
          back: "taniguchi_center01",
          right: "taniguchi_right02",
          back_r: "taniguchi_entrance"
        }
      },
      "taniguchi_right02": {
        img: "images/taniguchi_right02.jpg",
        rotation: "0 0 0",
        moveSpot: {
          back: "taniguchi_right01",
          front_r: "taniguchi_entrance",
        }
      },
    }
  };

  var wayInfo = {
    front: {
      spotPosition: "0 1 -1",
      skyAppearPosition: "0 0 -5000",
      skyFadePosition: "0 0 5000"
    },
    front_r: {
      spotPosition: "1 1 -1",
      skyAppearPosition: 5000/1.4 + " 0 " + -5000/1.4,
      skyFadePosition: -5000/1.4  + " 0 " + 5000/1.4
    },
    front_l: {
      spotPosition: "-1 1 -1",
      skyAppearPosition: -5000/1.4 + " 0 " + -5000/1.4,
      skyFadePosition: 5000/1.4 + " 0 " + 5000/1.4
    },
    right: {
      spotPosition: "1 1 0",
      skyAppearPosition: "5000 0 0",
      skyFadePosition: "-5000 0 0"
    },
    left: {
      spotPosition: "-1 1 0",
      skyAppearPosition: "-5000 0 0",
      skyFadePosition: "5000 0 0"
    },
    back: {
      spotPosition: "0 1 1",
      skyAppearPosition: "0 0 5000",
      skyFadePosition: "0 0 -5000"
    },
    back_r: {
      spotPosition: "1 1 1",
      skyAppearPosition: 5000/1.4 + " 0 " + 5000/1.4,
      skyFadePosition: -5000/1.4 + " 0 " + -5000/1.4
    },
    back_l: {
      spotPosition: "-1 1 1",
      skyAppearPosition: -5000/1.4 + " 0 " + 5000/1.4,
      skyFadePosition: 5000/1.4 + " 0 " + -5000/1.4
    }
  };

  AFRAME.registerComponent("initial", {
    init: function() {
      // create assets
      var sceneObj = document.querySelector("a-scene")
      var assetsObj = document.querySelector("a-assets");
      if (assetsObj === null) {
        assetsObj = document.createElement("a-assets");
        sceneObj.appendChild(assetsObj);
      }

      // add image file
      var spotList = spots["spotList"];
      for (key in spotList) {
        var img = document.createElement("img");
        img.setAttribute("src", spotList[key]["img"]);
        img.id = key;
        assetsObj.appendChild(img);
      }

      // add camera
      var cameraObj = document.querySelector("a-camera");
      if (cameraObj === null) {
        cameraObj = document.createElement("a-camera");
        cameraObj.setAttribute("position", "0 0 0");
        sceneObj.appendChild(cameraObj);
      }

      // add cursor
      var cursorObj = document.createElement("a-entity");
      cursorObj.setAttribute("cursor", "fuse: true; fuseTimeout: 1000");
      cursorObj.setAttribute("position", "0 0 -1");
      cursorObj.setAttribute("scale", "0.02 0.02 0.02");
      cursorObj.setAttribute("geometry", "primitive: ring");
      cursorObj.setAttribute("material", "color: #0095DD; shader: flat; opacity:0.7");
      cameraObj.appendChild(cursorObj);

      // add sky and moveSpot
      var nextId = spots["default"];
      var firstSky = createNewSky("front", nextId);
      firstSky.id = "shopview"
      var firstSpots = createNewSpot(nextId, spots["spotList"][nextId]["moveSpot"]);
      sceneObj.appendChild(firstSky);
      sceneObj.appendChild(firstSpots);
    }
  });

  AFRAME.registerComponent("move-action", {
    schema: {
      myId: {type: "string", default: "AAA"},
      myWay: {type: "string", default: "front"}
    },
    init: function() {
      var myId = this.data.myId;
      var myWay = this.data.myWay;
      var spotArgs = getSpotArgs(myId, myWay);
      var nextId = spotArgs["nextId"];
      var nextSpotList = spotArgs["nextSpotList"];
      var sceneObj = document.querySelector("a-scene");

      this.el.addEventListener("click", function() {
        var sky = modifyExistingSky(myWay);
        var spots = document.querySelector("#moveSpot");
        var new_sky = createNewSky(myWay, nextId);
        var new_spots = createNewSpot(nextId, nextSpotList);
        spots.parentNode.removeChild(spots);
        sceneObj.appendChild(new_sky);

        setTimeout(function() {
          sky.parentNode.removeChild(sky);
          new_sky.id = "shopview";
          sceneObj.appendChild(new_spots);
        }, spots["animationDur"]);
      });
    }
  });

  function createNewSky(myWay, nextId) {
    var spotInfo = spots["spotList"][nextId];

    var sky_tmp = document.createElement("a-sky");
    sky_tmp.id = "sky_tmp";
    sky_tmp.setAttribute("src", "#" + nextId);
    sky_tmp.setAttribute("position", wayInfo[myWay]["skyAppearPosition"]);
    sky_tmp.setAttribute("rotation", spotInfo["rotation"]);

    var animation_appear = document.createElement("a-animation");
    animation_appear.setAttribute("attribute", "position");
    animation_appear.setAttribute("to", "0 0 0");
    animation_appear.setAttribute("dur", spots["animationDur"]);
    animation_appear.setAttribute("easing", "ease-out-cubic");
    sky_tmp.appendChild(animation_appear);

    return sky_tmp;

  };

  function createNewSpot(nextId, nextSpotList) {
    var spots = document.createElement("a-entity");
    spots.id = "moveSpot";

    // item
/*    var item = document.createElement("a-box");
    item.setAttribute("color", "#4CC3D9");
    item.setAttribute("width", 0.2);
    item.setAttribute("depth", 0.2);
    item.setAttribute("height", 0.2);
    item.setAttribute("tap-action","myId: ; myWay: ");
    item.setAttribute("position", "0 2 -2");
    spots.appendChild(item);
*/    // --
    for (key in nextSpotList) {
      var spot = document.createElement("a-box");
      spot.id = key;
      spot.setAttribute("class", "spot");
      spot.setAttribute("color", "#4CC3D9");
      spot.setAttribute("width", 0.1);
      spot.setAttribute("depth", 0.1);
      spot.setAttribute("height", 0.1);
      spot.setAttribute("move-action","myId: " + nextId + "; myWay: " + key);
      spot.setAttribute("position", wayInfo[key]["spotPosition"]);
      spots.appendChild(spot);
      var spotAnime = document.createElement("a-animation");
      spotAnime.setAttribute("attribute", "rotation");
      spotAnime.setAttribute("from", "0 0 0");
      spotAnime.setAttribute("to", "180 180 0");
      spotAnime.setAttribute("repeat", "indefinite");
      spotAnime.setAttribute("easing", "linear");
      spotAnime.setAttribute("dur", 2000);
      spot.appendChild(spotAnime);
    }

    return spots;
  };

  function getSpotArgs(myId, myWay) {
    var spotInfo = spots["spotList"][myId];
    var nextId = spotInfo["moveSpot"][myWay];
    var nextSpotList = spots["spotList"][nextId]["moveSpot"];
    var spotArgs = {
      myId: myId,
      myWay: myWay,
      spotInfo: spotInfo,
      nextId: nextId,
      nextSpotList: nextSpotList
    }

      return spotArgs;
  };

  function modifyExistingSky(myWay) {
    var sky = document.querySelector("#shopview");
    var animation_fade = document.createElement("a-animation");
    animation_fade.setAttribute("attribute", "position");
    animation_fade.setAttribute("to", wayInfo[myWay]["skyFadePosition"]);
    animation_fade.setAttribute("dur",spots["animationDur"]);
    animation_fade.setAttribute("easing", "ease-out-cubic");
    sky.appendChild(animation_fade);

    var animation_opacity = document.createElement("a-animation");
    animation_opacity.setAttribute("attribute", "material.opacity");
    animation_opacity.setAttribute("to", 0);
    animation_opacity.setAttribute("dur", spots["animationDur"]);
    animation_opacity.setAttribute("easing", "ease-out-cubic");
    sky.appendChild(animation_opacity);

    return sky;
  };

  AFRAME.registerComponent("tap-action", {
    schema: {
    },
    init: function() {
      var sceneObj = document.querySelector("a-scene");
      this.el.addEventListener("click", function() {
        console.log("tap-action");
      });
    }
  });
