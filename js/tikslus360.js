/*
Tikslus360 v 1.0.0 
Author: Pushpendra Singh Chouhan @ pushpendra.as400@gmail.com
http://tikslus.com
*/

let mouseDown = 0;
let check = 0;
(function ($) {
    var Tikslus360 = function (element, options) {
        var view360 = $(element);
        var obj = this;
        var defaults = {
            imageDir: 'images',
            imageExt: 'jpg', //could be png,jpg,bmp
            imageCount: 0,
            zoomPower: 0,
            zoomRadius: 0,
            autoRotate: false,
            autoRotateInterval: 100,
            fadeInInterval: 400,
            canvasWidth: 0,
            canvasHeight: 0,
            canvasID: ''


        };

        var canvas;
        var loaded = false;
        var context;
        var iMouseX, iMouseY = 1;
        var bMouseDown = false;
        var tx;
        var img_Array = new Array();
        var ga = 0.0;
        var fadeTimerId = 0;
        var auto_rotate_count = 0;
        var autoRotateTimeId = 0;
        var modulus = 0;
        var zoomOn = 0; //number of image when mouse was pressed
        var autorotate_button;
        let body;

        // Extend our default options with those provided.
        options = $.extend(defaults, options);



        var clear = function () { // clear canvas function
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }

        var load_images = function () {



            for (var i = 0; i < options.imageCount; i++) {
                img_Array[i] = new Image();

                img_Array[i].src = options.imageDir + "/" + i + "." + options.imageExt;
                clear();
                img_Array[i].onload = function () {
                    context.font = 'italic 20pt Calibri';
                    //context.fillText('Loading 360 ...', 150, 100);

                }
            }
            //fadeIN first image 
            //fadeTimerId=setInterval(function(){fadeIn();}, options.fadeInInterval);

        }

        var fadeIn = function () {
            clear();
            context.globalAlpha = ga;
            image = new Image();

            image.onload = function () {
                context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
            };
            image.src = options.imageDir + "/" + "1." + options.imageExt;


            ga = ga + 0.1;
            if (ga > 1.0) {

                clearInterval(fadeTimerId);
            }

        }

        var init_ = function () {
            if (options.canvasWidth == 0) { alert("Provide a CANVAS WIDTH"); }
            if (options.canvasHeight == 0) { alert("Provide a CANVAS Height"); }
            if (options.imageCount <= 0) { alert("provide IMAGE COUNT "); }
            if (options.canvasID == "") { alert("provide CANVAS ID "); }
            // if (options.zoomPower <= 0) { alert("Zoom Power have a value of greater than 0"); }
            // if (options.zoomRadius < 50) { alert("Provide a Zoom Radius of at least 50 or more "); }
            if (options.imageExt == "") { alert("Provide Image extension. Ex: png,jpg"); }
            if (options.imageDir == "") { alert("Provide Image Direcotry"); }


            view360.append("<canvas id='" + options.canvasID + "' width='" + options.canvasWidth + "' height='" + options.canvasHeight + "'></canvas>").css({ cursor: 'e-resize' });
            // view360.css({ width: options.canvasWidth + "px", height: options.canvasHeight + "px", position: 'relative' });
            canvas = document.getElementById(options.canvasID);
            body = document.getElementsByTagName("BODY")[0];
            context = canvas.getContext('2d');
            // tx = canvas.width / options.imageCount;
            tx = canvas.width / options.imageCount;
            body = window.innerWidth/ options.imageCount;
            view360.find('.autorotate').css({ position: "absolute", right: "1%", bottom: '1%', display: 'block', padding: '5px' });
            clear();
            load_images();

            //fadeIN first image 
            fadeTimerId = setInterval(function () {
                fadeIn();
            }, options.fadeInInterval);
            if (options.autoRotate == true && typeof img_Array[options.imageCount] != 'undefined') {
                //start_auto_rotate();
                view360.find(".autorotate").text("Stop Auto Rotate");
            }

            //event handling
            view360.find("canvas").mousedown(function (e) {
                stop_auto_rotate();
                $("body").mousemove(function (e) {
                    mouseDown = 1;
                    var canvasOffset = $(canvas).offset();
                    iMouseX = Math.floor(e.pageX - canvasOffset.left);
                    iMouseY = Math.floor(e.pageY - canvasOffset.top);
                    modulus = Math.ceil(iMouseX / tx) % options.imageCount;
                    modulus = iMouseX >= 1 ? modulus : (modulus + options.imageCount) % options.imageCount
                    if(modulus == 0){
                        modulus += 1
                    }
                    
                    console.log(modulus + "modulus")
                    if (options.autoRotate == false && bMouseDown == false) {
                        rotate360(modulus);
                    }

                    if (bMouseDown == true) {
                        zoom(img_Array[zoomOn]);
                    }
                });
            });

            view360.find("#" + options.canvasID).mousedown(function (e) { //  mousedown event
                //    bMouseDown = true;
                //stop_auto_rotate();
                mouseDown = 1;
                if (options.autoRotate == true) { stop_auto_rotate(); }
            });
          

            // new
            $(document).mouseup(function (e) { // binding mouseup event
                mouseDown = 0;
                view360.find("#" + options.canvasID).unbind('mousemove');
                
                bMouseDown = false;
                zoomOn = 0;
                $(this).css({ cursor: 'e-resize' });
                console.log('mouseup')
            });

            view360.mouseover(function(){
                if(mouseDown == 0){
                    check = 1
                    start_auto_rotate()
                    console.log('mouseover' + options.canvasID)
                }
                
            });

            view360.mouseout(function(){
            check = 0
                 
                stop_auto_rotate()
                
            
            // console.log('mouseout')
            });

          
        }



        var rotate360 = function (img_no) {
            clear();
            context.drawImage(img_Array[img_no], 0, 0, context.canvas.width, context.canvas.height);
        }

        var start_auto_rotate = function () {
            options.autoRotate = true;
            autoRotateTimeId = setInterval(function () { auto_rotate360(); }, options.autoRotateInterval);
        }
        function stop_auto_rotate() {
            options.autoRotate = false;
            clearInterval(autoRotateTimeId);
        }

        function auto_rotate360() {
            if (modulus > 0 && modulus <= options.imageCount && auto_rotate_count <= 0) { auto_rotate_count = modulus; }
            auto_rotate_count++;
            if (auto_rotate_count > options.imageCount) {
                auto_rotate_count = 1;
            }
            rotate360(auto_rotate_count);
        }







        var zoom = function (image) { // main zoom function

            clear(); // clear canvas
            if (bMouseDown) { // drawing zoom area
                context.drawImage(image, 0 - iMouseX * (options.zoomPower - 1), 0 - iMouseY * (options.zoomPower - 1), context.canvas.width * options.zoomPower, context.canvas.height * options.zoomPower);
                context.globalCompositeOperation = 'destination-atop';
              
                context.beginPath();
                context.arc(iMouseX, iMouseY, options.zoomRadius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
            // draw source image
            context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        }

        init_();

    };

    $.fn.tikslus360 = function (options) {
        var dd = this.each(function () {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('tikslus360')) return;

            // pass options to plugin constructor
            var tikslus360 = new Tikslus360(this, options);

            // Store plugin object in this element's data
            element.data('tikslus360', tikslus360);
        });

        return dd;

    };
})(jQuery);	 
